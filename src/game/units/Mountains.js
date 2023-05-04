import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UMountains {

  static beytirName = "Бейтір"
  static garzykName = "Гарцук"
  static veshizaSorokaName = "Вещіця-сорока"
  static psoglavName = "Псоглав"
  static halaName = "Хала"
  static getBeytir = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 5, 3]
      if (level === 2) return [2, 6, 4]
      if (level === 3) return [3, 7, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.statUpdates.attack.push(UnitSkills.chainDamage)

    return getCreature(UMountains.beytirName, UnitTypes.Prispeshnick, Biom.Mountains, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }
  static getGarzyk = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 3, 5]
      if (level === 2) return [2, 4, 6]
      if (level === 3) return [3, 4, 6]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Sneaky)
      abilities.statUpdates.defence.push({name: UnitSkills.Wholeness, unitId: id})
      if (level > 1) {
        abilities.allTimeActions.push({name: UnitSkills.throwWeapon, qty: 1})
      }
    }

    return getCreature(UMountains.garzykName, UnitTypes.Prominkor, Biom.Mountains, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }

  static getVeshizaSoroka = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 4, 3]
      if (level === 2) return [3, 5, 3]
      if (level === 3) return [3, 5, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Unfocused)
      abilities.keywords.push(UnitKeywords.NoObstaclesRaid)
      abilities.actions.push({name: UnitSkills.Raid, qty: 99})
      if (level > 2) {
        abilities.allTimeActions.push({name: UnitSkills.replaceUnits, qty: 1})
      }
    }

    return getCreature(UMountains.veshizaSorokaName, UnitTypes.Vestnick, Biom.Mountains, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }

  static getPsoglav = (id, playerId, _, createPosition, __) => {
    const stat = [3, 6, 4]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.allTimeActions.push({name: UnitSkills.pauseToRecover, qty: 2})
    return getIdol(UMountains.psoglavName, Biom.Mountains, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }

  static getHala = (id, playerId, _, createPosition, __) => {
    const stat = [2, 8, 5]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.onMove.push({name: UnitSkills.HalaAura})
    abilities.statUpdates.defence.push({name: UnitSkills.RaidBlock, origin: true})
    return getIdol(UMountains.halaName, Biom.Mountains, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }
}
