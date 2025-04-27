import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class USteppe {
  // Unit name constants
  static polydnicaName = "polydnica";
  static maraName = "mara";
  static letavicaName = "letavica";
  static urkaName = "urka";
  static viyName = "viy";

  // Stat lookup tables instead of conditional functions
  static UNIT_STATS = {
    [USteppe.polydnicaName]: {
      1: [2, 5, 4],
      2: [2, 6, 4],
      3: [3, 6, 4]
    },
    [USteppe.maraName]: {
      1: [2, 3, 4],
      2: [2, 4, 4],
      3: [4, 4, 4]
    },
    [USteppe.letavicaName]: {
      1: [2, 3, 3],
      2: [2, 4, 4],
      3: [3, 4, 5]
    },
    [USteppe.urkaName]: [3, 7, 4],
    [USteppe.viyName]: [2, 10, 2]
  };

  // Helper method to create unit abilities
  static createAbilities(unitName, level, id) {
    const abilities = structuredClone(UnitAbilities);

    switch (unitName) {
      case USteppe.polydnicaName:
        if (level > 0) {
          abilities.onMove.push({name: UnitSkills.Surround3});
          if (level > 1) {
            abilities.statUpdates.defence.push({name: UnitSkills.Wholeness, unitId: id});
            if (level > 2) {
              abilities.statUpdates.attack.push(UnitSkills.AddFreezeEffect);
            }
          }
        }
        break;

      case USteppe.maraName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.Sneaky);
          abilities.onMove.push({name: UnitSkills.MaraAura});
        }
        break;

      case USteppe.letavicaName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.Unfocused);
          abilities.actions.push({name: UnitSkills.Raid, qty: 99});
          abilities.keywords.push(UnitKeywords.ReplaceHealsRaid);
          if (level > 1) {
            abilities.onDeath.push({name: UnitSkills.LethalGrab});
          }
        }
        break;

      case USteppe.urkaName:
        abilities.statUpdates.attack.push(UnitSkills.AddFreezeEffect);
        abilities.actions.push({name: UnitSkills.Urka, qty: 2});
        break;

      case USteppe.viyName:
        abilities.statUpdates.attack.push(UnitSkills.InstantKill);
        break;

      default:
        break;
    }

    return abilities;
  }

  static getPolydnica = (id, playerId, level, createPosition, price) => {
    const stats = USteppe.UNIT_STATS[USteppe.polydnicaName][level];
    const abilities = USteppe.createAbilities(USteppe.polydnicaName, level, id);

    return getCreature(
      USteppe.polydnicaName,
      UnitTypes.Prispeshnick,
      Biom.Steppe,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getMara = (id, playerId, level, createPosition, price) => {
    const stats = USteppe.UNIT_STATS[USteppe.maraName][level];
    const abilities = USteppe.createAbilities(USteppe.maraName, level, id);

    return getCreature(
      USteppe.maraName,
      UnitTypes.Prominkor,
      Biom.Steppe,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getLetavica = (id, playerId, level, createPosition, price) => {
    const stats = USteppe.UNIT_STATS[USteppe.letavicaName][level];
    const abilities = USteppe.createAbilities(USteppe.letavicaName, level, id);

    return getCreature(
      USteppe.letavicaName,
      UnitTypes.Vestnick,
      Biom.Steppe,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getUrka = (id, playerId, _, createPosition) => {
    const stats = USteppe.UNIT_STATS[USteppe.urkaName];
    const abilities = USteppe.createAbilities(USteppe.urkaName, 0, id);

    return getIdol(
      USteppe.urkaName,
      Biom.Steppe,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }

  static getViy = (id, playerId, _, createPosition) => {
    const stats = USteppe.UNIT_STATS[USteppe.viyName];
    const abilities = USteppe.createAbilities(USteppe.viyName, 0, id);

    return getIdol(
      USteppe.viyName,
      Biom.Steppe,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }
}
