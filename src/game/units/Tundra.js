import {Biom} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitTypes} from "./Unit";

export class UTundra {
  static getLedyanoyJack = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 3]
      if (level === 2)
        return [3, 5, 3]
      if (level === 3)
        return [3, 7, 3]
    }

    return getCreature("LedyanoyJack", UnitTypes.Prispeshnick, Biom.Tundra, id, ...stat(), level, getUnitState(id, playerId))
  }
  static getBonakon = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 3, 5]
      if (level === 2)
        return [2, 4, 5]
      if (level === 3)
        return [3, 4, 5]
    }

    return getCreature("Bonakon", UnitTypes.Ispolin, Biom.Tundra, id, ...stat(), level, getUnitState(id, playerId))
  }

  static getPlanetnick = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 4]
      if (level === 2)
        return [2, 5, 4]
      if (level === 3)
        return [3, 5, 5]
    }

    return getCreature("Planetnick", UnitTypes.Vestnick, Biom.Tundra, id, ...stat(), level, getUnitState(id, playerId))
  }

  static getMedvedOboroten = (id, playerId) => {
    const stat = [2, 8, 3]
    return getIdol("Medved-oboroten", Biom.Tundra, id, ...stat, getUnitState(id, playerId))
  }

  static getMarena = (id, playerId) => {
    const stat = [1, 10, 1]
    return getIdol("Marena", Biom.Tundra, id, ...stat, getUnitState(id, playerId))
  }
}
