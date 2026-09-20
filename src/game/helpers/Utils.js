import {PLAYER_NUMBER} from "../../config";
import {
  Buildings,
  createPoint,
  essencePoints,
  SortieTypes,
  UnitKeywords,
  UnitStatus,
  UnitTypes
} from "./Constants";
import {
  handleUnitStatsUpdateInAttack,
  handleUnitStatsUpdateInDefence
} from "../state/GameActions";
import {handleAbility} from "../state/UnitSkills";
import {biomComparison} from "./UnitPriority";
import {createUnitObject} from "../units/Unit";
import i18n from '../../i18n';

// Helper function to generate random IDs consistently
export const generateRandomId = () => Math.random().toString(10).slice(2);

// Memoized point comparison functions for better performance
export const isSame = p1 => p2 => p1.coord === p2.coord;

export const isNotSame = p1 => p2 => p1.coord !== p2.coord;

// Constant arrays for neighbor offsets to avoid recreating them on each call
const NEIGHBOR_OFFSETS = [
  [0, -1, 1],
  [1, -1, 0],
  [1, 0, -1],
  [0, 1, -1],
  [-1, 1, 0],
  [-1, 0, 1],
];

const NEIGHBOR2_OFFSETS = [
  // First ring (same as NEIGHBOR_OFFSETS)
  [0, -1, 1],
  [1, -1, 0],
  [1, 0, -1],
  [0, 1, -1],
  [-1, 1, 0],
  [-1, 0, 1],
  // Second ring
  [0, 2, -2],
  [-1, 2, -1],
  [-2, 2, 0],
  [-2, 1, 1],
  [-2, 0, 2],
  [-1, -1, 2],
  [0, -2, 2],
  [1, -2, 1],
  [2, -2, 0],
  [2, -1, -1],
  [2, 0, -2],
  [1, 1, -2]
];

const RAID_POINT_TEMPLATES = [
  {main: [0, 2, -2], obstacles: [[0, 1, -1]]},
  {main: [-1, 2, -1], obstacles: [[-1, 1, 0], [0, 1, -1]]},
  {main: [-2, 2, 0], obstacles: [[-1, 1, 0]]},
  {main: [-2, 1, 1], obstacles: [[-1, 1, 0], [-1, 0, 1]]},
  {main: [-2, 0, 2], obstacles: [[-1, 0, 1]]},
  {main: [-1, -1, 2], obstacles: [[-1, 0, 1], [0, -1, 1]]},
  {main: [0, -2, 2], obstacles: [[0, -1, 1]]},
  {main: [1, -2, 1], obstacles: [[0, -1, 1], [1, -1, 0]]},
  {main: [2, -2, 0], obstacles: [[1, -1, 0]]},
  {main: [2, -1, -1], obstacles: [[1, 0, -1], [1, -1, 0]]},
  {main: [2, 0, -2], obstacles: [[1, 0, -1]]},
  {main: [1, 1, -2], obstacles: [[0, 1, -1], [1, 0, -1]]}
];

/**
 * Get immediate neighboring points
 * @param {Object} point - The center point with x, y, z coordinates
 * @returns {Array} Array of neighboring points
 */
export const getNeighbors = (point) => {
  const { x, y, z } = point;
  return NEIGHBOR_OFFSETS.map(([dx, dy, dz]) =>
    createPoint(x + dx, y + dy, z + dz)
  );
}

/**
 * Get extended neighboring points (includes second ring)
 * @param {Object} point - The center point with x, y, z coordinates
 * @returns {Array} Array of neighboring points including second ring
 */
export const getNeighbors2 = (point) => {
  const { x, y, z } = point;
  return NEIGHBOR2_OFFSETS.map(([dx, dy, dz]) =>
    createPoint(x + dx, y + dy, z + dz)
  );
}

/**
 * Get raid points with their obstacles
 * @param {Object} point - The center point with x, y, z coordinates
 * @returns {Array} Array of raid points with their obstacles
 */
export const getRaidPoints = (point) => {
  const { x, y, z } = point;

  return RAID_POINT_TEMPLATES.map(template => {
    const [dx, dy, dz] = template.main;

    return {
      main: createPoint(x + dx, y + dy, z + dz),
      obstacles: template.obstacles.map(([odx, ody, odz]) =>
        createPoint(x + odx, y + ody, z + odz)
      )
    };
  });
}

/**
 * Get all units that are in game and match the filter
 * @param {Object} G - Game state
 * @param {Function} filter - Optional filter function
 * @returns {Array} Array of units
 */
export const getInGameUnits = (G, filter = () => true) => {
  // Use a single filter to avoid creating intermediate arrays
  return G.players.flatMap(p =>
    p.units.filter(unit => unit.unitState.isInGame === true && filter(unit))
  );
};

/**
 * Get a unit by its ID
 * @param {Object} G - Game state
 * @param {string} id - Unit ID
 * @returns {Object|undefined} The unit or undefined if not found
 */
export const getUnitById = (G, id) => {
  // Optimize by checking each player's units without creating a flattened array first
  for (const player of G.players) {
    const unit = player.units.find(unit => unit.id === id);
    if (unit) return unit;
  }
  return undefined;
};

/**
 * Skip turn if the current player has no active units
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @param {Object} events - Game events
 * @returns {Object} Updated game state
 */
export const skipTurnIfNotActive = (G, ctx, events) => {
  const currentPlayerId = +ctx.currentPlayer;
  const hasActiveUnits = G.players.some(player =>
    player.id === currentPlayerId &&
    player.units.some(unit =>
      unit.unitState.isInGame === true &&
      unit.unitState.isClickable === true
    )
  );

  if (!hasActiveUnits) {
    events.endTurn();
  }

  return G;
};

/**
 * Get units near a specific unit
 * @param {Object} G - Game state
 * @param {Object} unitState - Unit state
 * @returns {Array} Array of nearby units
 */
export const getNearestUnits = (G, unitState) => {
  const surroundings = getNeighbors(unitState.point);
  const surroundingCoords = new Set(surroundings.map(point => point.coord));

  return getInGameUnits(G, unit =>
    surroundingCoords.has(unit.unitState.point.coord)
  );
};

/**
 * Get enemy units near a specific unit
 * @param {Object} G - Game state
 * @param {Object} unitState - Unit state
 * @returns {Array} Array of nearby enemy units
 */
export const getNearestEnemies = (G, unitState) => {
  const surroundings = getNeighbors(unitState.point);
  const surroundingCoords = new Set(surroundings.map(point => point.coord));

  return getInGameUnits(G, unit =>
    unit.unitState.playerId !== unitState.playerId &&
    surroundingCoords.has(unit.unitState.point.coord)
  );
};

/**
 * Get allied units near a specific unit
 * @param {Object} G - Game state
 * @param {Object} unitState - Unit state
 * @returns {Array} Array of nearby allied units
 */
export const getNearestAllies = (G, unitState) => {
  const surroundings = getNeighbors(unitState.point);
  const surroundingCoords = new Set(surroundings.map(point => point.coord));

  return getInGameUnits(G, unit =>
    unit.unitState.playerId === unitState.playerId &&
    surroundingCoords.has(unit.unitState.point.coord)
  );
};

/**
 * Get enemy units that can be raided
 * @param {Object} G - Game state
 * @param {Object} unitState - Unit state
 * @returns {Array} Array of raidable enemy units
 */
export const getRaidEnemies = (G, unitState) => {
  const surroundings = getRaidPoints(unitState.point);
  const allies = getInGameUnits(G, unit => unit.unitState.playerId === unitState.playerId);
  const allyCoords = new Set(allies.map(ally => ally.unitState.point.coord));

  return getInGameUnits(G, unit => {
    if (unit.unitState.playerId === unitState.playerId) return false;

    // Check if unit is in a raid position and not blocked by allies
    return surroundings.some(dataPoint => {
      if (!isSame(dataPoint.main)(unit.unitState.point)) return false;

      // Check if path is not blocked by allies
      return !dataPoint.obstacles.every(obs => allyCoords.has(obs.coord));
    });
  });
};

/**
 * Get enemy units in extended range
 * @param {Object} G - Game state
 * @param {Object} unitState - Unit state
 * @returns {Array} Array of enemy units in extended range
 */
export const getNearestEnemies2 = (G, unitState) => {
  const surroundings = getNeighbors2(unitState.point);
  const surroundingCoords = new Set(surroundings.map(point => point.coord));

  return getInGameUnits(G, unit =>
    unit.unitState.playerId !== unitState.playerId &&
    surroundingCoords.has(unit.unitState.point.coord)
  );
};

/**
 * Get the current number of players
 * @returns {number} Number of players
 */
export const getPlayersNumber = () => {
  const activeConfig = PLAYER_NUMBER.find(qty => qty.isActive);
  return activeConfig ? activeConfig.num : null;
};

/**
 * Set the number of players
 * @param {number} num - Number of players to set
 */
export const setPlayerNumber = (num) => {
  // Find the current active config and the target config in one pass
  let currentActive = null;
  let target = null;

  for (const config of PLAYER_NUMBER) {
    if (config.isActive) currentActive = config;
    if (config.num === num) target = config;

    // If we found both, we can break early
    if (currentActive && target) break;
  }

  // Update the active status
  if (currentActive) currentActive.isActive = false;
  if (target) target.isActive = true;
};

/**
 * Shuffle an array using the Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} A new shuffled array
 */
export const shuffleArray = (array) => {
  // Create a copy to avoid modifying the original array
  const result = [...array];
  let currentIndex = result.length;

  // While there remain elements to shuffle
  while (currentIndex > 0) {
    // Pick a remaining element
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap with the current element
    [result[currentIndex], result[randomIndex]] = [
      result[randomIndex], result[currentIndex]
    ];
  }

  return result;
};

/**
 * Determine the next player in the fight turn
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @returns {Object|boolean} Next player info or false if not end of turn
 */
export const endFightTurnCondition = (G, ctx) => {
  if (!G.endFightTurn) return false;

  // If fight queue is empty, stay with current player
  if (G.fightQueue.length === 0) {
    return { next: ctx.currentPlayer };
  }

  // Otherwise, move to the next player in the queue
  return { next: G.fightQueue[0].playerId.toString() };
};

/**
 * Handle state updates after a fight turn ends
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @returns {Object} Updated game state
 */
export const onEndFightTurnAfter = (G, ctx) => {
  G.endFightTurn = false;
  G.endFightPhase = G.fightQueue.length === 0;
  return G;
};

/**
 * Process the end of a fight turn
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @returns {Object} Updated game state
 */
export const onEndFightTurn = (G, ctx) => {
  // Create a map of unit IDs to nearby enemy presence for efficient lookup
  const unitsWithNearbyEnemies = new Set();
  const units = getInGameUnits(G);

  // First pass: identify units with nearby enemies
  units.forEach(unit => {
    if (getNearestEnemies(G, unit.unitState).length > 0) {
      unitsWithNearbyEnemies.add(unit.id);
    }
  });

  // Second pass: update unit states based on nearby enemies
  units.forEach(unit => {
    const hasNearbyEnemies = unitsWithNearbyEnemies.has(unit.id);

    // Update fight status based on nearby enemies
    if (!unit.unitState.isInFight && hasNearbyEnemies && !unit.unitState.isAttackedThisPhase) {
      unit.unitState.isClickable = true;
      unit.unitState.isInFight = true;
    } else if (unit.unitState.isInFight && !hasNearbyEnemies) {
      unit.unitState.isClickable = false;
      unit.unitState.isInFight = false;
    }

    // Stunned units can't be clicked
    if (hasStatus(unit, UnitStatus.Stun)) {
      unit.unitState.isClickable = false;
    }
  });

  // Get units that can fight and sort them by priority
  const fightableUnits = units.filter(unit =>
    unit.unitState.isInFight &&
    unit.unitState.isClickable &&
    !hasStatus(unit, UnitStatus.Stun)
  );

  // Sort units by whether they've skipped their turn and by fight order
  const sortedUnits = [...fightableUnits].sort((a, b) => {
    // First prioritize units that haven't skipped their turn
    if (a.unitState.skippedTurn !== b.unitState.skippedTurn) {
      return a.unitState.skippedTurn ? 1 : -1;
    }
    // Then sort by fight order
    return -sortFightOrder(a, b); // Negative to reverse the order
  });

  // Create the fight queue
  G.fightQueue = sortedUnits.map(unit => ({
    unitId: unit.id,
    playerId: unit.unitState.playerId
  }));

  // Reset current selections and mark the turn as ended
  G.currentActionUnitId = undefined;
  G.currentEnemySelectedId = undefined;
  G.endFightTurn = true;

  return G;
}

/**
 * Reset the game state for a new round
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @param {Object} events - Game events
 * @returns {Object} Updated game state
 */
export const cleanRound = (G, ctx, events) => {
  // Increment round counter
  G.finishedRounds++;

  // Reset global game state
  const gameStateResets = {
    availablePoints: [],
    currentUnit: null,
    setupComplete: 0,
    buildingComplete: 0,
    battleResultComplete: 0,
    moveOrder: G.finishedRounds,
    shrinkZone: 0,
    fightQueue: [],
    endFightTurn: false,
    endFightPhase: false,
    endBattle: false,
    winner: undefined,
    currentActionUnitId: undefined,
    currentEnemySelectedId: undefined
  };

  // Apply all resets to game state
  Object.assign(G, gameStateResets);

  // Reset grid
  G.grid.levels = ctx.numPlayers === 2 ? 3 : 4;
  G.grid.unstablePoints = [];
  G.grid.essencePoints = essencePoints(ctx.numPlayers);

  // Reset player states
  G.players.forEach(player => {
    if (!player.isPlayerInGame) return;

    // Reset player state
    player.isPlayerInBattle = false;
    player.availablePoints = [];
    player.currentUnit = null;
    player.dealtDamage = false;

    // Handle sortie units
    const sortieUnits = player.units.filter(unit => unit.unitState.isInSortie);
    let savedUnits = [];

    if (sortieUnits.length > 0) {
      // Randomly select one unit to save
      const randomIndex = Math.floor(Math.random() * sortieUnits.length);
      const savedUnit = sortieUnits[randomIndex];

      // Create a new unit object based on the saved unit
      savedUnits.push(
        createUnitObject(
          generateRandomId(),
          player.id,
          savedUnit.biom,
          savedUnit.type,
          savedUnit.unitState.createPosition,
          savedUnit.level,
          savedUnit.price
        )
      );
    }

    // Update player units and clear sortie
    player.units = savedUnits;
    player.sortie = [];
  });

  return G;
}

/**
 * Compare two units to determine fight order
 * @param {Object} u1 - First unit
 * @param {Object} u2 - Second unit
 * @returns {number} Comparison result (-1, 0, or 1)
 */
export const sortFightOrder = (u1, u2) => {
  // Compare initiative first
  if (u1.initiative !== u2.initiative) {
    return u1.initiative > u2.initiative ? 1 : -1;
  }

  // Check if one unit initiated combat with the other
  const u1InitiatedAgainstU2 = u1.unitState.initiatorFor.includes(u2.id);
  const u2InitiatedAgainstU1 = u2.unitState.initiatorFor.includes(u1.id);

  if (u1InitiatedAgainstU2) return -1;
  if (u2InitiatedAgainstU1) return 1;

  // Fall back to biome comparison
  return biomComparison(u1.biom, u2.biom);
};

/**
 * Helper function to create a log message
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @param {string} messageKey - Translation key for the message
 * @param {Object} messageParams - Parameters for the message
 */
const createLogMessage = (G, ctx, messageKey, messageParams) => {
  G.serverMsgLog.push({
    id: generateRandomId(),
    turn: ctx.turn,
    player: +ctx.currentPlayer,
    phase: ctx.phase,
    text: i18n.t(messageKey, messageParams)
  });
};

/**
 * Resolve interactions between units during combat
 * @param {Object} data - Game data containing G and ctx
 * @param {Object} fightData - Data about the fight
 */
export const resolveUnitsInteraction = (data, fightData) => {
  const { currentUnit, enemy, updates } = fightData;
  const { G, ctx } = data;

  // Process attack modifications
  const onAttackMods = handleUnitStatsUpdateInAttack(data, {
    unitId: currentUnit.id,
    enemyId: enemy.id,
    updates: updates
  });

  // Process defense modifications
  const resultMods = handleUnitStatsUpdateInDefence(data, {
    unitId: enemy.id,
    enemyId: currentUnit.id,
    updates: onAttackMods
  });

  // Handle status changes
  if (resultMods.status) {
    resultMods.status.forEach(status => {
      const enemyStatus = getStatus(enemy, status.name);

      if (enemyStatus) {
        // Update existing status
        const newQty = enemyStatus.qty + status.qty;

        if (newQty > 0) {
          enemyStatus.qty = newQty;
          createLogMessage(G, ctx, 'log.get_status', {
            unitName: logUnitName(enemy.name),
            status: logUnitStatus(status.name).name
          });
        } else {
          // Remove status if quantity is zero or negative
          removeStatus(enemy, status.name);
          createLogMessage(G, ctx, 'log.lose_status', {
            unitName: logUnitName(enemy.name),
            status: logUnitStatus(status.name).name
          });
        }
      } else if (status.qty > 0) {
        // Add new status
        enemy.status.push(status);
        createLogMessage(G, ctx, 'log.get_status', {
          unitName: logUnitName(enemy.name),
          status: logUnitStatus(status.name).name
        });
      }
    });
  }

  // Handle damage changes
  if (resultMods.damage !== undefined) {
    enemy.heals = enemy.heals - resultMods.damage;
    createLogMessage(G, ctx, 'log.health_change', {
      unitName: logUnitName(enemy.name),
      qty: Math.abs(resultMods.damage),
      qtyLabel: resultMods.damage >= 0 ? i18n.t('game.to_damage') : i18n.t('game.to_heals'),
      source: logUnitName(currentUnit.name)
    });
  }

  // Handle power changes
  if (resultMods.power !== undefined) {
    enemy.power = enemy.power - resultMods.power;
    createLogMessage(G, ctx, 'log.power_change', {
      unitName: logUnitName(enemy.name),
      qty: Math.abs(resultMods.power),
      qtyLabel: resultMods.power < 0 ? i18n.t('game.increased') : i18n.t('game.decreased')
    });
  }

  // Handle initiative changes
  if (resultMods.initiative !== undefined) {
    enemy.initiative = enemy.initiative - resultMods.initiative;
    createLogMessage(G, ctx, 'log.initiative_change', {
      unitName: logUnitName(enemy.name),
      qty: Math.abs(resultMods.initiative),
      qtyLabel: resultMods.initiative < 0 ? i18n.t('game.increased') : i18n.t('game.decreased')
    });
  }
}

/**
 * Check if a unit has a specific status
 * @param {Object} unit - The unit to check
 * @param {string} keyword - The status keyword to check for
 * @returns {boolean} True if the unit has the status
 */
export const hasStatus = (unit, keyword) => {
  if (!unit || !unit.status || !Array.isArray(unit.status)) return false;
  return unit.status.some(status => status.name === keyword);
};

/**
 * Get a specific status from a unit
 * @param {Object} unit - The unit to check
 * @param {string} keyword - The status keyword to get
 * @returns {Object|undefined} The status object or undefined if not found
 */
export const getStatus = (unit, keyword) => {
  if (!unit || !unit.status || !Array.isArray(unit.status)) return undefined;
  return unit.status.find(status => status.name === keyword);
};

/**
 * Remove a specific status from a unit
 * @param {Object} unit - The unit to modify
 * @param {string} keyword - The status keyword to remove
 */
export const removeStatus = (unit, keyword) => {
  if (!unit || !unit.status || !Array.isArray(unit.status)) return;
  unit.status = unit.status.filter(status => status.name !== keyword);
};

/**
 * Check if a unit has a specific keyword ability
 * @param {Object} unit - The unit to check
 * @param {string} keyword - The keyword to check for
 * @returns {boolean} True if the unit has the keyword
 */
export const hasKeyword = (unit, keyword) => {
  if (!unit || !unit.abilities || !unit.abilities.keywords || !Array.isArray(unit.abilities.keywords)) return false;
  return unit.abilities.keywords.includes(keyword);
};

/**
 * Handle the death of a unit
 * @param {Object} data - Game data containing G and ctx
 * @param {Object} target - The unit that died
 * @param {Object|null} killer - The unit that killed the target, if any
 * @param {boolean} isFallDown - Whether the unit fell down (special death case)
 */
export const handleUnitDeath = (data, target, killer = null, isFallDown = false) => {
  const { G, ctx } = data;

  if (!target) return;

  // Log the unit's death
  createLogMessage(G, ctx, 'log.unit_killed', {
    unitName: logUnitName(target.name),
    player: G.players[target.unitState.playerId].name || 'Unknown'
  });

  // Trigger onDeath abilities from other units
  const unitsWithOnDeath = getInGameUnits(G, unit =>
    unit.abilities.onDeath && unit.abilities.onDeath.length > 0
  );

  unitsWithOnDeath.forEach(unit => {
    unit.abilities.onDeath.forEach(skill => {
      handleAbility(data, skill.name, {
        killerId: killer?.id || null,
        target: target,
        thisUnit: unit
      });
    });
  });

  // Update target unit state
  target.unitState.isInGame = false;

  // Temporarily set point to a far-away location to trigger onMove abilities
  target.unitState.point = createPoint(100, 100, 100);

  // Trigger onMove abilities
  if (target.abilities?.onMove) {
    target.abilities.onMove.forEach(skill => {
      handleAbility(data, skill.name, { unitId: target.id });
    });
  }

  // Clear the point and reset health
  target.unitState.point = null;
  target.heals = 0;

  // Handle killer rewards
  if (killer) {
    // Calculate essence reward
    let essence = target.level ? 3 + ((target.level - 1) * 2) : 3;

    // Bonus for killing an Idol
    if (target.type === UnitTypes.Idol) {
      essence += 2;
    }

    // Bonus for units with AdditionalEssence keyword
    if (hasKeyword(killer, UnitKeywords.AdditionalEssence)) {
      essence += 2;
    }

    // Award essence to the killer's player
    const killingPlayer = G.players[killer.unitState.playerId];
    if (killingPlayer) {
      killingPlayer.essence += essence;
      killingPlayer.killedUnits++;

      // Log the essence gain
      createLogMessage(G, ctx, 'log.receive_essence', {
        qty: essence,
        player: killingPlayer.name
      });
    }
  }

  // Handle fall down penalty
  if (isFallDown) {
    const player = G.players[target.unitState.playerId];
    if (player && player.essence > 1) {
      player.essence -= 2;

      // Log the essence loss
      createLogMessage(G, ctx, 'log.loose_essence', {
        qty: 2,
        player: player.name
      });
    }
  }
};

/**
 * Check if a unit is on a point that is marked as available
 * @param {Object} props - Component props containing game state
 * @param {Object} unit - The unit to check
 * @returns {boolean} True if the unit is on an available point
 */
export const setEnemyMarks = (props, unit) => {
  if (!props?.G?.availablePoints || !Array.isArray(props.G.availablePoints) || props.G.availablePoints.length === 0) {
    return false;
  }

  if (!unit?.unitState?.point) {
    return false;
  }

  // Use a Set for more efficient lookup if there are many available points
  if (props.G.availablePoints.length > 10) {
    const availableCoords = new Set(props.G.availablePoints.map(point => point.coord));
    return availableCoords.has(unit.unitState.point.coord);
  }

  // For smaller arrays, direct find is fine
  return props.G.availablePoints.some(point => isSame(point)(unit.unitState.point));
};

/**
 * Handle a unit moving to a new position
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @param {string} unitId - ID of the unit that moved
 * @param {Object} point - The new point the unit moved to
 */
export const handleUnitMove = (G, ctx, unitId, point) => {
  const thisUnit = getUnitById(G, unitId);
  if (!thisUnit) return;

  // Get enemies before the move
  const oldEnemies = getNearestEnemies(G, thisUnit.unitState);
  const oldEnemyIds = new Set(oldEnemies.map(enemy => enemy.id));

  // Update unit position
  thisUnit.unitState.point = point;

  // Get enemies after the move
  const newEnemies = getNearestEnemies(G, thisUnit.unitState);

  // Find enemies that weren't nearby before (unit is initiator for these)
  const initiatorFor = newEnemies
    .filter(enemy => !oldEnemyIds.has(enemy.id))
    .map(enemy => enemy.id);

  // Update unit state
  if (ctx.phase === 'Positioning') {
    thisUnit.unitState.isMovedLastPhase = true;
  }
  thisUnit.unitState.initiatorFor = initiatorFor;

  // Check if unit landed on an essence point
  const landedOnEssencePoint = G.grid.essencePoints.some(point => isSame(point)(thisUnit.unitState.point));

  if (landedOnEssencePoint) {
    handleEssenceCollection(G, ctx, thisUnit);
  }
};

/**
 * Handle essence collection when a unit lands on an essence point
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @param {Object} unit - The unit that collected essence
 */
const handleEssenceCollection = (G, ctx, unit) => {
  const thisPlayer = G.players[unit.unitState.playerId];
  if (!thisPlayer) return;

  // Get players in game
  const inGamePlayers = G.players.filter(p => p.isPlayerInGame);

  // Calculate player rankings
  const playersEssenceOrder = [...inGamePlayers]
    .sort((p1, p2) => sortPlayersEssenceOrder(p1, p2))
    .reverse();

  const playersPowerOrder = [...inGamePlayers]
    .sort((p1, p2) => sortPlayersPowerOrder(p1, p2))
    .reverse();

  // Calculate player's position in rankings
  const essenceIndex = playersEssenceOrder.findIndex(p => p.id === thisPlayer.id) + 1;
  const powerIndex = playersPowerOrder.findIndex(p => p.id === thisPlayer.id) + 1;
  const playerValue = essenceIndex + powerIndex;

  // Determine essence amount based on game state
  let essence = 1;

  if (G.finishedRounds === 0) {
    // First round - random amount
    essence = [1, 2, 3][Math.floor(Math.random() * 3)];
  } else if (inGamePlayers.length === 4) {
    // 4 players - based on player ranking
    if (playerValue >= 7) essence = 5;
    else if (playerValue >= 6) essence = 4;
    else if (playerValue >= 4) essence = 3;
    else if (playerValue >= 3) essence = 2;
  } else if (inGamePlayers.length === 3) {
    // 3 players - based on player ranking
    essence = Math.max(1, playerValue - 1);
  } else if (inGamePlayers.length === 2) {
    // 2 players - random higher amount
    essence = [3, 4, 5][Math.floor(Math.random() * 3)];
  }

  // Award essence to player
  thisPlayer.essence += essence;

  // Log the essence gain
  createLogMessage(G, ctx, 'log.receive_gift', {
    qty: essence,
    player: thisPlayer.name
  });

  // Remove the essence point from the grid
  G.grid.essencePoints = G.grid.essencePoints.filter(point =>
    !isSame(point)(unit.unitState.point)
  );
};

/**
 * Calculate the total power level of a player's non-Idol units
 * @param {Object} player - The player
 * @returns {number} Total power level
 */
const calculatePlayerPowerLevel = (player) => {
  if (!player?.units) return 0;

  return player.units
    .filter(unit => unit.type !== UnitTypes.Idol)
    .reduce((total, unit) => total + (unit.level || 0), 0);
};

/**
 * Calculate the player's score for essence ordering
 * @param {Object} player - The player
 * @returns {number} Score for essence ordering
 */
const calculatePlayerEssenceScore = (player) => {
  if (!player) return 0;

  // Killed units + wins (weighted)
  return (player.killedUnits || 0) + ((player.wins || 0) * 3);
};

/**
 * Compare two players based on their power order
 * @param {Object} p1 - First player
 * @param {Object} p2 - Second player
 * @returns {number} Comparison result (-1, 0, or 1)
 */
export const sortPlayersPowerOrder = (p1, p2) => {
  if (!p1 || !p2) return 0;

  // Compare power levels
  const p1PowerLevel = calculatePlayerPowerLevel(p1);
  const p2PowerLevel = calculatePlayerPowerLevel(p2);

  if (p1PowerLevel !== p2PowerLevel) {
    return p1PowerLevel > p2PowerLevel ? 1 : -1;
  }

  // Compare number of houses
  const p1Houses = p1.houses?.length || 0;
  const p2Houses = p2.houses?.length || 0;

  if (p1Houses !== p2Houses) {
    return p1Houses > p2Houses ? 1 : -1;
  }

  // Compare essence
  const p1Essence = p1.essence || 0;
  const p2Essence = p2.essence || 0;

  if (p1Essence !== p2Essence) {
    return p1Essence > p2Essence ? 1 : -1;
  }

  // If all else is equal, use a consistent but random ordering
  // Use player IDs to make it deterministic if available
  if (p1.id && p2.id) {
    return p1.id.localeCompare(p2.id);
  }

  // Fall back to random if no IDs (should be rare)
  return Math.random() - 0.5;
};

/**
 * Compare two players based on their essence order
 * @param {Object} p1 - First player
 * @param {Object} p2 - Second player
 * @returns {number} Comparison result (-1, 0, or 1)
 */
export const sortPlayersEssenceOrder = (p1, p2) => {
  if (!p1 || !p2) return 0;

  // Compare essence scores (kills + wins)
  const p1Score = calculatePlayerEssenceScore(p1);
  const p2Score = calculatePlayerEssenceScore(p2);

  if (p1Score !== p2Score) {
    return p1Score > p2Score ? 1 : -1;
  }

  // Compare heals
  const p1Heals = p1.heals || 0;
  const p2Heals = p2.heals || 0;

  if (p1Heals !== p2Heals) {
    return p1Heals > p2Heals ? 1 : -1;
  }

  // Compare essence
  const p1Essence = p1.essence || 0;
  const p2Essence = p2.essence || 0;

  if (p1Essence !== p2Essence) {
    return p1Essence > p2Essence ? 1 : -1;
  }

  // If all else is equal, use a consistent but random ordering
  // Use player IDs to make it deterministic if available
  if (p1.id && p2.id) {
    return p1.id.localeCompare(p2.id);
  }

  // Fall back to random if no IDs (should be rare)
  return Math.random() - 0.5;
};

/**
 * Reset a player's state
 * @param {Object} player - The player to reset
 */
export const cleanPlayer = (player) => {
  if (!player) return;

  // Define default player state
  const defaultState = {
    isPlayerInBattle: false,
    isPlayerInGame: false,
    availablePoints: [],
    currentUnit: null,
    heals: 0,
    essence: 0,
    houses: [],
    sortie: [],
    units: []
  };

  // Apply default state to player
  Object.assign(player, defaultState);
};

/**
 * Building group definitions for price calculations
 */
const BUILDING_GROUPS = {
  // First tier
  [Buildings.VivtarPoplichnukiv.name]: {
    complementary: [Buildings.VivtarProminkoriv.name, Buildings.VivtarVisnukiv.name],
    multiplier: 1
  },
  [Buildings.VivtarProminkoriv.name]: {
    complementary: [Buildings.VivtarPoplichnukiv.name, Buildings.VivtarVisnukiv.name],
    multiplier: 1
  },
  [Buildings.VivtarVisnukiv.name]: {
    complementary: [Buildings.VivtarProminkoriv.name, Buildings.VivtarPoplichnukiv.name],
    multiplier: 1
  },

  // Second tier
  [Buildings.VivtarPoplichnukiv2.name]: {
    complementary: [Buildings.VivtarProminkoriv2.name, Buildings.VivtarVisnukiv2.name],
    multiplier: 1
  },
  [Buildings.VivtarProminkoriv2.name]: {
    complementary: [Buildings.VivtarPoplichnukiv2.name, Buildings.VivtarVisnukiv2.name],
    multiplier: 1
  },
  [Buildings.VivtarVisnukiv2.name]: {
    complementary: [Buildings.VivtarProminkoriv2.name, Buildings.VivtarPoplichnukiv2.name],
    multiplier: 1
  },

  // Third tier
  [Buildings.VivtarPoplichnukiv3.name]: {
    complementary: [Buildings.VivtarProminkoriv3.name, Buildings.VivtarVisnukiv3.name],
    multiplier: 2
  },
  [Buildings.VivtarProminkoriv3.name]: {
    complementary: [Buildings.VivtarPoplichnukiv3.name, Buildings.VivtarVisnukiv3.name],
    multiplier: 2
  },
  [Buildings.VivtarVisnukiv3.name]: {
    complementary: [Buildings.VivtarProminkoriv3.name, Buildings.VivtarPoplichnukiv3.name],
    multiplier: 2
  }
};

/**
 * Calculate the price of a house based on player's existing houses
 * @param {Object} house - The house to calculate price for
 * @param {Object} player - The player buying the house
 * @returns {number} The calculated price
 */
export const getHousePrice = (house, player) => {
  if (!house || !player) return 0;

  // If house is not in a building group, return base price
  const buildingGroup = BUILDING_GROUPS[house.name];
  if (!buildingGroup) return house.price;

  // Count complementary buildings the player has
  const complementaryCount = player.houses?.filter(
    h => buildingGroup.complementary.includes(h.name)
  ).length || 0;

  // Calculate discount based on complementary buildings
  const discount = complementaryCount * buildingGroup.multiplier;

  // Return price with discount (minimum 0)
  return Math.max(0, house.price - discount);
};

/**
 * Determine the sortie type between two players
 * @param {Object} player1 - The first player
 * @param {Object} player2 - The second player
 * @returns {Object|null} Sortie result or null if not applicable
 */
const determineSortieType = (player1, player2) => {
  if (!player1 || !player2) return null;

  // Get units sent by each player to the other
  const p1Units = player1.sortie?.filter(unit => unit.playerId === player2.id) || [];
  const p2Units = player2.sortie?.filter(unit => unit.playerId === player1.id) || [];

  // Calculate unit difference
  const unitDifference = p1Units.length - p2Units.length;

  // Check if player2 has the Pamjatnuk building
  const player2HasPamjatnuk = player2.houses?.some(h => h.name === Buildings.Pamjatnuk.name) || false;

  // Check if player1 has the Pamjatnuk building
  const player1HasPamjatnuk = player1.houses?.some(h => h.name === Buildings.Pamjatnuk.name) || false;

  // Determine sortie type based on unit difference and buildings
  if (unitDifference >= 2) {
    // Player1 sent significantly more units
    return {
      player: player2,
      type: player2HasPamjatnuk ? SortieTypes.Y : SortieTypes.A
    };
  } else if (unitDifference > 0) {
    // Player1 sent more units
    return {
      player: player2,
      type: player2HasPamjatnuk ? SortieTypes.Y : SortieTypes.B
    };
  } else if (unitDifference === 0) {
    // Equal number of units
    return {
      player: player2,
      type: SortieTypes.C
    };
  } else if (player1HasPamjatnuk) {
    // Player1 has Pamjatnuk building
    return {
      player: player2,
      type: SortieTypes.X
    };
  } else if (unitDifference <= -2) {
    // Player2 sent significantly more units
    return {
      player: player2,
      type: SortieTypes.E
    };
  } else if (unitDifference < 0) {
    // Player2 sent more units
    return {
      player: player2,
      type: SortieTypes.D
    };
  }

  return null;
};

/**
 * Calculate sortie results for a player against all other players
 * @param {Object} G - Game state
 * @param {Object} player - The player to calculate sorties for
 * @returns {Array} Array of sortie results
 */
export const calculateSortie = (G, player) => {
  if (!G || !player) return [];

  // Get all other active players
  const otherPlayers = G.players?.filter(p =>
    p.id !== player.id && p.isPlayerInGame
  ) || [];

  // Calculate sortie for each other player
  return otherPlayers
    .map(otherPlayer => determineSortieType(player, otherPlayer))
    .filter(result => result !== null); // Remove any null results
};

/**
 * Generate points for the outer edge of the grid
 * @param {number} level - The grid level
 * @returns {Array} Array of coordinate arrays
 */
const generateOuterEdgePoints = (level) => {
  const result = [];

  // Generate points for the positive edge
  for (let i = 0; i <= level; i++) {
    const a = -i;
    const b = -(level - i);

    // Add all permutations with the max level
    result.push([level, a, b]);
    result.push([level, b, a]);
    result.push([a, level, b]);
    result.push([b, level, a]);
    result.push([a, b, level]);
    result.push([b, a, level]);
  }

  // Generate points for the negative edge
  for (let i = -1; i > -level; i--) {
    const a = -i;
    const b = level + i;

    // Add all permutations with the min level
    result.push([-level, a, b]);
    result.push([-level, b, a]);
    result.push([a, -level, b]);
    result.push([b, -level, a]);
    result.push([a, b, -level]);
    result.push([b, a, -level]);
  }

  return result;
};

/**
 * Generate points for the inner edge of the grid
 * @param {number} level - The grid level
 * @returns {Array} Array of coordinate arrays
 */
const generateInnerEdgePoints = (level) => {
  const result = [];
  const innerLevel = level - 1;

  // Generate points for the positive inner edge
  for (let i = 0; i <= innerLevel; i++) {
    const a = -i;
    const b = -(innerLevel - i);

    // Add permutations for the inner level
    result.push([a, innerLevel, b]);
    result.push([b, innerLevel, a]);
    result.push([innerLevel, a, b]);
    result.push([innerLevel, b, a]);
  }

  // Generate points for the negative inner edge
  for (let i = -1; i >= -innerLevel; i--) {
    const a = -i;
    const b = innerLevel + i;

    // Add permutations for the inner negative level
    result.push([a, b, -innerLevel]);
    result.push([b, a, -innerLevel]);
  }

  return result;
};

/**
 * Get unstable points on the grid based on number of players
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @returns {Array} Array of unstable points
 */
export const getUnstablePoints = (G, ctx) => {
  if (!G || !ctx) return [];

  const level = G.grid.levels;
  let points = [];

  // Generate outer edge points for all player counts
  points = points.concat(generateOuterEdgePoints(level));

  // For 2 players, we only need the outer edge
  if (ctx.numPlayers === 2) {
    return [...new Set(points)].map(coords => createPoint(...coords));
  }

  // For 3 or more players, add inner edge points
  points = points.concat(generateInnerEdgePoints(level));

  // Remove duplicates
  const uniquePoints = [...new Set(points)];

  // Apply filters based on player count
  if (ctx.numPlayers === 3) {
    return uniquePoints
      .filter(coords => coords[0] !== level)
      .filter(coords => coords[1] !== level)
      .filter(coords => coords[2] !== -level)
      .map(coords => createPoint(...coords));
  } else {
    // 4+ players
    return uniquePoints
      .filter(coords => coords[1] !== level)
      .filter(coords => coords[2] !== -level)
      .map(coords => createPoint(...coords));
  }
};

/**
 * Get the translated name of a unit
 * @param {string} name - The unit name key
 * @returns {string} Translated unit name
 */
export const logUnitName = (name) => {
  if (!name) return '';
  return i18n.t(`unit.${name}`);
};

/**
 * Get the translated status information for a unit
 * @param {string} name - The status name
 * @returns {Object} Translated status information
 */
export const logUnitStatus = (name) => {
  if (!name) return { name: '', description: '' };

  // Convert first character to lowercase for proper key lookup
  const loweredName = name.charAt(0).toLowerCase() + name.slice(1);

  return {
    name: `✶${i18n.t(`unitStatus.${loweredName}.name`)}✶`,
    description: i18n.t(`unitStatus.${loweredName}.description`)
  };
};

/**
 * Get the translated keyword information
 * @param {string} name - The keyword name
 * @returns {Object} Translated keyword information
 */
export const logUnitKeyword = (name) => {
  if (!name) return { name: '', description: '', descriptionTooltip: '' };

  return {
    name: `✦${i18n.t(`unitKeywords.${name}.name`)}✦`,
    description: i18n.t(`unitKeywords.${name}.description`),
    descriptionTooltip: i18n.t(`unitKeywords.${name}.descriptionTooltip`, { defaultValue: '' })
  };
};

/**
 * Get the translated skill information
 * @param {string} name - The skill name
 * @returns {Object} Translated skill information
 */
export const logUnitSkill = (name) => {
  if (!name) return { name: '', description: '', descriptionTooltip: '', effect: '' };

  return {
    name: `✧${i18n.t(`unitSkills.${name}.name`)}✧`,
    description: i18n.t(`unitSkills.${name}.description`),
    descriptionTooltip: i18n.t(`unitSkills.${name}.descriptionTooltip`, { defaultValue: '' }),
    effect: i18n.t(`unitSkills.${name}.effect`, { defaultValue: '' })
  };
};

/**
 * Get the translated building information
 * @param {string} name - The building name
 * @returns {Object} Translated building information
 */
export const logBuilding = (name) => {
  if (!name) return { name: '', description: '' };

  return {
    name: i18n.t(`buildings.${name}.name`),
    description: i18n.t(`buildings.${name}.description`)
  };
};

/**
 * Get the translated phase name
 * @param {string} name - The phase name
 * @returns {string} Translated phase name
 */
export const logPhase = (name) => {
  if (!name) return '';
  return i18n.t(`phase.${name}`);
};

/**
 * Get the translated UI text
 * @param {string} name - The UI text key
 * @returns {string} Translated UI text
 */
export const logGameUi = (name) => {
  if (!name) return '';
  return i18n.t(`game.${name}`);
};

/**
 * Get the translated player name with number
 * @param {number} qty - The player number
 * @returns {string} Translated player name
 */
export const logPlayerName = (qty) => {
  return i18n.t('game.player', { number: qty || 0 });
};
