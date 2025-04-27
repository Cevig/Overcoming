import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UGeysers {
  // Unit name constants
  static himeraName = "himera";
  static alyName = "aly";
  static rarogName = "rarog";
  static cherufeName = "cherufe";
  static jarPtizaName = "jarPtiza";

  // Stat lookup tables instead of conditional functions
  static UNIT_STATS = {
    [UGeysers.himeraName]: {
      1: [2, 5, 3],
      2: [2, 6, 3],
      3: [3, 6, 4]
    },
    [UGeysers.alyName]: {
      1: [2, 3, 4],
      2: [2, 4, 5],
      3: [3, 4, 5]
    },
    [UGeysers.rarogName]: {
      1: [2, 4, 3],
      2: [3, 4, 3],
      3: [3, 4, 4]
    },
    [UGeysers.cherufeName]: [2, 5, 5],
    [UGeysers.jarPtizaName]: [2, 6, 5]
  };

  // Helper method to create unit abilities
  static createAbilities(unitName, level, id) {
    const abilities = structuredClone(UnitAbilities);

    switch (unitName) {
      case UGeysers.himeraName:
        if (level > 0) {
          abilities.statUpdates.attack.push(UnitSkills.ThroughDamage);
          if (level > 1) {
            abilities.statUpdates.defence.push({name: UnitSkills.InjuredDamage});
            if (level > 2) {
              abilities.statUpdates.attack.push(UnitSkills.RoundDamage);
              abilities.keywords.push(UnitKeywords.RestrictedRoundDamage);
            }
          }
        }
        break;

      case UGeysers.alyName:
        if (level > 0) {
          abilities.onMove.push({name: UnitSkills.UnfocusedAura});
          if (level > 1) {
            abilities.keywords.push(UnitKeywords.Support);
            if (level > 2) {
              abilities.keywords.push(UnitKeywords.FullDeathDamage);
            }
          }
        }
        break;

      case UGeysers.rarogName:
        if (level > 0) {
          abilities.actions.push({name: UnitSkills.Raid, qty: 99});
          abilities.keywords.push(UnitKeywords.Unfocused);
          abilities.statUpdates.attack.push(UnitSkills.AddPoisonEffect);
          if (level > 1) {
            abilities.statUpdates.defence.push({name: UnitSkills.Wholeness, unitId: id});
            if (level > 2) {
              abilities.statUpdates.attack.push(UnitSkills.AddPoisonEffectOnRaid);
            }
          }
        }
        break;

      case UGeysers.cherufeName:
        abilities.keywords.push(UnitKeywords.Unfocused);
        abilities.allTimeActions.push({name: UnitSkills.SetItOnFire, qty: 3});
        break;

      case UGeysers.jarPtizaName:
        abilities.keywords.push(UnitKeywords.AdditionalEssence);
        abilities.statUpdates.defence.push({name: UnitSkills.BlockStatuses, unitId: id});
        abilities.allTimeActions.push({name: UnitSkills.HealAlly, qty: 3});
        abilities.statUpdates.attack.push(UnitSkills.ThroughDamage);
        break;

      default:
        break;
    }

    return abilities;
  }

  static getHimera = (id, playerId, level, createPosition, price) => {
    const stats = UGeysers.UNIT_STATS[UGeysers.himeraName][level];
    const abilities = UGeysers.createAbilities(UGeysers.himeraName, level, id);

    return getCreature(
      UGeysers.himeraName,
      UnitTypes.Prispeshnick,
      Biom.Geysers,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getAly = (id, playerId, level, createPosition, price) => {
    const stats = UGeysers.UNIT_STATS[UGeysers.alyName][level];
    const abilities = UGeysers.createAbilities(UGeysers.alyName, level, id);

    return getCreature(
      UGeysers.alyName,
      UnitTypes.Prominkor,
      Biom.Geysers,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getRarog = (id, playerId, level, createPosition, price) => {
    const stats = UGeysers.UNIT_STATS[UGeysers.rarogName][level];
    const abilities = UGeysers.createAbilities(UGeysers.rarogName, level, id);

    return getCreature(
      UGeysers.rarogName,
      UnitTypes.Vestnick,
      Biom.Geysers,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getCherufe = (id, playerId, _, createPosition) => {
    const stats = UGeysers.UNIT_STATS[UGeysers.cherufeName];
    const abilities = UGeysers.createAbilities(UGeysers.cherufeName, 0, id);

    return getIdol(
      UGeysers.cherufeName,
      Biom.Geysers,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }

  static getJarPtiza = (id, playerId, _, createPosition) => {
    const stats = UGeysers.UNIT_STATS[UGeysers.jarPtizaName];
    const abilities = UGeysers.createAbilities(UGeysers.jarPtizaName, 0, id);

    return getIdol(
      UGeysers.jarPtizaName,
      Biom.Geysers,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }
}
