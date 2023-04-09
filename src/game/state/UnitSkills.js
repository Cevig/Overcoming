import {getInGameUnits, getNearestEnemies, getUnitById} from "../helpers/Utils";
import {UnitTypes} from "../units/Unit";
import {USteppe} from "../units/Steppe";
import {DamageType, UnitStatus} from "../helpers/Constants";

export const handleAbility = (data, skill, eventData) => {
  const abilitiesMap = {
    surround3: handlePolydnicaSurroundings,
    wholeness: handleWholeness,
    addFreezeEffect: handleFreezeEffectOnAttack,
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
        enemy.unitState.isInGame = false // (UNIT DIES)
      }
    })
  }
}

const handleWholeness = ({G}, {unitId, updates}) => {
  let result = {}
  if (updates.power !== undefined) result.power = 0
  if (updates.initiative !== undefined) result.initiative = 0
  return result
}

const handleFreezeEffectOnAttack = ({G}, {unitId, updates}) => {
  return (updates.damageType === DamageType.Default) ? {status: UnitStatus.Freeze} : {}
}
