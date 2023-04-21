import {
  getInGameUnits,
  getNearestAllies,
  getNearestEnemies,
  handleUnitDeath,
  hasKeyword,
  hasStatus,
  isNotSame,
  resolveUnitsInteraction,
  shuffleArray
} from '../helpers/Utils';
import {
  DamageType,
  playerColors,
  UnitKeywords,
  UnitStatus,
  UnitTypes
} from '../helpers/Constants';
import {startPositions} from "./Setup";
import {biomComparison} from "../helpers/UnitPriority";
import {handleOnMoveActions} from "./GameActions";
import {gameLog} from "../helpers/Log";

const setColorMap = G => {
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
};

export const onPositioningStart = (G, ctx, events) => {
  const units = getInGameUnits(G)
  if((G.moveOrder >= 2) && (G.moveOrder % 2 === 0)) {
    units.filter(unit => {
      const point = unit.unitState.point
      const level = G.grid.levels
      return (Math.max(Math.abs(point.x), Math.abs(point.y), Math.abs(point.z)) === level) || (point.y === level-1) || (point.z === -(level-1))
    }).forEach(unit => handleUnitDeath({G: G, ctx: ctx, events: events}, unit))
    G.players.forEach(p => {
      if (p.units.every(unit => unit.unitState.isInGame === false)) p.isInGame = false
    })
    G.grid.levels--;
  }

  units.forEach(unit => {
    if (hasStatus(unit, UnitStatus.Poison)) {
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: unit,
        enemy: unit,
        updates: {
          damage: 1,
          damageType: DamageType.Poison,
        }
      })
      gameLog.addLog({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${unit.name} страждає від отруєння`,
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
    unit.unitState.isMovedLastPhase = false
    unit.unitState.initiatorFor = []
  })
  return G
}

export const handleGameOver = (G, ctx) =>
  (G.setupComplete === G.players.length) && ([...new Set(getInGameUnits(G).map(unit => unit.unitState.playerId))].length <= 1)

export const onGameOver = (G, ctx) => {
  const remainPlayers = [...new Set(getInGameUnits(G).map(unit => unit.unitState.playerId))]
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

export const endFightPhase = (G, ctx) =>
  getInGameUnits(G, (unit) => unit.unitState.isClickable && unit.unitState.isInFight).length === 0

export const setInFightUnits = (G, ctx) => {
  getInGameUnits(G).forEach(unit => {
    if(getNearestEnemies(G, unit.unitState).length > 0) {
      unit.unitState.isInFight = true
    } else {
      unit.unitState.isInFight = false
    }
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
        gameLog.addLog({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `${unit.name} не має доступних цілей для підтримки`,
        })
      }
    })

  G.fightQueue = getInGameUnits(G, (unit) => unit.unitState.isInFight)
    .sort((u1, u2) =>
      (u1.initiative > u2.initiative) ? 1 : (u1.initiative < u2.initiative) ? -1 : biomComparison(u1.biom, u2.biom)
    ).reverse().map(unit => ({unitId: unit.id, playerId: unit.unitState.playerId}))
}

export const postProcess = ({ G, ctx, events, playerID }) => {
  setColorMap(G);

  if (ctx.phase !== 'Setup') {
    handleOnMoveActions({ G, ctx, events, playerID })
  }
  return G;
};
