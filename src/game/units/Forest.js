import {Biom} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitTypes} from "./Unit";

export class UForest {
  static getLesavka = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 5, 3]
      if (level === 2)
        return [2, 6, 4]
      if (level === 3)
        return [3, 7, 4]
    }

    return getCreature("Lesavka", UnitTypes.Prispeshnick, Biom.Forest, id, ...stat(), level, getUnitState(id, playerId))
  }
  static getBereginya = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [1, 3, 5]
      if (level === 2)
        return [1, 4, 6]
      if (level === 3)
        return [3, 4, 6]
    }

    return getCreature("Bereginya", UnitTypes.Ispolin, Biom.Forest, id, ...stat(), level, getUnitState(id, playerId))
  }

  static getSirin = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 5, 5]
      if (level === 2)
        return [3, 5, 5]
      if (level === 3)
        return [3, 6, 5]
    }

    return getCreature("Sirin", UnitTypes.Vestnick, Biom.Forest, id, ...stat(), level, getUnitState(id, playerId))
  }

  static getAbasu = (id, playerId) => {
    const stat = [2, 8, 4]
    return getIdol("Abasu", Biom.Forest, id, ...stat, getUnitState(id, playerId))
  }

  static getChygayster = (id, playerId) => {
    const stat = [2, 9, 5]
    return getIdol("Chygayster", Biom.Forest, id, ...stat, getUnitState(id, playerId))
  }
}
