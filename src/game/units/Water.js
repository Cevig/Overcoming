import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UWater {

  static lerneyskiyRakName = "Лернійський Рак"
  static bykavazName = "Букавац"
  static aidaharName = "Айдахар"
  static balorName = "Балор"
  static vodyanoiName = "Водяний"
  static getLerneyskiyRak = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 2, 4]
      if (level === 2) return [2, 4, 4]
      if (level === 3) return [3, 5, 4]
    }
    //TODO: add low cost ability

    return getCreature(UWater.lerneyskiyRakName, UnitTypes.Prispeshnick, Biom.Water, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition))
  }
  static getBykavaz = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 3, 4]
      if (level === 2) return [2, 4, 5]
      if (level === 3) return [3, 4, 5]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Sneaky)
      abilities.keywords.push(UnitKeywords.Support)
      if (level > 2) {
        abilities.statUpdates.attack.push(UnitSkills.AddStunEffect)
      }
    }

    return getCreature(UWater.bykavazName, UnitTypes.Ispolin, Biom.Water, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities)
  }

  static getAidahar = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 4, 3]
      if (level === 2) return [3, 5, 4]
      if (level === 3) return [3, 5, 5]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.actions.push({name: UnitSkills.Raid, qty: 99});
      abilities.keywords.push(UnitKeywords.Unfocused)
      abilities.allTimeActions.push({name: UnitSkills.healAlly, qty: 1})
      if (level > 2) {
        abilities.statUpdates.defence.push({name: UnitSkills.Wholeness, unitId: id})
      }
    }

    return getCreature(UWater.aidaharName, UnitTypes.Vestnick, Biom.Water, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities)
  }

  static getBalor = (id, playerId, _, createPosition) => {
    const stat = [3, 7, 1]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.statUpdates.attack.push(UnitSkills.InstantKillOnCounter)
    abilities.statUpdates.defence.push({name: UnitSkills.DoubleDamageInDefence})
    return getIdol(UWater.balorName, Biom.Water, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }

  static getVodyanoi = (id, playerId, _, createPosition) => {
    const stat = [2, 7, 5]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.onMove.push({name: UnitSkills.LowHealsAura})
    abilities.afterHitActions.push({name: UnitSkills.ThrowOver, qty: 99})
    return getIdol(UWater.vodyanoiName, Biom.Water, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }
}
