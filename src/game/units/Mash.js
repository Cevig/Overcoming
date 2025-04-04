import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UMash {

  static mohovikName = "mohovik"
  static drekavazName = "drekavaz"
  static mavkaName = "mavka"
  static begemotName = "begemot"
  static fekstName = "fekst"
  static getMohovik = (id, playerId, level, createPosition, price) => {
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

    return getCreature(UMash.mohovikName, UnitTypes.Prispeshnick, Biom.Mash, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }
  static getDrekavaz = (id, playerId, level, createPosition, price) => {
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

    return getCreature(UMash.drekavazName, UnitTypes.Prominkor, Biom.Mash, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }

  static getMavka = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [1, 3, 3]
      if (level === 2) return [1, 4, 3]
      if (level === 3) return [2, 4, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Unfocused)
      abilities.actions.push({name: UnitSkills.Raid, qty: 99})
      abilities.statUpdates.attack.push(UnitSkills.AddVengeanceEffect)
      if (level > 1) {
        abilities.statUpdates.attack.push(UnitSkills.AddPoisonEffectOnRaid)
        if (level > 2) {
          abilities.allTimeActions.push({name: UnitSkills.ReplaceUnits, qty: 1})
        }
      }
    }

    return getCreature(UMash.mavkaName, UnitTypes.Vestnick, Biom.Mash, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }

  static getBegemot = (id, playerId, _, createPosition, __) => {
    const stat = [2, 8, 2]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.keywords.push(UnitKeywords.AlwaysCounterDamage)
    abilities.keywords.push(UnitKeywords.MainTarget)
    return getIdol(UMash.begemotName, Biom.Mash, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }

  static getFekst = (id, playerId, _, createPosition, __) => {
    const stat = [2, 7, 4]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.allTimeActions.push({name: UnitSkills.NotMovedRecover, qty: 99})
    abilities.statUpdates.defence.push({name: UnitSkills.BlockStatuses, unitId: id})
    abilities.statUpdates.attack.push(UnitSkills.HealOnAttack)
    abilities.onDeath.push({name: UnitSkills.LethalGrab})
    return getIdol(UMash.fekstName, Biom.Mash, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }
}
