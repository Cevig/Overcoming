import {Biom} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitTypes} from "./Unit";

export class UMountains {
  static getBeytir = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 5, 3]
      if (level === 2)
        return [2, 6, 4]
      if (level === 3)
        return [3, 7, 4]
    }

    return getCreature("Beytir", UnitTypes.Prispeshnick, Biom.Mountains, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }
  static getGarzyk = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 3, 5]
      if (level === 2)
        return [2, 4, 6]
      if (level === 3)
        return [4, 4, 6]
    }

    return getCreature("Garzyk", UnitTypes.Ispolin, Biom.Mountains, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }

  static getVeshizaSoroka = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 3]
      if (level === 2)
        return [3, 5, 3]
      if (level === 3)
        return [3, 5, 5]
    }

    return getCreature("Veshiza-soroka", UnitTypes.Vestnick, Biom.Mountains, id, ...stat(), level, getUnitState(id, playerId, createPosition))
  }

  static getPsoglav = (id, playerId, _, createPosition) => {
    const stat = [4, 6, 4]
    return getIdol("Psoglav", Biom.Mountains, id, ...stat, getUnitState(id, playerId, createPosition))
  }

  static getHala = (id, playerId, _, createPosition) => {
    const stat = [3, 7, 5]
    return getIdol("Hala", Biom.Mountains, id, ...stat, getUnitState(id, playerId, createPosition))
  }
}
