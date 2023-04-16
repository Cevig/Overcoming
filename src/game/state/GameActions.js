import {getInGameUnits, getUnitById} from "../helpers/Utils";
import {handleAbility} from "./UnitSkills";

export const handleOnMoveActions = (data) => {
  const {G} = data

  const appliedSkills =[]
  getInGameUnits(G, unit => unit.abilities.onMove.length !== 0)
    .forEach(unit => {
      unit.abilities.onMove.forEach(skill => {
        if (appliedSkills.find(as => as === skill.name) === undefined) {
          handleAbility(data, skill.name, {unitId: unit.id})
          appliedSkills.push(skill.name)
        }
      })
    })
}

export const handleUnitStatsUpdateInDefence = (data, eventData) => {

  const {G} = data
  const {unitId, updates} = eventData
  const result = []

  const unit = getUnitById(G, unitId)
  if (unit.abilities.statUpdates.defence.length !== 0) {
    unit.abilities.statUpdates.defence.forEach(skill => {
      return result.push(handleAbility(data, skill.name, eventData))
    })
  }

  return result.reduce((res, obj) => Object.assign(res, obj), updates)
}

export const handleUnitStatsUpdateInAttack = (data, eventData) => {

  const {G} = data
  const {unitId, updates} = eventData
  const result = []

  const unit = getUnitById(G, unitId)
  if (unit.abilities.statUpdates.attack.length !== 0) {
    unit.abilities.statUpdates.attack.forEach(skill => {
      return result.push(handleAbility(data, skill, eventData))
    })
  }

  return result.reduce((res, obj) => Object.assign(res, obj), updates)
}
