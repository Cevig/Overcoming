import {Biom, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState} from "./Unit";

export class UDesert {

  static amfisbenaName = "Амфінсбена"
  static obajifoName = "Обаїфо"
  static adzeName = "Адзе"
  static sfinksName = "Сфінкс"
  static vasiliskName = "Василіск"
  static getAmfisbena = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 6, 3]
      if (level === 2)
        return [2, 6, 4]
      if (level === 3)
        return [3, 7, 4]
    }

    return getCreature(UDesert.amfisbenaName, UnitTypes.Prispeshnick, Biom.Desert, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
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

    return getCreature(UDesert.obajifoName, UnitTypes.Ispolin, Biom.Desert, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
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

    return getCreature(UDesert.adzeName, UnitTypes.Vestnick, Biom.Desert, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
  }

  static getSfinks = (id, playerId, _, createPosition) => {
    const stat = [2, 11, 4]
    return getIdol(UDesert.sfinksName, Biom.Desert, id, ...stat, getUnitState(id, playerId, ...stat, createPosition))
  }

  static getVasilisk = (id, playerId, _, createPosition) => {
    const stat = [2, 8, 4]
    return getIdol(UDesert.vasiliskName, Biom.Desert, id, ...stat, getUnitState(id, playerId, ...stat, createPosition))
  }
}
