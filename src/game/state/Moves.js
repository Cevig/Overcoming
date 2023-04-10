import {
  getInGameUnits,
  getNearestEnemies,
  getNeighbors,
  getUnitById,
  handleUnitDeath,
  hasKeyword,
  hasStatus,
  isNotSame,
  isSame,
  removeStatus,
  resolveUnitsInteraction
} from '../helpers/Utils';
import {startPositions} from "./Setup";
import {UnitTypes} from "../units/Unit";
import {DamageType, UnitKeywords, UnitStatus} from "../helpers/Constants";
import {handleAbility} from "./UnitSkills";

export const moves = {
  selectNewUnit: ({G, ctx, events}, currentUnit) => {
    if (G.players[ctx.currentPlayer].units.filter(unit => unit.unitState.isInGame === false).length > 0) {
      if (currentUnit.type === UnitTypes.Idol)
        G.availablePoints = [startPositions[ctx.currentPlayer][0]]
      else
        G.availablePoints = startPositions[ctx.currentPlayer].slice(1, startPositions[ctx.currentPlayer].length)
      G.currentUnit = currentUnit
    }
    events.endStage();
  },
  selectOldUnit: ({ G, ctx, events }, currentUnit) => {
    if (currentUnit.type === UnitTypes.Idol)
      G.availablePoints = [startPositions[ctx.currentPlayer][0]]
    else
      G.availablePoints = startPositions[ctx.currentPlayer].slice(1, startPositions[ctx.currentPlayer].length)
    G.currentUnit = currentUnit
    events.endStage();
  },

  selectUnitOnBoard: ({ G, ctx, events }, currentUnit) => {
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
    events.endStage();
  },

  selectUnitForAttack: ({ G, ctx, events }, currentUnit) => {
    G.availablePoints = getNearestEnemies(G, currentUnit.unitState).map(unit => unit.unitState.point)
    G.currentUnit = currentUnit
    events.endStage();
  },

  moveUnit: ({G, ctx, events}, point) => {
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
    events.endStage();
  },

  removeUnit: ({G, ctx, events}) => {
    const unit = G.players[ctx.currentPlayer].units.find(unit => unit.id === G.currentUnit.id)
    unit.unitState.point = null
    unit.unitState.isInGame = false
    G.availablePoints = []
    events.endStage();
  },

  moveUnitOnBoard: ({G, ctx, events}, point) => {
    const unit = getInGameUnits(G).find(unit => unit.id === G.currentUnit.id)
    unit.unitState.point = point
    G.availablePoints = []
    if (G.currentUnit.abilities.actions.find(action => action.name === "raid") !== undefined) {
      handleAbility({ G, events }, "raid", {unitId: G.currentUnit.id})
    } else {
      unit.unitState.isClickable = false
      G.currentUnit = null
      events.endTurn()
    }
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

    if (enemy.heals > 0 && !hasKeyword(unit, UnitKeywords.Sneaky) && !hasKeyword(enemy, UnitKeywords.Unfocused) && enemy.unitState.isCounterAttacked === false) {
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

    if(enemy.heals <= 0) {
      handleUnitDeath({G: G}, enemy, unit)
      G.fightQueue.forEach((unitInQ, i, q) => {
        if(unitInQ.unitId === enemy.id) {
          q.splice(i, 1);
        }
      })
    }
    if(unit.heals <= 0) {
      handleUnitDeath({G: G}, unit, enemy)
      G.fightQueue.forEach((unitInQ, i, q) => {
        if(unitInQ.unitId === unit.id) {
          q.splice(i, 1);
        }
      })
    }

    unit.unitState.isClickable = false
    G.currentUnit = null
    G.availablePoints = []
    G.endFightTurn = true
  },

  raidAttack: ({G, events}, point) => {
    const enemy = getInGameUnits(G).find((unit) => isSame(unit.unitState.point)(point))
    const thisUnit = getUnitById(G, G.currentUnit.id)
    resolveUnitsInteraction({G: G}, {
      currentUnit: thisUnit,
      enemy: enemy,
      updates: {
        damage: Math.trunc(G.currentUnit.power / 2),
        damageType: DamageType.Raid,
      }
    })
    if(enemy.heals <= 0) {
      handleUnitDeath({G: G}, enemy, thisUnit)
    }
    G.availablePoints = []
    G.currentUnit = null
    thisUnit.unitState.isClickable = false
    events.endTurn()
  },

  skipRaidTurn: ({ G, events }) => {
    const thisUnit = getUnitById(G, G.currentUnit.id)
    G.currentUnit = null
    G.availablePoints = []
    thisUnit.unitState.isClickable = false
    events.endTurn()
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
    G.availablePoints = []

    if (G.currentUnit.abilities.actions.find(action => action.name === "raid") !== undefined) {
      handleAbility({ G, events }, "raid", {unitId: G.currentUnit.id})
    } else {
      unit.unitState.isClickable = false
      G.currentUnit = null
      events.endTurn()
    }
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
    G.endFightTurn = true
  },

};
