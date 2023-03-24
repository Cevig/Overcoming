import {Biom} from "../constants";
import {createPoint} from "../utils";

export const UnitTypes = Object.freeze({
  Prispeshnick: "Prispeshnick",
  Ispolin: "Ispolin",
  Vestnick: "Vestnick",
  Idol: "Idol"
})

export class Unit {
  id: Number
  name: String
  type: typeof UnitTypes
  placeType: typeof Biom
  power: Number
  heals: Number
  initiative: Number
  unitState: UnitState
  status: Array<string> = []
  constructor(name, type, placeType, id, power, heals, initiative, unitState, status) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.placeType = placeType;
    this.power = power;
    this.heals = heals;
    this.initiative = initiative;
    this.unitState = unitState;
    this.status = status;
  }
}

export class UnitState {
  unitId: Number
  point: createPoint
  isClickable: Boolean = false
  isInGame: Boolean = false
  constructor(unitId, point = null, isClickable = true, isInGame = false) {
    this.unitId = unitId;
    this.point = point
    this.isClickable = isClickable;
    this.isInGame = isInGame;
  }
}

export class Creature extends Unit {
  level: Number
  constructor(name, type, placeType, id, power, heals, initiative, unitState, status = [], level = 1) {
    super(name, type, placeType, id, power, heals, initiative, unitState, status)
    this.level = level;
  }
}

export class Idol extends Unit {
  constructor(name, type, placeType, id, power, heals, initiative, unitState, status = []) {
    super(name, type, placeType, id, power, heals, initiative, unitState, status)
  }
}
