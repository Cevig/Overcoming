import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UJungle {
  // Unit name constants
  static blemmiiName = "blemmii";
  static petsyhosName = "petsyhos";
  static kaieryName = "kaiery";
  static elokoName = "eloko";
  static adjatarName = "adjatar";

  // Stat lookup tables instead of conditional functions
  static UNIT_STATS = {
    [UJungle.blemmiiName]: {
      1: [2, 6, 3],
      2: [2, 6, 4],
      3: [3, 7, 4]
    },
    [UJungle.petsyhosName]: {
      1: [2, 4, 5],
      2: [2, 5, 6],
      3: [4, 5, 6]
    },
    [UJungle.kaieryName]: {
      1: [1, 4, 4],
      2: [2, 4, 5],
      3: [2, 5, 5]
    },
    [UJungle.elokoName]: [2, 8, 4],
    [UJungle.adjatarName]: [1, 10, 5]
  };

  // Helper method to create unit abilities
  static createAbilities(unitName, level, id) {
    const abilities = structuredClone(UnitAbilities);

    switch (unitName) {
      case UJungle.blemmiiName:
        if (level > 0) {
          abilities.statUpdates.defence.push({name: UnitSkills.Wholeness, unitId: id});
          if (level > 1) {
            abilities.statUpdates.defence.push({name: UnitSkills.RaidBlock, origin: true});
          }
        }
        break;

      case UJungle.petsyhosName:
        abilities.keywords.push(UnitKeywords.Sneaky);
        abilities.statUpdates.attack.push(UnitSkills.AddUnfocusedEffect);
        break;

      case UJungle.kaieryName:
        if (level > 0) {
          abilities.actions.push({name: UnitSkills.Raid, qty: 99});
          abilities.statUpdates.defence.push({name: UnitSkills.BlockDamage, point: null});
          if (level > 2) {
            abilities.allTimeActions.push({name: UnitSkills.ChargeAttack, qty: 1});
          }
        }
        break;

      case UJungle.elokoName:
        abilities.allTimeActions.push({name: UnitSkills.SetElokoCurse, qty: 2});
        break;

      case UJungle.adjatarName:
        abilities.keywords.push(UnitKeywords.MainTarget);
        abilities.statUpdates.defence.push({name: UnitSkills.ReturnDamage});
        break;

      default:
        break;
    }

    return abilities;
  }

  static getBlemmii = (id, playerId, level, createPosition, price) => {
    const stats = UJungle.UNIT_STATS[UJungle.blemmiiName][level];
    const abilities = UJungle.createAbilities(UJungle.blemmiiName, level, id);

    return getCreature(
      UJungle.blemmiiName,
      UnitTypes.Prispeshnick,
      Biom.Jungle,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getPetsyhos = (id, playerId, level, createPosition, price) => {
    const stats = UJungle.UNIT_STATS[UJungle.petsyhosName][level];
    const abilities = UJungle.createAbilities(UJungle.petsyhosName, level, id);

    return getCreature(
      UJungle.petsyhosName,
      UnitTypes.Prominkor,
      Biom.Jungle,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getKaiery = (id, playerId, level, createPosition, price) => {
    const stats = UJungle.UNIT_STATS[UJungle.kaieryName][level];
    const abilities = UJungle.createAbilities(UJungle.kaieryName, level, id);

    return getCreature(
      UJungle.kaieryName,
      UnitTypes.Vestnick,
      Biom.Jungle,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getEloko = (id, playerId, _, createPosition) => {
    const stats = UJungle.UNIT_STATS[UJungle.elokoName];
    const abilities = UJungle.createAbilities(UJungle.elokoName, 0, id);

    return getIdol(
      UJungle.elokoName,
      Biom.Jungle,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }

  static getAdjatar = (id, playerId, _, createPosition) => {
    const stats = UJungle.UNIT_STATS[UJungle.adjatarName];
    const abilities = UJungle.createAbilities(UJungle.adjatarName, 0, id);

    return getIdol(
      UJungle.adjatarName,
      Biom.Jungle,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }
}
