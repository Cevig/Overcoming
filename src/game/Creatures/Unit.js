import {Biom} from "../constants";

export const UnitTypes = Object.freeze({
  Prispeshnick: 0,
  Ispolin: 1,
  Vestnick: 2,
  Idol: 3
})

export class Unit {
  name: String
  type: UnitTypes
  placeType: Biom
  id: Number
  power: Number
  heals: Number
  initiative: Number
  status: Array = []
  isClickable: Boolean = false

  constructor(name, type, placeType, id, power, heals, initiative, status, isClickable) {
    this.name = name;
    this.type = type;
    this.placeType = placeType;
    this.id = id;
    this.power = power;
    this.heals = heals;
    this.initiative = initiative;
    this.status = status;
    this.isClickable = isClickable;
  }
}

export class Creature extends Unit {
  level: Number = 1

  constructor(name, type, placeType, id, power, heals, initiative, status, isClickable, level) {
    super(name, type, placeType, id, power, heals, initiative, status, isClickable)
    this.level = level;
  }
}
