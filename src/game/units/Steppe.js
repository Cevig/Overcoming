import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

// import "scope-extensions-js"

export class USteppe {

  static polydnicaName = "polydnica"
  static maraName = "mara"
  static letavicaName = "letavica"
  static urkaName = "urka"
  static viyName = "viy"
  static getPolydnica = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 5, 4]
      if (level === 2) return [2, 6, 4]
      if (level === 3) return [3, 6, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.onMove.push({name: UnitSkills.Surround3})
      if (level > 1) {
        abilities.statUpdates.defence.push({name: UnitSkills.Wholeness, unitId: id})
        if (level > 2) {
          abilities.statUpdates.attack.push(UnitSkills.AddFreezeEffect)
        }
      }
    }

    return getCreature(USteppe.polydnicaName, UnitTypes.Prispeshnick, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }
  static getMara = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 3, 4]
      if (level === 2) return [2, 4, 4]
      if (level === 3) return [4, 4, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Sneaky)
      abilities.onMove.push({name: UnitSkills.MaraAura})
    }

    return getCreature(USteppe.maraName, UnitTypes.Prominkor, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }

  static getLetavica = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 3, 3]
      if (level === 2) return [2, 4, 4]
      if (level === 3) return [3, 4, 5]
    }
    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Unfocused)
      abilities.actions.push({name: UnitSkills.Raid, qty: 99})
      abilities.keywords.push(UnitKeywords.ReplaceHealsRaid)
      if (level > 1) {
        abilities.onDeath.push({name: UnitSkills.LethalGrab})
      }
    }

    return getCreature(USteppe.letavicaName, UnitTypes.Vestnick, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }

  static getUrka = (id, playerId, _, createPosition, __) => {
    const stat = [3, 7, 4]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.statUpdates.attack.push(UnitSkills.AddFreezeEffect)
    abilities.actions.push({name: UnitSkills.Urka, qty: 2})

    return getIdol(USteppe.urkaName, Biom.Steppe, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }

  static getViy = (id, playerId, _, createPosition, __) => {
    const stat = [2, 10, 2]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.statUpdates.attack.push(UnitSkills.InstantKill)
    return getIdol(USteppe.viyName, Biom.Steppe, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }
}
