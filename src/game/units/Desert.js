import {Biom} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitTypes} from "./Unit";

export class UDesert {
  static getAmfisbena = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 6, 3]
      if (level === 2)
        return [2, 6, 4]
      if (level === 3)
        return [3, 7, 4]
    }

    return getCreature("Amfisbena", UnitTypes.Prispeshnick, Biom.Desert, id, ...stat(), level, getUnitState(id, playerId))
  }
  static getObajifo = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 3, 5]
      if (level === 2)
        return [2, 4, 6]
      if (level === 3)
        return [3, 4, 6]
    }

    return getCreature("Obajifo", UnitTypes.Ispolin, Biom.Desert, id, ...stat(), level, getUnitState(id, playerId))
  }

  static getAdze = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 4]
      if (level === 2)
        return [2, 5, 4]
      if (level === 3)
        return [3, 6, 4]
    }

    return getCreature("Adze", UnitTypes.Vestnick, Biom.Desert, id, ...stat(), level, getUnitState(id, playerId))
  }

  static getSfinks = (id, playerId) => {
    const stat = [2, 11, 4]
    return getIdol("Sfinks", Biom.Desert, id, ...stat, getUnitState(id, playerId))
  }

  static getVasilisk = (id, playerId) => {
    const stat = [2, 8, 4]
    return getIdol("Vasilisk", Biom.Desert, id, ...stat, getUnitState(id, playerId))
  }
}
