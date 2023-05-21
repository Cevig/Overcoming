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
import {getColorMap} from "./Setup";
import {handleOnMoveActions} from "./GameActions";

const setColorMap = (G, ctx, playerID) => {
  if (ctx.phase === 'Setup') {
    G.players[+playerID].grid.colorMap = getColorMap(ctx.numPlayers)

    Object.entries(G.grid.colorMap).forEach(([color, points]) => {
      G.players[+playerID].grid.colorMap[color] = points.filter(mapPoint => G.players[+playerID].availablePoints.every(availablePoint => isNotSame(mapPoint)(availablePoint)))
    })
    G.players[+playerID].grid.colorMap['#dd666f'] = G.players[+playerID].availablePoints
  } else {
    G.grid.colorMap = getColorMap(ctx.numPlayers)
    Object.entries(G.grid.colorMap).forEach(([color, points]) => {
      G.grid.colorMap[color] = points.filter(mapPoint => G.availablePoints.every(availablePoint => isNotSame(mapPoint)(availablePoint)))
    })
    G.grid.colorMap['#dd666f'] = G.availablePoints
  }
};

export const onBuildingBegin = (G, ctx, events) => {
  G.players.filter(p => p.isPlayerInGame).forEach(p => {
    p.houses.forEach(h => {
      if (h.name === Buildings.Svjatulushe.name) {
        p.essence += 8;
        G.serverMsgLog.push({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `${p.name} отримав 8✾ завдяки ${Buildings.Svjatulushe.name}`,
        })
      }
    })
    p.essenceFreeze = p.essence
  })
  let availableBioms = {...Biom}
  const getRandomBiom = () => {
    const biomKeys = Object.keys(availableBioms)
    const randKey = biomKeys[Math.floor(Math.random()*biomKeys.length)]
    const biom = availableBioms[randKey]
    delete availableBioms[randKey];
    return biom
  }

  G.players.filter(p => p.bioms.length === 0).forEach(p => {
    p.bioms = [getRandomBiom(), getRandomBiom()]
  })
}

export const onPositioningStart = (G, ctx, events) => {
  G.grid.unstablePoints = []
  G.endFightPhase = false

  G.players.filter(p => p.isPlayerInGame).forEach(p => {
    if (p.units.every(unit => unit.unitState.isInGame === false)) p.isPlayerInBattle = false
  })
  if (G.players.filter(p => p.isPlayerInBattle).length <= 1) {
    events.endPhase()
    return G;
  }

  const units = getInGameUnits(G)
  if((G.shrinkZone >= 2) && (G.shrinkZone % 2 === 0)) {
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `Руйнування простору - поле зменшилося!!!`,
    })
    const unstablePoints = getUnstablePoints(G, ctx)
    units.filter(unit => unstablePoints.find(isSame(unit.unitState.point)))
      .forEach(unit => handleUnitDeath({G: G, ctx: ctx, events: events}, unit))
    G.grid.levels--;
  }
  if ((G.shrinkZone >= 1) && (G.shrinkZone % 2 === 1)) {
    G.grid.unstablePoints = getUnstablePoints(G, ctx)
  }

  units.forEach(unit => {
    if (hasStatus(unit, UnitStatus.Poison)) {
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${unit.name} страждає від ${UnitStatus.Poison}`,
      })
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: unit,
        enemy: unit,
        updates: {
          damage: 1,
          damageType: DamageType.Poison,
          status: [{name: UnitStatus.Poison, qty: -1}]
        }
      })
      if (unit.heals <= 0) {
        handleUnitDeath({G: G, ctx: ctx, events: events}, unit)
      }
    }
    if (hasStatus(unit, UnitStatus.Unarmed)) {
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: unit,
        enemy: unit,
        updates: {
          status: [{name: UnitStatus.Unarmed, qty: -1}]
        }
      })
    }
    if (hasStatus(unit, UnitStatus.Unfocused)) {
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: unit,
        enemy: unit,
        updates: {
          status: [{name: UnitStatus.Unfocused, qty: -1}]
        }
      })
    }
    if (hasStatus(unit, UnitStatus.Stun)) {
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${unit.name} приголомшений та пропускає хід`,
      })
      unit.unitState.isClickable = false
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: unit,
        enemy: unit,
        updates: {
          status: [{name: UnitStatus.Stun, qty: -1}]
        }
      })
    }
    unit.unitState.isMovedLastPhase = false
    unit.unitState.initiatorFor = []
  })
  G.players.filter(p => p.isPlayerInGame).forEach(p => {
    if (p.units.every(unit => unit.unitState.isInGame === false)) p.isPlayerInBattle = false
  })
  if (G.players.filter(p => p.isPlayerInBattle).length <= 1) {
    events.endPhase()
  }
  return G
}

export const handleGameOver = (G, ctx) =>
  G.players.filter(p => p.isPlayerInGame).length <= 1 || G.players.filter(p => p.heals > 0).length <= 1

export const onGameOver = (G, ctx) => {
  const remainPlayers = G.players.filter(p => p.isPlayerInGame && p.heals > 0)
  G.winner = remainPlayers.length === 0 ? -1 : remainPlayers[0]
  return G
}

export const cleanFightPhase = (G, ctx, events) => {
  getInGameUnits(G).forEach(unit => {
    unit.unitState.isClickable = true
    unit.unitState.isInFight = false
    unit.unitState.skippedTurn = false
    unit.unitState.isCounterAttacked = false
    const supportStatus = getStatus(unit, UnitStatus.PowerUpSupport)
    if (supportStatus) {
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: unit,
        enemy: unit,
        updates: {
          power: supportStatus.qty,
          status: [{name: UnitStatus.PowerUpSupport, qty: -99}]
        }
      });
    }
  });
  G.players.filter(p => p.isPlayerInGame).forEach(p => {
    if (p.units.every(unit => unit.unitState.isInGame === false)) p.isPlayerInBattle = false
  })
  G.moveOrder++;
  G.shrinkZone++;
  G.fightQueue = []
  return G
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

export const setInFightUnits = (G, ctx, events) => {
  if ((G.setupComplete === G.players.filter(p => p.isPlayerInGame).length) && (G.players.filter(p => p.isPlayerInBattle).length <= 1)) {
    const remainPlayer = G.players.find(p => p.isPlayerInBattle)
    if(remainPlayer) {
      remainPlayer.wins++;
    }
    return G
  }
  getInGameUnits(G).forEach(unit => {
    unit.unitState.isInFight = getNearestEnemies(G, unit.unitState).length > 0;
  });
  if(getInGameUnits(G, (unit) => unit.unitState.isInFight).length > 0)
    getInGameUnits(G).forEach(unit => unit.unitState.isClickable = unit.unitState.isInFight)
  return G
}

export const setFightOrder = (G, events, ctx) => {
  getInGameUnits(G)
    .filter(unit => hasKeyword(unit, UnitKeywords.Support))
    .forEach(unit => {
      const availableAllies = getNearestAllies(G, unit.unitState).filter(ally => ally.type !== UnitTypes.Idol)
        .filter(ally => ally.unitState.isInFight)
      if (availableAllies.length > 0) {
        const randomAlly = shuffleArray(availableAllies).pop()
        resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
          currentUnit: unit,
          enemy: randomAlly,
          updates: {
            power: -1,
            status: [{name: UnitStatus.PowerUpSupport, qty: 1}]
          }
        });
      } else {
        G.serverMsgLog.push({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `${unit.name} не має доступних цілей для підтримки`,
        })
      }
    })
  getInGameUnits(G, unit => hasStatus(unit, UnitStatus.Stun)).forEach(u => {u.unitState.isClickable = false;})

  G.fightQueue = getInGameUnits(G, (unit) => unit.unitState.isInFight && !hasStatus(unit, UnitStatus.Stun))
    .sort((u1, u2) => sortFightOrder(u1, u2))
    .reverse().map(unit => ({unitId: unit.id, playerId: unit.unitState.playerId}))
  G.endFightPhase = G.fightQueue.length === 0
}

export const handleSortieRewards = (G, events, ctx) => {
  G.players.filter(p => p.isPlayerInGame).forEach(p => {
    let essence = 0
    const result = calculateSortie(G, p)
    result.forEach(res => {
      if (res.type === SortieTypes.A) {
        essence += 12;
      } else if (res.type === SortieTypes.B) {
        essence += 7;
      } else if (res.type === SortieTypes.E) {
        essence -= 5
      }
    })
    if (p.houses.find(h => h.name === Buildings.NebesnaBrama.name) !== undefined) {
      essence += 3 * p.units.filter(u => u.unitState.isInSortie).length
    }

    if (essence !== 0) {
      p.essence += essence
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${p.name} отримує ${essence}✾ від вилазок!`,
      })
    }
  })
}

export const postProcess = ({ G, ctx, events, playerID }) => {
  setColorMap(G, ctx, playerID);

  if (ctx.phase === 'Positioning' || ctx.phase === 'Fight') {
    handleOnMoveActions({ G, ctx, events, playerID })
  }
  return G;
};
