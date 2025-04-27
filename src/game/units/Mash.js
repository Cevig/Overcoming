import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UMash {
  // Unit name constants
  static mohovikName = "mohovik";
  static drekavazName = "drekavaz";
  static mavkaName = "mavka";
  static begemotName = "begemot";
  static fekstName = "fekst";

  // Stat lookup tables instead of conditional functions
  static UNIT_STATS = {
    [UMash.mohovikName]: {
      1: [2, 4, 4],
      2: [2, 5, 4],
      3: [2, 5, 4]
    },
    [UMash.drekavazName]: {
      1: [2, 3, 5],
      2: [2, 4, 6],
      3: [4, 4, 6]
    },
    [UMash.mavkaName]: {
      1: [1, 3, 3],
      2: [1, 4, 3],
      3: [2, 4, 4]
    },
    [UMash.begemotName]: [2, 8, 2],
    [UMash.fekstName]: [2, 7, 4]
  };

  // Helper method to create unit abilities
  static createAbilities(unitName, level, id) {
    const abilities = structuredClone(UnitAbilities);

    switch (unitName) {
      case UMash.mohovikName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.AbsoluteMove);
          if (level > 1) {
            abilities.keywords.push(UnitKeywords.AlwaysCounterDamage);
            if (level > 2) {
              abilities.keywords.push(UnitKeywords.Sneaky);
            }
          }
        }
        break;

      case UMash.drekavazName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.Sneaky);
          abilities.onDeath.push({name: UnitSkills.LethalBlow});
          if (level > 1) {
            abilities.keywords.push(UnitKeywords.Support);
          }
        }
        break;

      case UMash.mavkaName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.Unfocused);
          abilities.actions.push({name: UnitSkills.Raid, qty: 99});
          abilities.statUpdates.attack.push(UnitSkills.AddVengeanceEffect);
          if (level > 1) {
            abilities.statUpdates.attack.push(UnitSkills.AddPoisonEffectOnRaid);
            if (level > 2) {
              abilities.allTimeActions.push({name: UnitSkills.ReplaceUnits, qty: 1});
            }
          }
        }
        break;

      case UMash.begemotName:
        abilities.keywords.push(UnitKeywords.AlwaysCounterDamage);
        abilities.keywords.push(UnitKeywords.MainTarget);
        break;

      case UMash.fekstName:
        abilities.allTimeActions.push({name: UnitSkills.NotMovedRecover, qty: 99});
        abilities.statUpdates.defence.push({name: UnitSkills.BlockStatuses, unitId: id});
        abilities.statUpdates.attack.push(UnitSkills.HealOnAttack);
        abilities.onDeath.push({name: UnitSkills.LethalGrab});
        break;

      default:
        break;
    }

    return abilities;
  }

  static getMohovik = (id, playerId, level, createPosition, price) => {
    const stats = UMash.UNIT_STATS[UMash.mohovikName][level];
    const abilities = UMash.createAbilities(UMash.mohovikName, level, id);

    return getCreature(
      UMash.mohovikName,
      UnitTypes.Prispeshnick,
      Biom.Mash,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getDrekavaz = (id, playerId, level, createPosition, price) => {
    const stats = UMash.UNIT_STATS[UMash.drekavazName][level];
    const abilities = UMash.createAbilities(UMash.drekavazName, level, id);

    return getCreature(
      UMash.drekavazName,
      UnitTypes.Prominkor,
      Biom.Mash,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getMavka = (id, playerId, level, createPosition, price) => {
    const stats = UMash.UNIT_STATS[UMash.mavkaName][level];
    const abilities = UMash.createAbilities(UMash.mavkaName, level, id);

    return getCreature(
      UMash.mavkaName,
      UnitTypes.Vestnick,
      Biom.Mash,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getBegemot = (id, playerId, _, createPosition) => {
    const stats = UMash.UNIT_STATS[UMash.begemotName];
    const abilities = UMash.createAbilities(UMash.begemotName, 0, id);

    return getIdol(
      UMash.begemotName,
      Biom.Mash,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }

  static getFekst = (id, playerId, _, createPosition) => {
    const stats = UMash.UNIT_STATS[UMash.fekstName];
    const abilities = UMash.createAbilities(UMash.fekstName, 0, id);

    return getIdol(
      UMash.fekstName,
      Biom.Mash,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }
}
