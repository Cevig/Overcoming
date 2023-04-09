import {Biom} from "../helpers/Constants";
import {
  getCreature,
  getIdol,
  getUnitState,
  UnitAbilities,
  UnitTypes
} from "./Unit";

// import "scope-extensions-js"

export class USteppe {

  // G = undefined
  // ctx = undefined
  // event = undefined
  // playerID = undefined
  //
  //
  // constructor(data) {
  //   this.G = data.G;
  //   this.ctx = data.ctx;
  //   this.event = data.event;
  //   this.playerID = data.playerID;
  // }
  static polydnicaName = "Polydnica"
  static getPolydnica = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1) return [2, 5, 4]
      if (level === 2) return [2, 6, 4]
      if (level === 3) return [3, 6, 4]
    }

    const abilities = JSON.parse(JSON.stringify(UnitAbilities));
    if (level > 0) {
      abilities.onMove.game.push({name: 'surround3', unitId: id})
      if (level > 1) {
        abilities.statUpdates.handlers.defence.push({name: 'wholeness', unitId: id})
        if (level > 2) {
          abilities.statUpdates.handlers.attack.push({name: 'addFreezeEffect', unitId: id})
        }
      }
    }

    return getCreature(USteppe.polydnicaName, UnitTypes.Prispeshnick, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId), abilities)
  }
  static getMara = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 3, 5]
      if (level === 2)
        return [2, 4, 6]
      if (level === 3)
        return [4, 4, 5]
    }

    return getCreature("Mara", UnitTypes.Ispolin, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId))
  }

  static getLetavica = (id, playerId, level = 1) => {
    const stat = () => {
      if (level === 1)
        return [2, 4, 4]
      if (level === 2)
        return [2, 5, 4]
      if (level === 3)
        return [3, 5, 5]
    }

    return getCreature("Letavica", UnitTypes.Vestnick, Biom.Steppe, id, ...stat(), level, getUnitState(id, playerId))
  }

  static getUrka = (id, playerId) => {
    const stat = [3, 7, 4]
    return getIdol("Urka", Biom.Steppe, id, ...stat, getUnitState(id, playerId))
  }

  static getViy = (id, playerId) => {
    const stat = [2, 10, 2]
    return getIdol("Viy", Biom.Steppe, id, ...stat, getUnitState(id, playerId))
  }
}
