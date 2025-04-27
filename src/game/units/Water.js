import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UWater {
  // Unit name constants
  static lerneyskiyRakName = "lerneyskiy";
  static bykavazName = "bykavaz";
  static aidaharName = "aidahar";
  static balorName = "balor";
  static vodyanoiName = "vodyanoi";

  // Stat lookup tables instead of conditional functions
  static UNIT_STATS = {
    [UWater.lerneyskiyRakName]: {
      1: [1, 2, 1],
      2: [1, 2, 1],
      3: [1, 2, 1]
    },
    [UWater.bykavazName]: {
      1: [2, 3, 4],
      2: [2, 3, 4],
      3: [3, 4, 5]
    },
    [UWater.aidaharName]: {
      1: [2, 4, 3],
      2: [3, 4, 3],
      3: [3, 4, 3]
    },
    [UWater.balorName]: [3, 8, 1],
    [UWater.vodyanoiName]: [2, 7, 5]
  };

  // Helper method to create unit abilities
  static createAbilities(unitName, level, id) {
    const abilities = structuredClone(UnitAbilities);

    switch (unitName) {
      case UWater.lerneyskiyRakName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.LowCost);
          if (level > 1) {
            abilities.onMove.push({name: UnitSkills.Surround3});
            if (level > 2) {
              abilities.statUpdates.attack.push(UnitSkills.InstantKill);
            }
          }
        }
        break;

      case UWater.bykavazName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.Sneaky);
          abilities.keywords.push(UnitKeywords.Support);
          if (level > 1) {
            abilities.statUpdates.attack.push(UnitSkills.AddStunEffect);
          }
        }
        break;

      case UWater.aidaharName:
        if (level > 0) {
          abilities.actions.push({name: UnitSkills.Raid, qty: 99});
          abilities.keywords.push(UnitKeywords.Unfocused);
          abilities.allTimeActions.push({name: UnitSkills.HealAlly, qty: 1});
          if (level > 2) {
            abilities.keywords.push(UnitKeywords.Support);
          }
        }
        break;

      case UWater.balorName:
        abilities.keywords.push(UnitKeywords.AbsoluteMove);
        abilities.statUpdates.attack.push(UnitSkills.InstantKillOnCounter);
        abilities.statUpdates.defence.push({name: UnitSkills.DoubleDamageInDefence});
        break;

      case UWater.vodyanoiName:
        abilities.onMove.push({name: UnitSkills.LowHealsAura});
        abilities.afterHitActions.push({name: UnitSkills.ThrowOver, qty: 99});
        break;

      default:
        break;
    }

    return abilities;
  }

  static getLerneyskiyRak = (id, playerId, level, createPosition, price) => {
    const stats = UWater.UNIT_STATS[UWater.lerneyskiyRakName][level];
    const abilities = UWater.createAbilities(UWater.lerneyskiyRakName, level, id);

    return getCreature(
      UWater.lerneyskiyRakName,
      UnitTypes.Prispeshnick,
      Biom.Water,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getBykavaz = (id, playerId, level, createPosition, price) => {
    const stats = UWater.UNIT_STATS[UWater.bykavazName][level];
    const abilities = UWater.createAbilities(UWater.bykavazName, level, id);

    return getCreature(
      UWater.bykavazName,
      UnitTypes.Prominkor,
      Biom.Water,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getAidahar = (id, playerId, level, createPosition, price) => {
    const stats = UWater.UNIT_STATS[UWater.aidaharName][level];
    const abilities = UWater.createAbilities(UWater.aidaharName, level, id);

    return getCreature(
      UWater.aidaharName,
      UnitTypes.Vestnick,
      Biom.Water,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getBalor = (id, playerId, _, createPosition) => {
    const stats = UWater.UNIT_STATS[UWater.balorName];
    const abilities = UWater.createAbilities(UWater.balorName, 0, id);

    return getIdol(
      UWater.balorName,
      Biom.Water,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }

  static getVodyanoi = (id, playerId, _, createPosition) => {
    const stats = UWater.UNIT_STATS[UWater.vodyanoiName];
    const abilities = UWater.createAbilities(UWater.vodyanoiName, 0, id);

    return getIdol(
      UWater.vodyanoiName,
      Biom.Water,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }
}
