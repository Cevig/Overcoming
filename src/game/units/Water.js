import {Biom, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState} from "./Unit";

export class UWater {

  static lerneyskiyRakName = "Лернійський Рак"
  static bykavazName = "Букавац"
  static aidaharName = "Айдахар"
  static balorName = "Балор"
  static vodyanoiName = "Водяний"
  static getLerneyskiyRak = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 2, 4]
      if (level === 2)
        return [2, 4, 4]
      if (level === 3)
        return [3, 5, 4]
    }

    return getCreature(UWater.lerneyskiyRakName, UnitTypes.Prispeshnick, Biom.Water, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
  }
  static getBykavaz = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 3, 4]
      if (level === 2)
        return [2, 4, 5]
      if (level === 3)
        return [3, 4, 5]
    }

    return getCreature(UWater.bykavazName, UnitTypes.Ispolin, Biom.Water, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
  }

  static getAidahar = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 3]
      if (level === 2)
        return [3, 5, 4]
      if (level === 3)
        return [3, 5, 5]
    }

    return getCreature(UWater.aidaharName, UnitTypes.Vestnick, Biom.Water, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
  }

  static getBalor = (id, playerId, _, createPosition) => {
    const stat = [3, 7, 1]
    return getIdol(UWater.balorName, Biom.Water, id, ...stat, getUnitState(id, playerId, ...stat, createPosition))
  }

  static getVodyanoi = (id, playerId, _, createPosition) => {
    const stat = [2, 7, 5]
    return getIdol(UWater.vodyanoiName, Biom.Water, id, ...stat, getUnitState(id, playerId, ...stat, createPosition))
  }
}
