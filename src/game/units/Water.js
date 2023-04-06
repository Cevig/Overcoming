import {Biom} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitTypes} from "./Unit";

export class UWater {
  static getLerneyskiyRak = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 2, 4]
      if (level === 2)
        return [2, 4, 4]
      if (level === 3)
        return [3, 5, 4]
    }

    return getCreature("Lerneyskiy Rak", UnitTypes.Prispeshnick, Biom.Water, id, ...stat(), level, getUnitState(id, playerId))
  }
  static getBykavaz = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 3, 4]
      if (level === 2)
        return [2, 4, 5]
      if (level === 3)
        return [3, 4, 5]
    }

    return getCreature("Bykavaz", UnitTypes.Ispolin, Biom.Water, id, ...stat(), level, getUnitState(id, playerId))
  }

  static getAidahar = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 3]
      if (level === 2)
        return [3, 5, 4]
      if (level === 3)
        return [3, 5, 5]
    }

    return getCreature("Aidahar", UnitTypes.Vestnick, Biom.Water, id, ...stat(), level, getUnitState(id, playerId))
  }

  static getBalor = (id, playerId) => {
    const stat = [3, 7, 1]
    return getIdol("Balor", Biom.Water, id, ...stat, getUnitState(id, playerId))
  }

  static getVodyanoi = (id, playerId) => {
    const stat = [2, 7, 5]
    return getIdol("Vodyanoi", Biom.Water, id, ...stat, getUnitState(id, playerId))
  }
}
