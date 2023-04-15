import {Biom, UnitKeywords, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UForest {
  static getLesavka = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 5, 3]
      if (level === 2) return [2, 6, 4]
      if (level === 3) return [3, 7, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.afterHitActions.push({name: "lesavka", qty: 99})

    return getCreature("Лісавка", UnitTypes.Prispeshnick, Biom.Forest, id, ...stat(), level, getUnitState(id, playerId, createPosition), abilities)
  }
  static getBereginya = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [1, 3, 5]
      if (level === 2) return [1, 4, 6]
      if (level === 3) return [3, 4, 6]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Sneaky)
      if (level > 1) {
        abilities.allTimeActions.push({name: "healAlly", qty: 3})
        abilities.keywords.push(UnitKeywords.Support)
      } else {
        abilities.allTimeActions.push({name: "healAlly", qty: 2})
      }
    }

    return getCreature("Берегиня", UnitTypes.Ispolin, Biom.Forest, id, ...stat(), level, getUnitState(id, playerId, createPosition), abilities)
  }

  static getSirin = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 5, 5]
      if (level === 2) return [3, 5, 5]
      if (level === 3) return [3, 6, 5]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Unfocused)
      abilities.actions.push({name: "raid", qty: 99})
      if (level > 2) {
        abilities.onDeath.push({name: 'lethalGrab'})
        abilities.keywords.push(UnitKeywords.AbsoluteRaid)
      } else {
        abilities.keywords.push(UnitKeywords.RestrictedRaid)
      }
    }

    return getCreature("Сірін", UnitTypes.Vestnick, Biom.Forest, id, ...stat(), level, getUnitState(id, playerId, createPosition), abilities)
  }

  static getAbasu = (id, playerId, _, createPosition) => {
    const stat = [2, 8, 4]
    return getIdol("Абасу", Biom.Forest, id, ...stat, getUnitState(id, playerId, createPosition))
  }

  static getChygayster = (id, playerId, _, createPosition) => {
    const stat = [2, 9, 5]
    return getIdol("Чугайстер", Biom.Forest, id, ...stat, getUnitState(id, playerId, createPosition))
  }
}
