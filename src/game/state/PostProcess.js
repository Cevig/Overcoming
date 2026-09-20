import {
  calculateSortie,
  getInGameUnits,
  getNearestAllies,
  getNearestEnemies,
  getStatus,
  getUnstablePoints,
  handleUnitDeath,
  hasKeyword,
  hasStatus,
  isNotSame,
  isSame,
  logBuilding,
  logUnitName,
  logUnitStatus,
  resolveUnitsInteraction,
  shuffleArray,
  sortFightOrder
} from '../helpers/Utils';
import {
  Biom,
  Buildings,
  DamageType,
  SortieTypes,
  UnitKeywords,
  UnitStatus,
  UnitTypes
} from '../helpers/Constants';
import {getColorMap, startPositions} from "./Setup";
import {handleOnMoveActions} from "./GameActions";
import {createUnitObject} from "../units/Unit";
import i18n from "i18next";

/**
 * Generate a random ID string
 * @returns {string} Random ID
 */
const generateRandomId = () => Math.random().toString(10).slice(2);

/**
 * Set color map for the game grid
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @param {string} playerID - Player ID
 */
const setColorMap = (G, ctx, playerID) => {
  const isSetupPhase = ctx.phase === 'Setup';
  const targetObj = isSetupPhase ? G.players[+playerID] : G;
  const availablePoints = targetObj.availablePoints;

  // Set initial color map
  const colorMapTarget = targetObj.grid;
  colorMapTarget.colorMap = getColorMap(ctx.numPlayers);

  // Filter points based on availability
  Object.entries(colorMapTarget.colorMap).forEach(([color, points]) => {
    colorMapTarget.colorMap[color] = points.filter(mapPoint =>
      availablePoints.every(availablePoint => isNotSame(mapPoint)(availablePoint))
    );
  });

  // Set available points color
  colorMapTarget.colorMap['#dd666f'] = availablePoints;
};

/**
 * Handle the beginning of the building phase
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 */
export const onBuildingBegin = (G, ctx) => {
  // Process player houses and essence
  G.players.filter(p => p.isPlayerInGame).forEach(p => {
    p.houses.forEach(h => {
      if (h.name === Buildings.Svjatulushe.name) {
        p.essence += 8;
        G.serverMsgLog.push({
          id: generateRandomId(),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: i18n.t('log.svjatulushe_impact', {player: p.name, building: logBuilding("svjatulushe").name}),
        })
      }
    })
    p.essenceFreeze = p.essence
  })

  // Handle biom assignment
  let availableBioms = {...Biom}
  const getRandomBiom = () => {
    const biomKeys = Object.keys(availableBioms)
    const randKey = biomKeys[Math.floor(Math.random()*biomKeys.length)]
    const biom = availableBioms[randKey]
    delete availableBioms[randKey];
    return biom
  }

  // Assign bioms to players who don't have any
  G.players.filter(p => p.bioms.length === 0).forEach(p => {
    p.bioms = [getRandomBiom(), getRandomBiom()]
  })

  // Handle reinforcements for players with low health
  const pBioms = G.players.filter(p => p.isPlayerInGame).flatMap(p => p.bioms)
  const freeBioms = Object.values(availableBioms).filter(biom => pBioms.find(pBiom => biom === pBiom) === undefined)

  G.players.filter(p => p.isPlayerInGame && !p.isUsedReinforce && p.heals <= 5).forEach(p => {
    const randBiom = freeBioms[Math.floor(Math.random()*freeBioms.length)]
    const randType = [UnitTypes.Prispeshnick, UnitTypes.Prominkor, UnitTypes.Vestnick][Math.floor(Math.random()*3)]
    const newUnit = createUnitObject(generateRandomId(), p.id, randBiom, randType, 0, 2, 0)
    p.units.push(newUnit)
    p.isUsedReinforce = true
    G.serverMsgLog.push({
      id: generateRandomId(),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: i18n.t('log.reinforcement', {player: p.name})
    })
  })
}

export const onSetupBegin = (G, ctx, events) => {
  G.players.filter(p => p.isPlayerInGame).forEach(player => {
    const availablePoint = startPositions(ctx.numPlayers)[+player.id][0]
    let unit = player.units.find(u => u.type === UnitTypes.Idol)
    unit.unitState.point = availablePoint
    unit.unitState.isInGame = true
  })
}

/**
 * Handle the start of the positioning phase
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @param {Object} events - Game events
 * @returns {Object} Updated game state
 */
export const onPositioningStart = (G, ctx, events) => {
  // Initialize state
  G.grid.unstablePoints = [];
  G.endFightPhase = false;

  // Update player battle status
  G.players.filter(p => p.isPlayerInGame).forEach(p => {
    if (p.units.every(unit => unit.unitState.isInGame === false)) {
      p.isPlayerInBattle = false;
    }
  });

  // End phase if not enough players in battle
  const playersInBattle = G.players.filter(p => p.isPlayerInBattle).length;
  if (playersInBattle <= 1) {
    events.endPhase();
    return G;
  }

  const units = getInGameUnits(G);

  // Handle battlefield shrinking
  if ((G.shrinkZone >= 2) && (G.shrinkZone % 2 === 0)) {
    G.serverMsgLog.push({
      id: generateRandomId(),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: i18n.t('log.battlefield_shrink')
    });

    const unstablePoints = getUnstablePoints(G, ctx);
    units.filter(unit => unstablePoints.find(isSame(unit.unitState.point)))
      .forEach(unit => handleUnitDeath({G, ctx, events}, unit, null, true));

    G.grid.levels--;
  }

  // Set unstable points for odd shrink zones
  if ((G.shrinkZone >= 1) && (G.shrinkZone % 2 === 1)) {
    G.grid.unstablePoints = getUnstablePoints(G, ctx);
  }

  // Process unit statuses
  units.forEach(unit => {
    // Process poison status
    if (hasStatus(unit, UnitStatus.Poison)) {
      G.serverMsgLog.push({
        id: generateRandomId(),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: i18n.t('log.poisoned', {unitName: logUnitName(unit.name), status: logUnitStatus('poison').name}),
      });

      resolveUnitsInteraction({G, ctx, events}, {
        currentUnit: unit,
        enemy: unit,
        updates: {
          damage: 1,
          damageType: DamageType.Poison,
          status: [{name: UnitStatus.Poison, qty: -1}]
        }
      });

      if (unit.heals <= 0) {
        handleUnitDeath({G, ctx, events}, unit);
      }
    }

    // Process other statuses
    const statusesToProcess = [
      { status: UnitStatus.Unarmed, updates: { status: [{name: UnitStatus.Unarmed, qty: -1}] } },
      { status: UnitStatus.Unfocused, updates: { status: [{name: UnitStatus.Unfocused, qty: -1}] } }
    ];

    statusesToProcess.forEach(({status, updates}) => {
      if (hasStatus(unit, status)) {
        resolveUnitsInteraction({G, ctx, events}, {
          currentUnit: unit,
          enemy: unit,
          updates
        });
      }
    });

    // Process stun status
    if (hasStatus(unit, UnitStatus.Stun)) {
      G.serverMsgLog.push({
        id: generateRandomId(),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: i18n.t('log.confused', {unitName: logUnitName(unit.name)}),
      });

      unit.unitState.isClickable = false;
      resolveUnitsInteraction({G, ctx, events}, {
        currentUnit: unit,
        enemy: unit,
        updates: {
          status: [{name: UnitStatus.Stun, qty: -1}]
        }
      });
    }

    // Reset unit state for new phase
    unit.unitState.isMovedLastPhase = false;
    unit.unitState.initiatorFor = [];
  });

  // Check again if enough players are in battle
  G.players.filter(p => p.isPlayerInGame).forEach(p => {
    if (p.units.every(unit => unit.unitState.isInGame === false)) {
      p.isPlayerInBattle = false;
    }
  });

  if (G.players.filter(p => p.isPlayerInBattle).length <= 1) {
    events.endPhase();
  }

  return G;
}

export const handleGameOver = (G, ctx) =>
  G.players.filter(p => p.isPlayerInGame).length <= 1 || G.players.filter(p => p.heals > 0).length <= 1

export const onGameOver = (G, ctx) => {
  const remainPlayers = G.players.filter(p => p.isPlayerInGame && p.heals > 0)
  G.winner = remainPlayers.length === 0 ? -1 : remainPlayers[0]
  return G
}

/**
 * Clean up the fight phase state
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @param {Object} events - Game events
 * @returns {Object} Updated game state
 */
export const cleanFightPhase = (G, ctx, events) => {
  // Reset unit states and process support status
  getInGameUnits(G).forEach(unit => {
    // Reset unit state flags
    Object.assign(unit.unitState, {
      isClickable: true,
      isInFight: false,
      skippedTurn: false,
      isCounterAttacked: false,
      isAttackedThisPhase: false
    });

    // Process PowerUpSupport status if present
    const supportStatus = getStatus(unit, UnitStatus.PowerUpSupport);
    if (supportStatus) {
      resolveUnitsInteraction({G, ctx, events}, {
        currentUnit: unit,
        enemy: unit,
        updates: {
          power: supportStatus.qty,
          status: [{name: UnitStatus.PowerUpSupport, qty: -99}]
        }
      });
    }
  });

  // Update player battle status
  G.players.filter(p => p.isPlayerInGame).forEach(p => {
    if (p.units.every(unit => unit.unitState.isInGame === false)) {
      p.isPlayerInBattle = false;
    }
  });

  // Update game state counters
  G.moveOrder++;
  G.shrinkZone++;
  G.fightQueue = [];

  return G;
}

export const onEndPositioningTurn = (G, ctx) => {
  G.currentActionUnitId = undefined
  G.currentEnemySelectedId = undefined
  G.currentUnit = null
  return G
}

export const endPositioningPhase = (G) =>
  (getInGameUnits(G, (unit) => unit.unitState.isClickable).length === 0)

export const nextPhaseCondition = (G) =>
  (G.players.filter(p => p.isPlayerInBattle).length <= 1) ? 'FinishBattle' : 'Fight'

export const endFightPhase = (G, ctx) =>
  G.endFightPhase

/**
 * Set units that are in fight based on proximity to enemies
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @param {Object} events - Game events
 * @returns {Object} Updated game state
 */
export const setInFightUnits = (G, ctx, events) => {
  const activePlayers = G.players.filter(p => p.isPlayerInGame).length;
  const playersInBattle = G.players.filter(p => p.isPlayerInBattle).length;

  // Handle case when setup is complete and only one player is in battle
  if ((G.setupComplete === activePlayers) && (playersInBattle <= 1)) {
    // Increment wins for the remaining player
    const remainPlayer = G.players.find(p => p.isPlayerInBattle);
    if (remainPlayer) {
      remainPlayer.wins++;
    }

    // Set units to place quantity for players not in battle
    G.players.filter(p => !p.isPlayerInBattle).forEach(p => {
      p.unitsToPlaceQty = G.finishedRounds + 3;
    });

    return G;
  }

  // Determine which units are in fight based on proximity to enemies
  getInGameUnits(G).forEach(unit => {
    unit.unitState.isInFight = getNearestEnemies(G, unit.unitState).length > 0;
  });

  // Set clickable state based on whether units are in fight
  const unitsInFight = getInGameUnits(G, unit => unit.unitState.isInFight).length > 0;
  if (unitsInFight) {
    getInGameUnits(G).forEach(unit => {
      unit.unitState.isClickable = unit.unitState.isInFight;
    });
  }

  return G;
}

/**
 * Set the order of units for the fight phase
 * @param {Object} G - Game state
 * @param {Object} events - Game events
 * @param {Object} ctx - Game context
 */
export const setFightOrder = (G, events, ctx) => {
  // Process support units
  getInGameUnits(G)
    .filter(unit => hasKeyword(unit, UnitKeywords.Support))
    .forEach(unit => {
      // Find available allies that are in fight and not Idols
      const availableAllies = getNearestAllies(G, unit.unitState)
        .filter(ally => ally.type !== UnitTypes.Idol && ally.unitState.isInFight);

      if (availableAllies.length > 0) {
        // Select a random ally to support
        const randomAlly = shuffleArray(availableAllies).pop();

        // Apply support bonus
        resolveUnitsInteraction({G, ctx, events}, {
          currentUnit: unit,
          enemy: randomAlly,
          updates: {
            power: -1,
            status: [{name: UnitStatus.PowerUpSupport, qty: 1}]
          }
        });
      } else {
        // Log that no targets are available
        G.serverMsgLog.push({
          id: generateRandomId(),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: i18n.t('log.no_selection_targets', {unitName: logUnitName(unit.name)}),
        });
      }
    });

  // Disable clickable state for stunned units
  getInGameUnits(G, unit => hasStatus(unit, UnitStatus.Stun))
    .forEach(unit => { unit.unitState.isClickable = false; });

  // Create fight queue sorted by initiative
  G.fightQueue = getInGameUnits(G, unit => unit.unitState.isInFight && !hasStatus(unit, UnitStatus.Stun))
    .sort((u1, u2) => sortFightOrder(u1, u2))
    .reverse()
    .map(unit => ({
      unitId: unit.id,
      playerId: unit.unitState.playerId
    }));

  // Set end fight phase flag if queue is empty
  G.endFightPhase = G.fightQueue.length === 0;
}

/**
 * Calculate and apply sortie rewards for players
 * @param {Object} G - Game state
 * @param {Object} events - Game events
 * @param {Object} ctx - Game context
 */
export const handleSortieRewards = (G, events, ctx) => {
  // Process each player in the game
  G.players.filter(p => p.isPlayerInGame).forEach(p => {
    // Calculate essence rewards based on sortie results
    let essence = 0;
    const result = calculateSortie(G, p);

    // Map of sortie types to essence values
    const sortieRewards = {
      [SortieTypes.A]: 12,
      [SortieTypes.B]: 7,
      [SortieTypes.E]: -5
    };

    // Calculate essence from sortie results
    result.forEach(res => {
      if (sortieRewards[res.type] !== undefined) {
        essence += sortieRewards[res.type];
      }
    });

    // Add bonus essence for NebesnaBrama building
    const hasNebesnaBrama = p.houses.some(h => h.name === Buildings.NebesnaBrama.name);
    if (hasNebesnaBrama) {
      const unitsInSortie = p.units.filter(u => u.unitState.isInSortie).length;
      essence += 3 * unitsInSortie;
    }

    // Apply essence rewards if non-zero
    if (essence !== 0) {
      p.essence += essence;

      // Log the sortie impact
      G.serverMsgLog.push({
        id: generateRandomId(),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: i18n.t('log.sortie_impact', {player: p.name, qty: essence})
      });
    }
  });
}

/**
 * Main post-processing function that runs after game state changes
 * @param {Object} params - Parameters object
 * @param {Object} params.G - Game state
 * @param {Object} params.ctx - Game context
 * @param {Object} params.events - Game events
 * @param {string} params.playerID - Player ID
 * @returns {Object} Updated game state
 */
export const postProcess = ({ G, ctx, events, playerID }) => {
  // Update color map for the current player
  setColorMap(G, ctx, playerID);

  // Handle move actions for specific game phases
  const isActionPhase = ctx.phase === 'Positioning' || ctx.phase === 'Fight';
  if (isActionPhase) {
    handleOnMoveActions({ G, ctx, events, playerID });
  }

  return G;
};
