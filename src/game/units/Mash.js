import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UMash {

  static mohovikName = "Моховік"
  static drekavazName = "Дрекавац"
  static mavkaName = "Мавка"
  static begemotName = "Бегемот"
  static fekstName = "Фекст"
  static getMohovik = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 4, 4]
      if (level === 2) return [2, 5, 4]
      if (level === 3) return [2, 5, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.AbsoluteMove)
      if (level > 1) {
        abilities.keywords.push(UnitKeywords.AlwaysCounterDamage)
        if (level > 2) {
          abilities.keywords.push(UnitKeywords.Sneaky)
        }
      }
    }

    return getCreature(UMash.mohovikName, UnitTypes.Prispeshnick, Biom.Mash, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities)
  }
  static getDrekavaz = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 3, 5]
      if (level === 2) return [2, 4, 6]
      if (level === 3) return [4, 4, 6]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Sneaky)
      abilities.onDeath.push({name: UnitSkills.LethalBlow})
      if (level > 1) {
        abilities.keywords.push(UnitKeywords.Support)
      }
    }

    return getCreature(UMash.drekavazName, UnitTypes.Ispolin, Biom.Mash, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities)
  }

  static getMavka = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 4, 3]
      if (level === 2) return [2, 5, 3]
      if (level === 3) return [3, 5, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Unfocused)
      abilities.actions.push({name: UnitSkills.Raid, qty: 99})
      abilities.statUpdates.attack.push(UnitSkills.AddPoisonEffect)
      if (level > 1) {
        abilities.statUpdates.attack.push(UnitSkills.AddPoisonEffectOnRaid)
      }
    }

    return getCreature(UMash.mavkaName, UnitTypes.Vestnick, Biom.Mash, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities)
  }

  static getBegemot = (id, playerId, _, createPosition) => {
    const stat = [3, 8, 4]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.keywords.push(UnitKeywords.AlwaysCounterDamage)
    abilities.keywords.push(UnitKeywords.MainTarget)
    return getIdol(UMash.begemotName, Biom.Mash, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }

  static getFekst = (id, playerId, _, createPosition) => {
    const stat = [2, 7, 4]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.allTimeActions.push({name: UnitSkills.NotMovedRecover, qty: 99})
    abilities.statUpdates.defence.push({name: UnitSkills.BlockStatuses, unitId: id})
    return getIdol(UMash.fekstName, Biom.Mash, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }
}
