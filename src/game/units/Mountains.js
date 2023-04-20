import {Biom, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState} from "./Unit";

export class UMountains {

  static beytirName = "Бейтір"
  static garzykName = "Гарцук"
  static veshizaSorokaName = "Вещіця-сорока"
  static psoglavName = "Псоглав"
  static halaName = "Хала"
  static getBeytir = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1)
        return [2, 5, 3]
      if (level === 2)
        return [2, 6, 4]
      if (level === 3)
        return [3, 7, 4]
    }

    return getCreature(UMountains.beytirName, UnitTypes.Prispeshnick, Biom.Mountains, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
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

    return getCreature(UMountains.garzykName, UnitTypes.Ispolin, Biom.Mountains, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
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

    return getCreature(UMountains.veshizaSorokaName, UnitTypes.Vestnick, Biom.Mountains, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
  }

  static getPsoglav = (id, playerId, _, createPosition) => {
    const stat = [4, 6, 4]
    return getIdol(UMountains.psoglavName, Biom.Mountains, id, ...stat, getUnitState(id, playerId, ...stat, createPosition))
  }

  static getHala = (id, playerId, _, createPosition) => {
    const stat = [3, 7, 5]
    return getIdol(UMountains.halaName, Biom.Mountains, id, ...stat, getUnitState(id, playerId, ...stat, createPosition))
  }
}
