import {
  calculateSortie,
  createPoint,
  getInGameUnits,
  getNearestAllies,
  getNearestEnemies,
  handleUnitDeath,
  hasKeyword,
  hasStatus,
  isNotSame,
  resolveUnitsInteraction,
  shuffleArray,
  sortFightOrder
} from '../helpers/Utils';
import {
  Buildings,
  DamageType,
  playerColors,
  SortieTypes,
  UnitKeywords,
  UnitStatus,
  UnitTypes
} from '../helpers/Constants';
import {startPositions} from "./Setup";
import {handleOnMoveActions} from "./GameActions";

const setColorMap = (G, ctx, playerID) => {
  if (ctx.phase === 'Setup') {
    G.players[+playerID].grid.colorMap = {
      [playerColors[0]]: startPositions[0],//red
      [playerColors[1]]: startPositions[1],//blue
      [playerColors[2]]: startPositions[2],//green
      [playerColors[3]]: startPositions[3]//yellow
    }

    Object.entries(G.grid.colorMap).forEach(([color, points]) => {
      G.players[+playerID].grid.colorMap[color] = points.filter(mapPoint => G.players[+playerID].availablePoints.every(availablePoint => isNotSame(mapPoint)(availablePoint)))
    })
    G.players[+playerID].grid.colorMap['#dd666f'] = G.players[+playerID].availablePoints
  } else {
    G.grid.colorMap = {
      [playerColors[0]]: startPositions[0],//red
      [playerColors[1]]: startPositions[1],//blue
      [playerColors[2]]: startPositions[2],//green
      [playerColors[3]]: startPositions[3]//yellow
    }
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
        p.essence += 6 * h.qty;
        G.serverMsgLog.push({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `${p.name} отримав ${6 * h.qty}✾ завдяки ${Buildings.Svjatulushe.name}`,
        })
      }
    })
  })
}

export const onPositioningStart = (G, ctx, events) => {
  G.grid.unstablePoints = []
  G.endFightPhase = false
  const units = getInGameUnits(G)
  if((G.moveOrder >= 2) && (G.moveOrder % 2 === 0)) {
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `Руйнування простору - поле зменшилося!!!`,
    })
    units.filter(unit => {
      const point = unit.unitState.point
      const level = G.grid.levels
      return (Math.max(Math.abs(point.x), Math.abs(point.y), Math.abs(point.z)) === level) || (point.y === level-1) || (point.z === -(level-1))
    }).forEach(unit => handleUnitDeath({G: G, ctx: ctx, events: events}, unit))
    G.grid.levels--;
  }
  if ((G.moveOrder >= 1) && (G.moveOrder % 2 === 1)) {
    const result = []
    for (let i = 0; i <= G.grid.levels; i++) {
      const a = -i+0
      const b = -(G.grid.levels-i)+0
      result.push([G.grid.levels, a, b])
      result.push([G.grid.levels, b, a])
      result.push([a, G.grid.levels, b])
      result.push([b, G.grid.levels, a])
      result.push([a, b, G.grid.levels])
      result.push([b, a, G.grid.levels])
    }
    for (let i = -1; i > -G.grid.levels; i--) {
      const a = -i
      const b = G.grid.levels+i
      result.push([-G.grid.levels, a, b])
      result.push([-G.grid.levels, b, a])
      result.push([a, -G.grid.levels, b])
      result.push([b, -G.grid.levels, a])
      result.push([a, b, -G.grid.levels])
      result.push([b, a, -G.grid.levels])
    }
    for (let i = 0; i <= G.grid.levels-1; i++) {
      const a = -i+0
      const b = -(G.grid.levels-1-i)+0
      result.push([a, G.grid.levels-1, b])
      result.push([b, G.grid.levels-1, a])
    }
    for (let i = -1; i >= -G.grid.levels+1; i--) {
      const a = -i
      const b = G.grid.levels+i
      result.push([a, b, -G.grid.levels+1])
      result.push([b, a, -G.grid.levels+1])
    }

    G.grid.unstablePoints = [...new Set(result)].filter(arr => arr[1] !== G.grid.levels)
      .filter(arr => arr[2] !== -G.grid.levels)
      .map(arr => createPoint(...arr))
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
    if (hasStatus(unit, UnitStatus.PowerUpSupport)) {
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: unit,
        enemy: unit,
        updates: {
          power: 1,
          status: [{name: UnitStatus.PowerUpSupport, qty: -99}]
        }
      });
    }
  });
  G.moveOrder++;
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
      remainPlayer.essence += 5;
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${remainPlayer.name} перемагає у раунді та отримує 5✾`,
      })
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

  G.fightQueue = getInGameUnits(G, (unit) => unit.unitState.isInFight)
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
        essence += 7;
      } else if (res.type === SortieTypes.B) {
        essence += 4;
      } else if (res.type === SortieTypes.E) {
        essence -= 3
      }
    })
    if (p.houses.find(h => h.name === Buildings.NebesnaBrama.name) !== undefined) {
      essence += 2 * p.units.filter(u => u.unitState.isInSortie).length
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
