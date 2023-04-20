import {Biom, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState} from "./Unit";

export class UJungle {

  static blemmiiName = "Блемміі"
  static petsyhosName = "Петсухос"
  static kaieryName = "Кайєрі"
  static elokoName = "Елоко"
  static adjatarName = "Аджатар"
  static getBlemmii = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 6, 3]
      if (level === 2)
        return [2, 6, 4]
      if (level === 3)
        return [3, 7, 4]
    }

    return getCreature(UJungle.blemmiiName, UnitTypes.Prispeshnick, Biom.Jungle, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
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

    return getCreature(UJungle.petsyhosName, UnitTypes.Ispolin, Biom.Jungle, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
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

    return getCreature(UJungle.kaieryName, UnitTypes.Vestnick, Biom.Jungle, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
  }

  static getEloko = (id, playerId, _, createPosition) => {
    const stat = [2, 7, 4]
    return getIdol(UJungle.elokoName, Biom.Jungle, id, ...stat, getUnitState(id, playerId, ...stat, createPosition))
  }

  static getAdjatar = (id, playerId, _, createPosition) => {
    const stat = [2, 9, 6]
    return getIdol(UJungle.adjatarName, Biom.Jungle, id, ...stat, getUnitState(id, playerId, ...stat, createPosition))
  }
}
