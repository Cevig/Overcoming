import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UDesert {
  // Unit name constants
  static amfisbenaName = "amfisbena";
  static obajifoName = "obajifo";
  static adzeName = "adze";
  static sfinksName = "sfinks";
  static vasiliskName = "vasilisk";

  // Stat lookup tables instead of conditional functions
  static UNIT_STATS = {
    [UDesert.amfisbenaName]: {
      1: [2, 4, 3],
      2: [2, 5, 4],
      3: [3, 5, 4]
    },
    [UDesert.obajifoName]: {
      1: [2, 3, 5],
      2: [2, 4, 6],
      3: [3, 4, 6]
    },
    [UDesert.adzeName]: {
      1: [2, 4, 3],
      2: [2, 5, 3],
      3: [3, 5, 3]
    },
    [UDesert.sfinksName]: [2, 12, 4],
    [UDesert.vasiliskName]: [2, 8, 4]
  };

  // Helper method to create unit abilities
  static createAbilities(unitName, level, id) {
    const abilities = structuredClone(UnitAbilities);

    switch (unitName) {
      case UDesert.amfisbenaName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.AlwaysCounterDamage);
          if (level > 1) {
            abilities.keywords.push(UnitKeywords.FullDeathDamage);
            if (level > 2) {
              abilities.statUpdates.defence.push({ name: UnitSkills.AntiVestnick });
            }
          }
        }
        break;

      case UDesert.obajifoName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.Sneaky);
          abilities.onMove.push({ name: UnitSkills.ObajifoAura });
          if (level > 1) {
            abilities.statUpdates.attack.push(UnitSkills.HealOnAttack);
            if (level > 2) {
              abilities.keywords.push(UnitKeywords.Support);
            }
          }
        }
        break;

      case UDesert.adzeName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.Unfocused, UnitKeywords.ReplaceHealsRaid);
          abilities.actions.push({ name: UnitSkills.Raid, qty: 99 });
          abilities.statUpdates.defence.push({ name: UnitSkills.DeadlyDamage });
          if (level > 1) {
            abilities.keywords.push(UnitKeywords.AdditionalSacrificeRaid);
            if (level > 2) {
              abilities.statUpdates.defence.push({ name: UnitSkills.Wholeness, unitId: id });
            }
          }
        }
        break;

      case UDesert.sfinksName:
        abilities.keywords.push(UnitKeywords.Sneaky);
        abilities.statUpdates.defence.push({ name: UnitSkills.DoubleDamage });
        break;

      case UDesert.vasiliskName:
        abilities.statUpdates.attack.push(UnitSkills.RoundDamage, UnitSkills.AddPoisonEffect);
        break;

      default:
          break;
    }

    return abilities;
  }

  static getAmfisbena = (id, playerId, level, createPosition, price) => {
    const stats = UDesert.UNIT_STATS[UDesert.amfisbenaName][level];
    const abilities = UDesert.createAbilities(UDesert.amfisbenaName, level, id);

    return getCreature(
      UDesert.amfisbenaName,
      UnitTypes.Prispeshnick,
      Biom.Desert,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getObajifo = (id, playerId, level, createPosition, price) => {
    const stats = UDesert.UNIT_STATS[UDesert.obajifoName][level];
    const abilities = UDesert.createAbilities(UDesert.obajifoName, level, id);

    return getCreature(
      UDesert.obajifoName,
      UnitTypes.Prominkor,
      Biom.Desert,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getAdze = (id, playerId, level, createPosition, price) => {
    const stats = UDesert.UNIT_STATS[UDesert.adzeName][level];
    const abilities = UDesert.createAbilities(UDesert.adzeName, level, id);

    return getCreature(
      UDesert.adzeName,
      UnitTypes.Vestnick,
      Biom.Desert,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getSfinks = (id, playerId, _, createPosition) => {
    const stats = UDesert.UNIT_STATS[UDesert.sfinksName];
    const abilities = UDesert.createAbilities(UDesert.sfinksName, 0, id);

    return getIdol(
      UDesert.sfinksName,
      Biom.Desert,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }

  static getVasilisk = (id, playerId, _, createPosition) => {
    const stats = UDesert.UNIT_STATS[UDesert.vasiliskName];
    const abilities = UDesert.createAbilities(UDesert.vasiliskName, 0, id);

    return getIdol(
      UDesert.vasiliskName,
      Biom.Desert,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }
}
