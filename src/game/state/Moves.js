import {
  getInGameUnits,
  getNearestEnemy,
  getNeighbors,
  getUnitById,
  isNotSame,
  isSame
} from '../helpers/Utils';
import {startPositions} from "./Setup";
import {UnitTypes} from "../units/Unit";

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
  selectOldUnit: ({ G }, currentUnit) => {
    G.availablePoints = getNeighbors(currentUnit.unitState.point)
    G.currentUnit = currentUnit
  },

  selectUnitOnBoard: ({ G, ctx }, currentUnit) => {
    const enemies = getNearestEnemy(G, currentUnit.unitState)
    G.availablePoints = getNeighbors(currentUnit.unitState.point)
      .filter(point =>
        getInGameUnits(G).every(unit => isNotSame(unit.unitState.point)(point))
      ).filter(point => {
        if (enemies.length > 0) {
          const surroundings = getNeighbors(point)
          return enemies.every(enemy => surroundings.find(isSame(enemy.unitState.point)) !== undefined)
        } else return true
      })
    G.currentUnit = currentUnit
  },

  selectUnitForAttack: ({ G, ctx }, currentUnit) => {
    G.availablePoints = getNearestEnemy(G, currentUnit.unitState).map(unit => unit.unitState.point)
    G.currentUnit = currentUnit
  },

  moveUnit: ({G, ctx}, point) => {
    const unit = G.players[ctx.currentPlayer].units.filter(unit => unit.id === G.currentUnit.id)[0]
    unit.unitState.point = point
    unit.unitState.isInGame = true
    G.currentUnit = null
    G.availablePoints = []
  },

  moveUnitOnBoard: ({G, ctx}, point) => {
    const unit = getInGameUnits(G).find(unit => unit.id === G.currentUnit.id)
    unit.unitState.point = point
    unit.unitState.isClickable = false
    G.currentUnit = null
    G.availablePoints = []
  },

  attackTarget: ({G, ctx}, point) => {
    const enemy = getInGameUnits(G).find((unit) => isSame(unit.unitState.point)(point))
    const unit = getInGameUnits(G).find(unit => unit.id === G.currentUnit.id)
    enemy.heals = enemy.heals - G.currentUnit.power
    if (enemy.heals > 0 && enemy.type !== UnitTypes.Ispolin) {
      unit.heals = unit.heals - Math.trunc(enemy.power / 2)
    }

    [unit, enemy].forEach(u => {
      if(u.heals <= 0) {
        u.unitState.isInGame = false
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
    if (getInGameUnits(G, (unit) => (unit.unitState.playerId === +ctx.currentPlayer) && (unit.type === UnitTypes.Idol)).length > 0) {
      G.setupComplete = G.setupComplete + 1
      events.endTurn()
    } else {
      alert("You can't start battle without an Idol on the field")
    }
  },

  skipTurn: ({ G }) => {
    const unit = getInGameUnits(G).find(unit => unit.id === G.currentUnit.id)
    unit.unitState.isClickable = false
    G.currentUnit = null
    G.availablePoints = []
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
