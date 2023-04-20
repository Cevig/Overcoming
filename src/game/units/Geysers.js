import {Biom, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState} from "./Unit";

export class UGeysers {

  static himeraName = "Хімера"
  static alyName = "Алі"
  static rarogName = "Рарог"
  static cherufeName = "Черуфе"
  static jarPtizaName = "Жар-птиця"
  static getHimera = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 5, 3]
      if (level === 2)
        return [3, 6, 3]
      if (level === 3)
        return [3, 6, 4]
    }

    return getCreature(UGeysers.himeraName, UnitTypes.Prispeshnick, Biom.Geysers, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
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

    return getCreature(UGeysers.alyName, UnitTypes.Ispolin, Biom.Geysers, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
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

    return getCreature(UGeysers.rarogName, UnitTypes.Vestnick, Biom.Geysers, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
  }

  static getCherufe = (id, playerId, _, createPosition) => {
    const stat = [2, 5, 5]
    return getIdol(UGeysers.cherufeName, Biom.Geysers, id, ...stat, getUnitState(id, playerId, ...stat, createPosition))
  }

  static getJarPtiza = (id, playerId, _, createPosition) => {
    const stat = [2, 8, 5]
    return getIdol(UGeysers.jarPtizaName, Biom.Geysers, id, ...stat, getUnitState(id, playerId, ...stat, createPosition))
  }
}
