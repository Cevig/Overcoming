import {
  getInGameUnits,
  getNearestEnemies,
  getUnitById,
  handleUnitDeath,
  hasStatus,
  resolveUnitsInteraction
} from "../helpers/Utils";
import {UnitTypes} from "../units/Unit";
import {USteppe} from "../units/Steppe";
import {DamageType, UnitStatus} from "../helpers/Constants";

export const handleAbility = (data, skill, eventData) => {
  const abilitiesMap = {
    surround3: handlePolydnicaSurroundings,
    wholeness: handleWholeness,
    addFreezeEffect: handleFreezeEffectOnAttack,
    maraAura: handleMaraAura,
  }

  return abilitiesMap[skill](data, eventData)
}
const handlePolydnicaSurroundings = ({G}, {unitId}) => {
  const units = getInGameUnits(G)
  const thisUnit = getUnitById(G, unitId)
  const alliedUnits = units.filter(unit => (unit.unitState.playerId === thisUnit.unitState.playerId) && (unit.name === USteppe.polydnicaName))
  if (alliedUnits.length >= 3) {
    const enemyUnits = units.filter(unit => (unit.unitState.playerId !== thisUnit.unitState.playerId) && (unit.type !== UnitTypes.Idol))
    enemyUnits.forEach(enemy => {
      const enemiesForEnemy = getNearestEnemies(G, enemy.unitState).filter(unit => unit.name === USteppe.polydnicaName)
      if (enemiesForEnemy.length >= 3) {
        handleUnitDeath({G: G}, enemy)
      }
    })
  }
}

const handleWholeness = ({G}, {unitId, updates}) => {
  const thisUnit = getUnitById(G, unitId)
  const tempUnit = USteppe.getPolydnica(unitId, 10, thisUnit.level)

  if (updates.power !== undefined) {
    updates.power = ((thisUnit.power - updates.power) < tempUnit.power) ?  (thisUnit.power - tempUnit.power) : updates.power
    if (updates.status !== undefined && updates.power === 0) {
      const decreasingStatusPower = updates.status.find(status => status.name === UnitStatus.PowerDown)
      if(decreasingStatusPower !== undefined) {
        decreasingStatusPower.qty = 0
      }
    }
  }
  if (updates.initiative !== undefined) {
    updates.initiative = ((thisUnit.initiative - updates.initiative) < tempUnit.initiative) ? (thisUnit.initiative - tempUnit.initiative) : updates.initiative
    if (updates.status !== undefined && updates.initiative === 0) {
      const decreasingStatusInit = updates.status.find(status => status.name === UnitStatus.InitiativeDown)
      if(decreasingStatusInit !== undefined) {
        decreasingStatusInit.qty = 0
      }
    }
  }
  return updates
}

const handleFreezeEffectOnAttack = ({G}, {unitId, updates}) => {
  return (updates.damageType === DamageType.Default) ? {status: [{name: UnitStatus.Freeze, qty: 1}]} : {}
}

const handleMaraAura = ({G}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId)

  getInGameUnits(G, unit => unit.unitState.playerId !== thisUnit.unitState.playerId).forEach(enemy => {
    const nearMaras = getNearestEnemies(G, enemy.unitState).filter(unit => unit.name === USteppe.maraName).length
    const auraKeyword = UnitStatus.InitiativeDown
    if (hasStatus(enemy, auraKeyword)) {
      const value = enemy.status.filter(status => status === auraKeyword).length
      const diffRemove = -(thisUnit.level >= 2 ? (value * 2) : value)
      resolveUnitsInteraction({G: G}, {
        currentUnit: thisUnit,
        enemy: enemy,
        updates: {
          initiative: -(thisUnit.level >= 2 ? (value * 2) : value),
          status: [{name: auraKeyword, qty: diffRemove}]
        }
      });
    }
    if (nearMaras > 0) {
      const diff = (thisUnit.level >= 2) ? (nearMaras * 2) : nearMaras
      resolveUnitsInteraction({G: G}, {
        currentUnit: thisUnit,
        enemy: enemy,
        updates: {
          initiative: diff,
          status: [{name: auraKeyword, qty: diff}]
        }
      });
    }
  })
}
