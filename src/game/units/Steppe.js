import {Biom, UnitKeywords} from "../helpers/Constants";
import {
  getCreature,
  getIdol,
  getUnitState,
  UnitAbilities,
  UnitTypes
} from "./Unit";

// import "scope-extensions-js"

export class USteppe {

  static polydnicaName = "Polydnica"
  static maraName = "Mara"
  static getPolydnica = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 5, 4]
      if (level === 2) return [2, 6, 4]
      if (level === 3) return [3, 6, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.onMove.push({name: 'surround3'})
      if (level > 1) {
        abilities.statUpdates.defence.push({name: 'wholeness', unitId: id})
        if (level > 2) {
          abilities.statUpdates.attack.push({name: 'addFreezeEffect', unitId: id})
        }
      }
    }

    return getCreature(USteppe.polydnicaName, UnitTypes.Prispeshnick, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId, createPosition), abilities)
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
      abilities.onMove.push({name: 'maraAura'})
    }

    return getCreature("Mara", UnitTypes.Ispolin, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId, createPosition), abilities)
  }

  static getLetavica = (id, playerId, level, createPosition) => {
    const stat = () => {
      if (level === 1) return [2, 4, 4]
      if (level === 2) return [2, 5, 4]
      if (level === 3) return [3, 5, 5]
    }
    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.keywords.push(UnitKeywords.Unfocused)
      abilities.actions.push({name: "raid"})
      if (level > 1) {
        abilities.onDeath.push({name: 'lethalGrab'})
      }
    }

    return getCreature("Letavica", UnitTypes.Vestnick, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId, createPosition), abilities)
  }

  static getUrka = (id, playerId, _, createPosition) => {
    const stat = [3, 7, 4]
    return getIdol("Urka", Biom.Steppe, id, ...stat, getUnitState(id, playerId, createPosition))
  }

  static getViy = (id, playerId, _, createPosition) => {
    const stat = [2, 10, 2]
    return getIdol("Viy", Biom.Steppe, id, ...stat, getUnitState(id, playerId, createPosition))
  }
}
