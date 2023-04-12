import {Biom, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState} from "./Unit";

export class UForest {
  static getLesavka = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 5, 3]
      if (level === 2)
        return [2, 6, 4]
      if (level === 3)
        return [3, 7, 4]
    }

    return getCreature("Лісавка", UnitTypes.Prispeshnick, Biom.Forest, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }
  static getBereginya = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [1, 3, 5]
      if (level === 2)
        return [1, 4, 6]
      if (level === 3)
        return [3, 4, 6]
    }

    return getCreature("Берегиня", UnitTypes.Ispolin, Biom.Forest, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }

  static getSirin = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 5, 5]
      if (level === 2)
        return [3, 5, 5]
      if (level === 3)
        return [3, 6, 5]
    }

    return getCreature("Сірін", UnitTypes.Vestnick, Biom.Forest, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }

  static getAbasu = (id, playerId, _, createPosition) => {
    const stat = [2, 8, 4]
    return getIdol("Абасу", Biom.Forest, id, ...stat, getUnitState(id, playerId, createPosition))
  }

  static getChygayster = (id, playerId, _, createPosition) => {
    const stat = [2, 9, 5]
    return getIdol("Чугайстер", Biom.Forest, id, ...stat, getUnitState(id, playerId, createPosition))
  }
}
