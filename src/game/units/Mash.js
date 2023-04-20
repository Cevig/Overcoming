import {Biom, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState} from "./Unit";

export class UMash {

  static mohovikName = "Моховік"
  static drekavazName = "Дрекавац"
  static mavkaName = "Мавка"
  static begemotName = "Бегемот"
  static fekstName = "Фекст"
  static getMohovik = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 4]
      if (level === 2)
        return [2, 5, 4]
      if (level === 3)
        return [2, 5, 4]
    }

    return getCreature(UMash.mohovikName, UnitTypes.Prispeshnick, Biom.Mash, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
  }
  static getDrekavaz = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 3, 5]
      if (level === 2)
        return [2, 4, 6]
      if (level === 3)
        return [4, 4, 6]
    }

    return getCreature(UMash.drekavazName, UnitTypes.Ispolin, Biom.Mash, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
  }

  static getMavka = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 3]
      if (level === 2)
        return [2, 5, 3]
      if (level === 3)
        return [3, 5, 4]
    }

    return getCreature(UMash.mavkaName, UnitTypes.Vestnick, Biom.Mash, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
  }

  static getBegemot = (id, playerId, _, createPosition) => {
    const stat = [3, 8, 4]
    return getIdol(UMash.begemotName, Biom.Mash, id, ...stat, getUnitState(id, playerId, ...stat, createPosition))
  }

  static getFekst = (id, playerId, _, createPosition) => {
    const stat = [2, 7, 4]
    return getIdol(UMash.fekstName, Biom.Mash, id, ...stat, getUnitState(id, playerId, ...stat, createPosition))
  }
}
