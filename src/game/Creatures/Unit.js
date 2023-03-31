export const UnitTypes = Object.freeze({
  Prispeshnick: "Prispeshnick",
  Ispolin: "Ispolin",
  Vestnick: "Vestnick",
  Idol: "Idol"
})

export const getCreature = (name, type, biom, id, power, heals, initiative, level, unitState, status = []) => ({
  id: id,
  name: name,
  type: type,
  biom: biom,
  power: power,
  heals: heals,
  initiative: initiative,
  level: level,
  unitState: unitState,
  status: status
})

export const getIdol = (name, type, biom, id, power, heals, initiative, unitState, status = []) => ({
  id: id,
  name: name,
  type: type,
  biom: biom,
  power: power,
  heals: heals,
  initiative: initiative,
  unitState: unitState,
  status: status
})

export const getUnitState = (unitId, playerId, point = null, isClickable = true, isInGame = false, isInFight = false, skippedTurn = false) => ({
  unitId: unitId,
  playerId: playerId,
  point: point,
  isClickable: isClickable,
  isInGame: isInGame,
  isInFight: isInFight,
  skippedTurn: skippedTurn
})
