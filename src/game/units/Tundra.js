import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UTundra {
  // Unit name constants
  static ledyanoyJackName = "ledyanoyJack";
  static bonakonName = "bonakon";
  static planetnickName = "planetnick";
  static medvedOborotenName = "medvedOboroten";
  static marenaName = "marena";

  // Stat lookup tables instead of conditional functions
  static UNIT_STATS = {
    [UTundra.ledyanoyJackName]: {
      1: [2, 4, 3],
      2: [3, 5, 3],
      3: [3, 7, 3]
    },
    [UTundra.bonakonName]: {
      1: [2, 3, 5],
      2: [2, 4, 5],
      3: [3, 5, 5]
    },
    [UTundra.planetnickName]: {
      1: [2, 4, 3],
      2: [2, 5, 3],
      3: [3, 5, 3]
    },
    [UTundra.medvedOborotenName]: [2, 8, 3],
    [UTundra.marenaName]: [1, 10, 1]
  };

  // Helper method to create unit abilities
  static createAbilities(unitName, level, id) {
    const abilities = structuredClone(UnitAbilities);

    switch (unitName) {
      case UTundra.ledyanoyJackName:
        abilities.statUpdates.defence.push({name: UnitSkills.BlockDamage, point: null});
        break;

      case UTundra.bonakonName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.Sneaky);
          abilities.keywords.push(UnitKeywords.Unfocused);
          abilities.statUpdates.defence.push({name: UnitSkills.InjuredDamage});
          if (level > 1) {
            abilities.keywords.push(UnitKeywords.Support);
          }
        }
        break;

      case UTundra.planetnickName:
        if (level > 0) {
          abilities.actions.push({name: UnitSkills.Raid, qty: 99});
          abilities.keywords.push(UnitKeywords.Unfocused);
          abilities.statUpdates.attack.push(UnitSkills.DecreaseInitiative);
          if (level > 1) {
            abilities.keywords.push(UnitKeywords.ExtendedMove);
            if (level > 2) {
              abilities.statUpdates.defence.push({name: UnitSkills.Wholeness, unitId: id});
            }
          }
        }
        break;

      case UTundra.medvedOborotenName:
        abilities.statUpdates.defence.push({name: UnitSkills.ReduceDamage, unitId: id});
        abilities.allTimeActions.push({name: UnitSkills.ChargeAttack, qty: 1});
        break;

      case UTundra.marenaName:
        abilities.statUpdates.attack.push(
          UnitSkills.ChainDamage,
          UnitSkills.AddFreezeEffect,
          UnitSkills.AddUnfocusedEffect,
          UnitSkills.HealOnAttack
        );
        abilities.statUpdates.defence.push({name: UnitSkills.RaidBlock, origin: true});
        break;

      default:
        break;
    }

    return abilities;
  }

  static getLedyanoyJack = (id, playerId, level, createPosition, price) => {
    const stats = UTundra.UNIT_STATS[UTundra.ledyanoyJackName][level];
    const abilities = UTundra.createAbilities(UTundra.ledyanoyJackName, level, id);

    return getCreature(
      UTundra.ledyanoyJackName,
      UnitTypes.Prispeshnick,
      Biom.Tundra,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getBonakon = (id, playerId, level, createPosition, price) => {
    const stats = UTundra.UNIT_STATS[UTundra.bonakonName][level];
    const abilities = UTundra.createAbilities(UTundra.bonakonName, level, id);

    return getCreature(
      UTundra.bonakonName,
      UnitTypes.Prominkor,
      Biom.Tundra,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getPlanetnick = (id, playerId, level, createPosition, price) => {
    const stats = UTundra.UNIT_STATS[UTundra.planetnickName][level];
    const abilities = UTundra.createAbilities(UTundra.planetnickName, level, id);

    return getCreature(
      UTundra.planetnickName,
      UnitTypes.Vestnick,
      Biom.Tundra,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getMedvedOboroten = (id, playerId, _, createPosition) => {
    const stats = UTundra.UNIT_STATS[UTundra.medvedOborotenName];
    const abilities = UTundra.createAbilities(UTundra.medvedOborotenName, 0, id);

    return getIdol(
      UTundra.medvedOborotenName,
      Biom.Tundra,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }

  static getMarena = (id, playerId, _, createPosition) => {
    const stats = UTundra.UNIT_STATS[UTundra.marenaName];
    const abilities = UTundra.createAbilities(UTundra.marenaName, 0, id);

    return getIdol(
      UTundra.marenaName,
      Biom.Tundra,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }
}
