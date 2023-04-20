import {Biom, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState} from "./Unit";

export class UTundra {

  static ledyanoyJackName = "Ледяний Джек"
  static bonakonName = "Бонакон"
  static planetnickName = "Планетник"
  static medvedOborotenName = "Ведмідь-перевертень"
  static marenaName = "Марена"
  static getLedyanoyJack = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 3]
      if (level === 2)
        return [3, 5, 3]
      if (level === 3)
        return [3, 7, 3]
    }

    return getCreature(UTundra.ledyanoyJackName, UnitTypes.Prispeshnick, Biom.Tundra, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
  }
  static getBonakon = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 3, 5]
      if (level === 2)
        return [2, 4, 5]
      if (level === 3)
        return [3, 4, 5]
    }

    return getCreature(UTundra.bonakonName, UnitTypes.Ispolin, Biom.Tundra, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
  }

  static getPlanetnick = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 4]
      if (level === 2)
        return [2, 5, 4]
      if (level === 3)
        return [3, 5, 5]
    }

    return getCreature(UTundra.planetnickName, UnitTypes.Vestnick, Biom.Tundra, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
  }

  static getMedvedOboroten = (id, playerId, _, createPosition) => {
    const stat = [2, 8, 3]
    return getIdol(UTundra.medvedOborotenName, Biom.Tundra, id, ...stat, getUnitState(id, playerId, ...stat, createPosition))
  }

  static getMarena = (id, playerId, _, createPosition) => {
    const stat = [1, 10, 1]
    return getIdol(UTundra.marenaName, Biom.Tundra, id, ...stat, getUnitState(id, playerId, ...stat, createPosition))
  }
}
