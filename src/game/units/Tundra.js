import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UTundra {

  static ledyanoyJackName = "Ледяний Джек"
  static bonakonName = "Бонакон"
  static planetnickName = "Планетник"
  static medvedOborotenName = "Ведмідь-перевертень"
  static marenaName = "Марена"
  static getLedyanoyJack = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 4, 3]
      if (level === 2) return [3, 5, 3]
      if (level === 3) return [3, 7, 3]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.statUpdates.defence.push({name: UnitSkills.BlockDamage, point: null})

    return getCreature(UTundra.ledyanoyJackName, UnitTypes.Prispeshnick, Biom.Tundra, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }
  static getBonakon = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 3, 5]
      if (level === 2) return [2, 4, 5]
      if (level === 3) return [3, 4, 5]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Sneaky)
      abilities.keywords.push(UnitKeywords.Unfocused)
      abilities.statUpdates.defence.push({name: UnitSkills.InjuredDamage})
      if (level > 1) {
        abilities.keywords.push(UnitKeywords.Support)
      }
    }

    return getCreature(UTundra.bonakonName, UnitTypes.Prominkor, Biom.Tundra, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }

  static getPlanetnick = (id, playerId, level, createPosition, price) => {
    const stat = () => {
      if (level === 1) return [2, 4, 4]
      if (level === 2) return [2, 5, 4]
      if (level === 3) return [3, 5, 5]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.actions.push({name: UnitSkills.Raid, qty: 99})
      abilities.keywords.push(UnitKeywords.Unfocused)
      abilities.statUpdates.attack.push(UnitSkills.DecreaseInitiative)
      if (level > 1) {
        abilities.keywords.push(UnitKeywords.ExtendedMove)
        if (level > 2) {
          abilities.statUpdates.defence.push({name: UnitSkills.Wholeness, unitId: id})
        }
      }
    }

    return getCreature(UTundra.planetnickName, UnitTypes.Vestnick, Biom.Tundra, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities, price)
  }

  static getMedvedOboroten = (id, playerId, _, createPosition, __) => {
    const stat = [2, 8, 3]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.statUpdates.defence.push({name: UnitSkills.ReduceDamage, unitId: id})
    abilities.allTimeActions.push({name: UnitSkills.ChargeAttack, qty: 1})
    return getIdol(UTundra.medvedOborotenName, Biom.Tundra, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }

  static getMarena = (id, playerId, _, createPosition, __) => {
    const stat = [1, 10, 1]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.statUpdates.attack.push(UnitSkills.chainDamage, UnitSkills.AddFreezeEffect, UnitSkills.AddUnfocusedEffect, UnitSkills.HealOnAttack)
    abilities.statUpdates.defence.push({name: UnitSkills.RaidBlock, origin: true})

    return getIdol(UTundra.marenaName, Biom.Tundra, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }
}
