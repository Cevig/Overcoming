import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UGeysers {

  static himeraName = "Хімера"
  static alyName = "Алі"
  static rarogName = "Рарог"
  static cherufeName = "Черуфе"
  static jarPtizaName = "Жар-птиця"
  static getHimera = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 5, 3]
      if (level === 2) return [2, 6, 3]
      if (level === 3) return [3, 6, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.statUpdates.attack.push(UnitSkills.ThroughDamage)
      if (level > 1) {
        abilities.statUpdates.defence.push({name: UnitSkills.InjuredDamage})
        if (level > 2) {
          abilities.statUpdates.attack.push(UnitSkills.RoundDamage)
          abilities.keywords.push(UnitKeywords.RestrictedRoundDamage)
        }
      }
    }

    return getCreature(UGeysers.himeraName, UnitTypes.Prispeshnick, Biom.Geysers, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }
  static getAly = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 3, 4]
      if (level === 2) return [2, 4, 5]
      if (level === 3) return [3, 4, 5]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.onMove.push({name: UnitSkills.UnfocusedAura})
      if (level > 1) {
        abilities.keywords.push(UnitKeywords.Support)
        if (level > 2) {
          abilities.keywords.push(UnitKeywords.FullDeathDamage)
        }
      }
    }

    return getCreature(UGeysers.alyName, UnitTypes.Prominkor, Biom.Geysers, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }

  static getRarog = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 4, 3]
      if (level === 2) return [3, 4, 3]
      if (level === 3) return [3, 4, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.actions.push({name: UnitSkills.Raid, qty: 99});
      abilities.keywords.push(UnitKeywords.Unfocused)
      abilities.statUpdates.attack.push(UnitSkills.AddPoisonEffect)
      if (level > 1) {
        abilities.statUpdates.defence.push({name: UnitSkills.Wholeness, unitId: id})
        if (level > 2) {
          abilities.statUpdates.attack.push(UnitSkills.AddPoisonEffectOnRaid)
        }
      }
    }

    return getCreature(UGeysers.rarogName, UnitTypes.Vestnick, Biom.Geysers, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }

  static getCherufe = (id, playerId, _, createPosition, __) => {
    const stat = [2, 5, 5]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.keywords.push(UnitKeywords.Unfocused)
    abilities.allTimeActions.push({name: UnitSkills.SetItOnFire, qty: 3})
    return getIdol(UGeysers.cherufeName, Biom.Geysers, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }

  static getJarPtiza = (id, playerId, _, createPosition, __) => {
    const stat = [2, 6, 5]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.keywords.push(UnitKeywords.AdditionalEssence)
    abilities.statUpdates.defence.push({name: UnitSkills.BlockStatuses, unitId: id})
    abilities.allTimeActions.push({name: UnitSkills.healAlly, qty: 3})
    abilities.statUpdates.attack.push(UnitSkills.ThroughDamage)
    return getIdol(UGeysers.jarPtizaName, Biom.Geysers, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }
}
