import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UJungle {

  static blemmiiName = "Блемміі"
  static petsyhosName = "Петсухос"
  static kaieryName = "Кайєрі"
  static elokoName = "Елоко"
  static adjatarName = "Аджатар"
  static getBlemmii = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 6, 3]
      if (level === 2) return [2, 6, 4]
      if (level === 3) return [3, 7, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.statUpdates.defence.push({name: UnitSkills.Wholeness, unitId: id})
      if (level > 1) {
        abilities.statUpdates.defence.push({name: UnitSkills.RaidBlock, origin: true})
      }
    }

    return getCreature(UJungle.blemmiiName, UnitTypes.Prispeshnick, Biom.Jungle, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities)
  }
  static getPetsyhos = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [1, 4, 5]
      if (level === 2) return [2, 5, 6]
      if (level === 3) return [4, 5, 5]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.keywords.push(UnitKeywords.Sneaky)
    abilities.statUpdates.attack.push(UnitSkills.AddUnfocusedEffect)
    return getCreature(UJungle.petsyhosName, UnitTypes.Ispolin, Biom.Jungle, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities)
  }

  static getKaiery = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [1, 4, 4]
      if (level === 2) return [2, 4, 5]
      if (level === 3) return [2, 5, 5]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.actions.push({name: UnitSkills.Raid, qty: 99});
    abilities.statUpdates.defence.push({name: UnitSkills.BlockDamage, point: null})

    return getCreature(UJungle.kaieryName, UnitTypes.Vestnick, Biom.Jungle, id, ...stat(), level, getUnitState(id, playerId, ...stat(), createPosition), abilities)
  }

  static getEloko = (id, playerId, _, createPosition) => {
    const stat = [2, 7, 4]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.allTimeActions.push({name: UnitSkills.SetElokoCurse, qty: 1})
    return getIdol(UJungle.elokoName, Biom.Jungle, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }

  static getAdjatar = (id, playerId, _, createPosition) => {
    const stat = [2, 9, 6]

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    abilities.keywords.push(UnitKeywords.MainTarget)
    abilities.statUpdates.defence.push({name: UnitSkills.ReturnDamage})
    return getIdol(UJungle.adjatarName, Biom.Jungle, id, ...stat, getUnitState(id, playerId, ...stat, createPosition), abilities)
  }
}
