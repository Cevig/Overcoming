import {Biom} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitTypes} from "./Unit";

export class UGeysers {
  static getHimera = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 5, 3]
      if (level === 2)
        return [3, 6, 3]
      if (level === 3)
        return [3, 6, 4]
    }

    return getCreature("Himera", UnitTypes.Prispeshnick, Biom.Geysers, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }
  static getAly = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 3, 4]
      if (level === 2)
        return [2, 4, 5]
      if (level === 3)
        return [3, 4, 5]
    }

    return getCreature("Aly", UnitTypes.Ispolin, Biom.Geysers, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }

  static getRarog = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 4]
      if (level === 2)
        return [3, 5, 4]
      if (level === 3)
        return [3, 5, 5]
    }

    return getCreature("Rarog", UnitTypes.Vestnick, Biom.Geysers, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }

  static getCherufe = (id, playerId, _, createPosition) => {
    const stat = [2, 5, 5]
    return getIdol("Cherufe", Biom.Geysers, id, ...stat, getUnitState(id, playerId, createPosition))
  }

  static getJarPtiza = (id, playerId, _, createPosition) => {
    const stat = [2, 8, 5]
    return getIdol("Jar-ptiza", Biom.Geysers, id, ...stat, getUnitState(id, playerId, createPosition))
  }
}
