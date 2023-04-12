import {Biom, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState} from "./Unit";

export class UDesert {
  static getAmfisbena = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 6, 3]
      if (level === 2)
        return [2, 6, 4]
      if (level === 3)
        return [3, 7, 4]
    }

    return getCreature("Амфінсбена", UnitTypes.Prispeshnick, Biom.Desert, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }
  static getObajifo = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 3, 5]
      if (level === 2)
        return [2, 4, 6]
      if (level === 3)
        return [3, 4, 6]
    }

    return getCreature("Обаїфо", UnitTypes.Ispolin, Biom.Desert, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }

  static getAdze = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 4]
      if (level === 2)
        return [2, 5, 4]
      if (level === 3)
        return [3, 6, 4]
    }

    return getCreature("Адзе", UnitTypes.Vestnick, Biom.Desert, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }

  static getSfinks = (id, playerId, _, createPosition) => {
    const stat = [2, 11, 4]
    return getIdol("Сфінкс", Biom.Desert, id, ...stat, getUnitState(id, playerId, createPosition))
  }

  static getVasilisk = (id, playerId, _, createPosition) => {
    const stat = [2, 8, 4]
    return getIdol("Василіск", Biom.Desert, id, ...stat, getUnitState(id, playerId, createPosition))
  }
}
