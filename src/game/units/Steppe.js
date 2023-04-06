import {Biom} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitTypes} from "./Unit";

export class USteppe {
  static getPolydnica = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 5, 4]
      if (level === 2)
        return [2, 6, 4]
      if (level === 3)
        return [3, 6, 4]
    }

    return getCreature("Polydnica", UnitTypes.Prispeshnick, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId))
  }
  static getMara = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 3, 5]
      if (level === 2)
        return [2, 4, 6]
      if (level === 3)
        return [4, 4, 5]
    }

    return getCreature("Mara", UnitTypes.Ispolin, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId))
  }

  static getLetavica = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 4]
      if (level === 2)
        return [2, 5, 4]
      if (level === 3)
        return [3, 5, 5]
    }

    return getCreature("Letavica", UnitTypes.Vestnick, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId))
  }

  static getUrka = (id, playerId) => {
    const stat = [3, 7, 4]
    return getIdol("Urka", Biom.Steppe, id, ...stat, getUnitState(id, playerId))
  }

  static getViy = (id, playerId) => {
    const stat = [2, 10, 2]
    return getIdol("Viy", Biom.Steppe, id, ...stat, getUnitState(id, playerId))
  }
}
