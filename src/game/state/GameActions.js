import {getInGameUnits, getUnitById} from "../helpers/Utils";
import {handleAbility} from "./UnitSkills";

export const handlePositioningOnMoveActions = (data) => {

  const {G} = data

  getInGameUnits(G, unit => unit.abilities.onMove.game.length !== 0)
    .forEach(unit => {
      unit.abilities.onMove.game.forEach(skill => {
        handleAbility(data, skill.name, {unitId: skill.unitId})
      })
    })
}

export const handleUnitStatsUpdateInDefence = (data, eventData) => {

  const {G} = data
  const {unitId, updates} = eventData
  const result = []

  const unit = getUnitById(G, unitId)
  if (unit.abilities.statUpdates.handlers.defence.length !== 0) {
    unit.abilities.statUpdates.handlers.defence.forEach(skill => {
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
  if (unit.abilities.statUpdates.handlers.attack.length !== 0) {
    unit.abilities.statUpdates.handlers.attack.forEach(skill => {
      return result.push(handleAbility(data, skill.name, eventData))
    })
  }

  return result.reduce((res, obj) => Object.assign(res, obj), updates)
}
