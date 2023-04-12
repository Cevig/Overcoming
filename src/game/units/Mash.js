import {Biom, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState} from "./Unit";

export class UMash {
  static getMohovik = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 4]
      if (level === 2)
        return [2, 5, 4]
      if (level === 3)
        return [2, 5, 4]
    }

    return getCreature("Моховік", UnitTypes.Prispeshnick, Biom.Mash, id, ...stat(), level, getUnitState(id, playerId, createPosition))
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

    return getCreature("Дрекавац", UnitTypes.Ispolin, Biom.Mash, id, ...stat(), level, getUnitState(id, playerId, createPosition))
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

    return getCreature("Мавка", UnitTypes.Vestnick, Biom.Mash, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }

  static getBegemot = (id, playerId, _, createPosition) => {
    const stat = [3, 8, 4]
    return getIdol("Бегемот", Biom.Mash, id, ...stat, getUnitState(id, playerId, createPosition))
  }

  static getFekst = (id, playerId, _, createPosition) => {
    const stat = [2, 7, 4]
    return getIdol("Фекст", Biom.Mash, id, ...stat, getUnitState(id, playerId, createPosition))
  }
}
