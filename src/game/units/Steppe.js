import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

// import "scope-extensions-js"

export class USteppe {

  static polydnicaName = "Полудниця"
  static maraName = "Мара"
  static letavicaName = "Летавиця"
  static urkaName = "Ирка"
  static viyName = "Вій"
  static getPolydnica = (id, playerId, level, createPosition) => {
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

    return getCreature(USteppe.polydnicaName, UnitTypes.Prispeshnick, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities)
  }
  static getMara = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 3, 5]
      if (level === 2) return [2, 4, 6]
      if (level === 3) return [4, 4, 5]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Sneaky)
      abilities.onMove.push({name: UnitSkills.MaraAura})
    }

    return getCreature(USteppe.maraName, UnitTypes.Ispolin, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities)
  }

  static getLetavica = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 3, 4]
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

    return getCreature(USteppe.letavicaName, UnitTypes.Vestnick, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities)
  }

  static getUrka = (id, playerId, _, createPosition) => {
    const stat = [3, 7, 4]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.statUpdates.attack.push(UnitSkills.AddFreezeEffect)
    abilities.keywords.push(UnitKeywords.MainTarget)
    abilities.actions.push({name: UnitSkills.Urka, qty: 2})

    return getIdol(USteppe.urkaName, Biom.Steppe, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }

  static getViy = (id, playerId, _, createPosition) => {
    const stat = [2, 10, 2]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.statUpdates.attack.push(UnitSkills.InstantKill)
    return getIdol(USteppe.viyName, Biom.Steppe, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }
}
