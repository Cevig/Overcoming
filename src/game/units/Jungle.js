import {Biom, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState} from "./Unit";

export class UJungle {
  static getBlemmii = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 6, 3]
      if (level === 2)
        return [2, 6, 4]
      if (level === 3)
        return [3, 7, 4]
    }

    return getCreature("Блемміі", UnitTypes.Prispeshnick, Biom.Jungle, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }
  static getPetsyhos = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [1, 4, 5]
      if (level === 2)
        return [2, 5, 6]
      if (level === 3)
        return [4, 5, 5]
    }

    return getCreature("Петсухос", UnitTypes.Ispolin, Biom.Jungle, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }

  static getKaiery = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [1, 4, 4]
      if (level === 2)
        return [2, 4, 5]
      if (level === 3)
        return [2, 5, 5]
    }

    return getCreature("Кайєрі", UnitTypes.Vestnick, Biom.Jungle, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }

  static getEpoko = (id, playerId, _, createPosition) => {
    const stat = [2, 7, 4]
    return getIdol("Епоко", Biom.Jungle, id, ...stat, getUnitState(id, playerId, createPosition))
  }

  static getAdjatar = (id, playerId, _, createPosition) => {
    const stat = [2, 9, 6]
    return getIdol("Аджатар", Biom.Jungle, id, ...stat, getUnitState(id, playerId, createPosition))
  }
}
