import {Biom} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitTypes} from "./Unit";

export class UJungle {
  static getBlemmii = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 6, 3]
      if (level === 2)
        return [2, 6, 4]
      if (level === 3)
        return [3, 7, 4]
    }

    return getCreature("Blemmii", UnitTypes.Prispeshnick, Biom.Jungle, id, ...stat(), level, getUnitState(id, playerId))
  }
  static getPetsyhos = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [1, 4, 5]
      if (level === 2)
        return [2, 5, 6]
      if (level === 3)
        return [4, 5, 5]
    }

    return getCreature("Petsyhos", UnitTypes.Ispolin, Biom.Jungle, id, ...stat(), level, getUnitState(id, playerId))
  }

  static getKaiery = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [1, 4, 4]
      if (level === 2)
        return [2, 4, 5]
      if (level === 3)
        return [2, 5, 5]
    }

    return getCreature("Kaiery", UnitTypes.Vestnick, Biom.Jungle, id, ...stat(), level, getUnitState(id, playerId))
  }

  static getEpoko = (id, playerId) => {
    const stat = [2, 7, 4]
    return getIdol("Epoko", Biom.Jungle, id, ...stat, getUnitState(id, playerId))
  }

  static getAdjatar = (id, playerId) => {
    const stat = [2, 9, 6]
    return getIdol("Adjatar", Biom.Jungle, id, ...stat, getUnitState(id, playerId))
  }
}
