import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UWater {

  static lerneyskiyRakName = "lerneyskiy"
  static bykavazName = "bykavaz"
  static aidaharName = "aidahar"
  static balorName = "balor"
  static vodyanoiName = "vodyanoi"
  static getLerneyskiyRak = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [1, 2, 1]
      if (level === 2) return [1, 2, 1]
      if (level === 3) return [1, 2, 1]
    }
    const abilities = JSON.parse(JSON.stringify(UnitAbilities));

    if (level > 0) {
      abilities.keywords.push(UnitKeywords.LowCost)
      if (level > 1) {
        abilities.onMove.push({name: UnitSkills.Surround3})
        if (level > 2) {
          abilities.statUpdates.attack.push(UnitSkills.InstantKill)
        }
      }
    }

    return getCreature(UWater.lerneyskiyRakName, UnitTypes.Prispeshnick, Biom.Water, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }
  static getBykavaz = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 3, 4]
      if (level === 2) return [2, 3, 4]
      if (level === 3) return [3, 4, 5]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Sneaky)
      abilities.keywords.push(UnitKeywords.Support)
      if (level > 1) {
        abilities.statUpdates.attack.push(UnitSkills.AddStunEffect)
      }
    }

    return getCreature(UWater.bykavazName, UnitTypes.Prominkor, Biom.Water, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }

  static getAidahar = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 4, 3]
      if (level === 2) return [3, 4, 3]
      if (level === 3) return [3, 4, 3]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.actions.push({name: UnitSkills.Raid, qty: 99});
      abilities.keywords.push(UnitKeywords.Unfocused)
      abilities.allTimeActions.push({name: UnitSkills.HealAlly, qty: 1})
      if (level > 2) {
        abilities.keywords.push(UnitKeywords.Support)
      }
    }

    return getCreature(UWater.aidaharName, UnitTypes.Vestnick, Biom.Water, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }

  static getBalor = (id, playerId, _, createPosition, __) => {
    const stat = [3, 8, 1]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.keywords.push(UnitKeywords.AbsoluteMove)
    abilities.statUpdates.attack.push(UnitSkills.InstantKillOnCounter)
    abilities.statUpdates.defence.push({name: UnitSkills.DoubleDamageInDefence})
    return getIdol(UWater.balorName, Biom.Water, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }

  static getVodyanoi = (id, playerId, _, createPosition, __) => {
    const stat = [2, 7, 5]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.onMove.push({name: UnitSkills.LowHealsAura})
    abilities.afterHitActions.push({name: UnitSkills.ThrowOver, qty: 99})
    return getIdol(UWater.vodyanoiName, Biom.Water, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }
}
