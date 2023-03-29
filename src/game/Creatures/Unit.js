export const UnitTypes = Object.freeze({
  Prispeshnick: "Prispeshnick",
  Ispolin: "Ispolin",
  Vestnick: "Vestnick",
  Idol: "Idol"
})

export const getCreature = (name, type, placeType, id, power, heals, initiative, level, unitState, status = []) => ({
  id: id,
  name: name,
  type: type,
  placeType: placeType,
  power: power,
  heals: heals,
  initiative: initiative,
  level: level,
  unitState: unitState,
  status: status
})

export const getIdol = (name, type, placeType, id, power, heals, initiative, unitState, status = []) => ({
  id: id,
  name: name,
  type: type,
  placeType: placeType,
  power: power,
  heals: heals,
  initiative: initiative,
  unitState: unitState,
  status: status
})

export const getUnitState = (unitId, playerId, point = null, isClickable = true, isInGame = false) => ({
  unitId: unitId,
  playerId: playerId,
  point: point,
  isClickable: isClickable,
  isInGame: isInGame
})
