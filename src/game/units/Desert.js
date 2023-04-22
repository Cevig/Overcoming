import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UDesert {

  static amfisbenaName = "Амфінсбена"
  static obajifoName = "Обаїфо"
  static adzeName = "Адзе"
  static sfinksName = "Сфінкс"
  static vasiliskName = "Василіск"
  static getAmfisbena = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 6, 3]
      if (level === 2) return [2, 6, 4]
      if (level === 3) return [3, 7, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.AlwaysCounterDamage)
      if (level > 1) {
        abilities.keywords.push(UnitKeywords.FullDeathDamage)
        if (level > 2) {
          abilities.statUpdates.defence.push({name: UnitSkills.AntiVestnick})
        }
      }
    }

    return getCreature(UDesert.amfisbenaName, UnitTypes.Prispeshnick, Biom.Desert, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities)
  }
  static getObajifo = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 3, 5]
      if (level === 2) return [2, 4, 6]
      if (level === 3) return [3, 4, 6]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Sneaky)
      abilities.onMove.push({name: UnitSkills.ObajifoAura})
      if (level > 1) {
        abilities.statUpdates.attack.push(UnitSkills.HealOnAttack)
        if (level > 2) {
          abilities.keywords.push(UnitKeywords.Support)
        }
      }
    }

    return getCreature(UDesert.obajifoName, UnitTypes.Ispolin, Biom.Desert, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities)
  }

  static getAdze = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 4, 4]
      if (level === 2) return [2, 5, 4]
      if (level === 3) return [3, 6, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Unfocused)
      abilities.keywords.push(UnitKeywords.ReplaceHealsRaid)
      abilities.actions.push({name: UnitSkills.Raid, qty: 99})
      abilities.statUpdates.defence.push({name: UnitSkills.DeadlyDamage})
      if (level > 1) {
        abilities.keywords.push(UnitKeywords.AdditionalSacrificeRaid)
      }
    }

    return getCreature(UDesert.adzeName, UnitTypes.Vestnick, Biom.Desert, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities)
  }

  static getSfinks = (id, playerId, _, createPosition) => {
    const stat = [2, 11, 4]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.keywords.push(UnitKeywords.Sneaky)
    abilities.statUpdates.defence.push({name: UnitSkills.DoubleDamage})
    return getIdol(UDesert.sfinksName, Biom.Desert, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }

  static getVasilisk = (id, playerId, _, createPosition) => {
    const stat = [2, 8, 4]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.statUpdates.attack.push(UnitSkills.RoundDamage, UnitSkills.AddPoisonEffect)
    return getIdol(UDesert.vasiliskName, Biom.Desert, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }
}
