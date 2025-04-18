import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UMountains {

  static beytirName = "beytir"
  static garzykName = "garzyk"
  static veshizaSorokaName = "veshizaSoroka"
  static psoglavName = "psoglav"
  static halaName = "hala"
  static getBeytir = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 5, 3]
      if (level === 2) return [2, 6, 4]
      if (level === 3) return [3, 7, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.statUpdates.attack.push(UnitSkills.ChainDamage)

    return getCreature(UMountains.beytirName, UnitTypes.Prispeshnick, Biom.Mountains, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }
  static getGarzyk = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 3, 4]
      if (level === 2) return [2, 4, 5]
      if (level === 3) return [3, 4, 5]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Sneaky)
      abilities.statUpdates.defence.push({name: UnitSkills.Wholeness, unitId: id})
      abilities.statUpdates.defence.push({name: UnitSkills.RaidBlock, origin: true})
      if (level > 1) {
        abilities.allTimeActions.push({name: UnitSkills.ThrowWeapon, qty: 1})
      }
    }

    return getCreature(UMountains.garzykName, UnitTypes.Prominkor, Biom.Mountains, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }

  static getVeshizaSoroka = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 4, 3]
      if (level === 2) return [2, 4, 3]
      if (level === 3) return [3, 5, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Unfocused)
      abilities.keywords.push(UnitKeywords.NoObstaclesRaid)
      abilities.actions.push({name: UnitSkills.Raid, qty: 99})
      if (level > 1) {
        abilities.allTimeActions.push({name: UnitSkills.ReplaceUnits, qty: 1})
      }
    }

    return getCreature(UMountains.veshizaSorokaName, UnitTypes.Vestnick, Biom.Mountains, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }

  static getPsoglav = (id, playerId, _, createPosition, __) => {
    const stat = [3, 6, 4]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.allTimeActions.push({name: UnitSkills.PauseToRecover, qty: 2})
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
