import {
  getInGameUnits,
  getNearestEnemies,
  getNeighbors,
  getUnitById,
  hasStatus,
  isNotSame,
  isSame,
  removeStatus,
  resolveUnitsInteraction
} from '../helpers/Utils';
import {startPositions} from "./Setup";
import {UnitTypes} from "../units/Unit";
import {DamageType, UnitStatus} from "../helpers/Constants";

export const moves = {
  selectNewUnit: ({G, ctx}, currentUnit) => {
    if (G.players[ctx.currentPlayer].units.filter(unit => unit.unitState.isInGame === false).length > 0) {
      if (currentUnit.type === UnitTypes.Idol)
        G.availablePoints = [startPositions[ctx.currentPlayer][0]]
      else
        G.availablePoints = startPositions[ctx.currentPlayer].slice(1, startPositions[ctx.currentPlayer].length)
      G.currentUnit = currentUnit
    }
  },
  selectOldUnit: ({ G, ctx }, currentUnit) => {
    if (currentUnit.type === UnitTypes.Idol)
      G.availablePoints = [startPositions[ctx.currentPlayer][0]]
    else
      G.availablePoints = startPositions[ctx.currentPlayer].slice(1, startPositions[ctx.currentPlayer].length)
    G.currentUnit = currentUnit
  },

  selectUnitOnBoard: ({ G, ctx }, currentUnit) => {
    const enemies = getNearestEnemies(G, currentUnit.unitState)
    if (hasStatus(currentUnit, UnitStatus.Freeze)) {
      G.availablePoints = []
    } else {
      G.availablePoints = getNeighbors(currentUnit.unitState.point)
        .filter(point => getInGameUnits(G).every(unit => isNotSame(unit.unitState.point)(point)))
        .filter(point => {
          if (enemies.length > 0) {
            const surroundings = getNeighbors(point)
            return enemies.every(enemy => surroundings.find(isSame(enemy.unitState.point)) !== undefined)
          } else return true
        })
    }
    G.currentUnit = currentUnit
  },

  selectUnitForAttack: ({ G, ctx }, currentUnit) => {
    G.availablePoints = getNearestEnemies(G, currentUnit.unitState).map(unit => unit.unitState.point)
    G.currentUnit = currentUnit
  },

  moveUnit: ({G, ctx}, point) => {
    const unit = G.players[+ctx.currentPlayer].units.find(unit => unit.id === G.currentUnit.id)
    const unitToReplace = getInGameUnits(G).find(unit => isSame(point)(unit.unitState.point))
    if (unitToReplace !== undefined) {
      if (unit.unitState.point !== null) {
        unitToReplace.unitState.point = unit.unitState.point
      } else {
        unitToReplace.unitState.point = null
        unitToReplace.unitState.isInGame = false
      }
    }
    unit.unitState.point = point
    unit.unitState.isInGame = true
    G.currentUnit = null
    G.availablePoints = []
  },

  removeUnit: ({G, ctx}) => {
    const unit = G.players[ctx.currentPlayer].units.find(unit => unit.id === G.currentUnit.id)
    unit.unitState.point = null
    unit.unitState.isInGame = false
    G.availablePoints = []
  },

  moveUnitOnBoard: ({G, ctx, events}, point) => {
    const unit = getInGameUnits(G).find(unit => unit.id === G.currentUnit.id)
    unit.unitState.point = point
    unit.unitState.isClickable = false
    G.currentUnit = null
    G.availablePoints = []
    events.endTurn()
  },

  attackTarget: ({G, ctx}, point) => {
    const enemy = getInGameUnits(G).find((unit) => isSame(unit.unitState.point)(point))
    const unit = getUnitById(G, G.currentUnit.id)

    resolveUnitsInteraction({G: G, ctx: ctx}, {
      currentUnit: unit,
      enemy: enemy,
      updates: {
        damage: unit.power,
        damageType: DamageType.Default,
      }
    })

    if (enemy.heals > 0 && enemy.type !== UnitTypes.Ispolin && enemy.unitState.isCounterAttacked === false) {
      enemy.unitState.isCounterAttacked = true

      resolveUnitsInteraction({G: G, ctx: ctx}, {
        currentUnit: enemy,
        enemy: unit,
        updates: {
          damage: Math.trunc(enemy.power / 2),
          damageType: DamageType.Counter,
        }
      })
    }

    [unit, enemy].forEach(u => {
      if(u.heals <= 0) {
        u.unitState.isInGame = false // (UNIT DIES)
        G.fightQueue.forEach((unitInQ, i, q) => {
          if(unitInQ.unitId === u.id) {
            q.splice(i, 1);
          }
        })
      }
    })
    unit.unitState.isClickable = false
    G.currentUnit = null
    G.availablePoints = []
  },

  complete: ({G, ctx, events}) => {
    // if (getInGameUnits(G, (unit) => (unit.unitState.playerId === +ctx.currentPlayer) && (unit.type === UnitTypes.Idol)).length > 0) {
      G.setupComplete++
      G.availablePoints = []
      events.endTurn()
    // } else {
    //   console.log("You can't start battle without an Idol on the field")
    // }
  },

  skipTurn: ({ G, events }) => {
    const unit = getUnitById(G, G.currentUnit.id)
    removeStatus(unit, UnitStatus.Freeze)
    unit.unitState.isClickable = false
    G.currentUnit = null
    G.availablePoints = []
    events.endTurn()
  },

  skipFightTurn: ({ G }) => {
    const unit = getUnitById(G, G.currentUnit.id)
    if (unit.unitState.skippedTurn) {
      unit.unitState.isClickable = false
    } else {
      G.fightQueue.forEach((unitInQ, i, q) => {
        if(unitInQ.unitId === G.currentUnit.id) {
          q.push(q.splice(i, 1)[0]);
        }
      })
      unit.unitState.skippedTurn = true
    }
    G.currentUnit = null
    G.availablePoints = []
  },

};
