import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UForest {
  // Unit name constants
  static lesavkaName = "lesavka";
  static bereginyaName = "bereginya";
  static sirinName = "sirin";
  static abasuName = "abasu";
  static chygaysterName = "chygayster";

  // Stat lookup tables instead of conditional functions
  static UNIT_STATS = {
    [UForest.lesavkaName]: {
      1: [2, 5, 3],
      2: [2, 5, 4],
      3: [3, 6, 4]
    },
    [UForest.bereginyaName]: {
      1: [1, 3, 5],
      2: [2, 3, 5],
      3: [3, 4, 6]
    },
    [UForest.sirinName]: {
      1: [2, 5, 4],
      2: [3, 5, 4],
      3: [3, 6, 4]
    },
    [UForest.abasuName]: [2, 6, 4],
    [UForest.chygaysterName]: [2, 7, 5]
  };

  // Helper method to create unit abilities
  static createAbilities(unitName, level, id) {
    const abilities = structuredClone(UnitAbilities);

    switch (unitName) {
      case UForest.lesavkaName:
        if (level > 0) {
          abilities.afterHitActions.push({name: UnitSkills.Lesavka, qty: 99});
          if (level > 1) {
            abilities.statUpdates.attack.push(UnitSkills.DecreaseInitiative);
          }
        }
        break;

      case UForest.bereginyaName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.Sneaky);
          if (level > 1) {
            abilities.allTimeActions.push({name: UnitSkills.HealAlly, qty: 3});
            abilities.keywords.push(UnitKeywords.Support);
          } else {
            abilities.allTimeActions.push({name: UnitSkills.HealAlly, qty: 2});
          }
        }
        break;

      case UForest.sirinName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.Unfocused);
          abilities.actions.push({name: UnitSkills.Raid, qty: 99});
          if (level > 2) {
            abilities.keywords.push(UnitKeywords.AbsoluteRaid);
          } else {
            abilities.keywords.push(UnitKeywords.RestrictedRaid);
          }
        }
        break;

      case UForest.abasuName:
        abilities.onDeath.push({name: UnitSkills.UtilizeDeath});
        abilities.allTimeActions.push({name: UnitSkills.AbasuCurse, qty: 0});
        break;

      case UForest.chygaysterName:
        abilities.keywords.push(UnitKeywords.ExtendedMove);
        abilities.statUpdates.attack.push(
          UnitSkills.AddUnfocusedEffect,
          UnitSkills.AddPoisonEffect,
          UnitSkills.AddVengeanceEffect
        );
        break;

      default:
        break;
    }

    return abilities;
  }

  static getLesavka = (id, playerId, level, createPosition, price) => {
    const stats = UForest.UNIT_STATS[UForest.lesavkaName][level];
    const abilities = UForest.createAbilities(UForest.lesavkaName, level, id);

    return getCreature(
      UForest.lesavkaName,
      UnitTypes.Prispeshnick,
      Biom.Forest,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getBereginya = (id, playerId, level, createPosition, price) => {
    const stats = UForest.UNIT_STATS[UForest.bereginyaName][level];
    const abilities = UForest.createAbilities(UForest.bereginyaName, level, id);

    return getCreature(
      UForest.bereginyaName,
      UnitTypes.Prominkor,
      Biom.Forest,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getSirin = (id, playerId, level, createPosition, price) => {
    const stats = UForest.UNIT_STATS[UForest.sirinName][level];
    const abilities = UForest.createAbilities(UForest.sirinName, level, id);

    return getCreature(
      UForest.sirinName,
      UnitTypes.Vestnick,
      Biom.Forest,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getAbasu = (id, playerId, _, createPosition) => {
    const stats = UForest.UNIT_STATS[UForest.abasuName];
    const abilities = UForest.createAbilities(UForest.abasuName, 0, id);

    return getIdol(
      UForest.abasuName,
      Biom.Forest,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }

  static getChygayster = (id, playerId, _, createPosition) => {
    const stats = UForest.UNIT_STATS[UForest.chygaysterName];
    const abilities = UForest.createAbilities(UForest.chygaysterName, 0, id);

    return getIdol(
      UForest.chygaysterName,
      Biom.Forest,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }
}
