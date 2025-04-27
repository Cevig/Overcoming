import {Biom, UnitKeywords, UnitSkills, UnitTypes} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitAbilities} from "./Unit";

export class UMountains {
  // Unit name constants
  static beytirName = "beytir";
  static garzykName = "garzyk";
  static veshizaSorokaName = "veshizaSoroka";
  static psoglavName = "psoglav";
  static halaName = "hala";

  // Stat lookup tables instead of conditional functions
  static UNIT_STATS = {
    [UMountains.beytirName]: {
      1: [2, 5, 3],
      2: [2, 6, 4],
      3: [3, 7, 4]
    },
    [UMountains.garzykName]: {
      1: [2, 3, 4],
      2: [2, 4, 5],
      3: [3, 4, 5]
    },
    [UMountains.veshizaSorokaName]: {
      1: [2, 4, 3],
      2: [2, 4, 3],
      3: [3, 5, 4]
    },
    [UMountains.psoglavName]: [3, 6, 4],
    [UMountains.halaName]: [2, 8, 5]
  };

  // Helper method to create unit abilities
  static createAbilities(unitName, level, id) {
    const abilities = structuredClone(UnitAbilities);

    switch (unitName) {
      case UMountains.beytirName:
        abilities.statUpdates.attack.push(UnitSkills.ChainDamage);
        break;

      case UMountains.garzykName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.Sneaky);
          abilities.statUpdates.defence.push({name: UnitSkills.Wholeness, unitId: id});
          abilities.statUpdates.defence.push({name: UnitSkills.RaidBlock, origin: true});
          if (level > 1) {
            abilities.allTimeActions.push({name: UnitSkills.ThrowWeapon, qty: 1});
          }
        }
        break;

      case UMountains.veshizaSorokaName:
        if (level > 0) {
          abilities.keywords.push(UnitKeywords.Unfocused);
          abilities.keywords.push(UnitKeywords.NoObstaclesRaid);
          abilities.actions.push({name: UnitSkills.Raid, qty: 99});
          if (level > 1) {
            abilities.allTimeActions.push({name: UnitSkills.ReplaceUnits, qty: 1});
          }
        }
        break;

      case UMountains.psoglavName:
        abilities.allTimeActions.push({name: UnitSkills.PauseToRecover, qty: 2});
        break;

      case UMountains.halaName:
        abilities.onMove.push({name: UnitSkills.HalaAura});
        abilities.statUpdates.defence.push({name: UnitSkills.RaidBlock, origin: true});
        break;

      default:
        break;
    }

    return abilities;
  }

  static getBeytir = (id, playerId, level, createPosition, price) => {
    const stats = UMountains.UNIT_STATS[UMountains.beytirName][level];
    const abilities = UMountains.createAbilities(UMountains.beytirName, level, id);

    return getCreature(
      UMountains.beytirName,
      UnitTypes.Prispeshnick,
      Biom.Mountains,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getGarzyk = (id, playerId, level, createPosition, price) => {
    const stats = UMountains.UNIT_STATS[UMountains.garzykName][level];
    const abilities = UMountains.createAbilities(UMountains.garzykName, level, id);

    return getCreature(
      UMountains.garzykName,
      UnitTypes.Prominkor,
      Biom.Mountains,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getVeshizaSoroka = (id, playerId, level, createPosition, price) => {
    const stats = UMountains.UNIT_STATS[UMountains.veshizaSorokaName][level];
    const abilities = UMountains.createAbilities(UMountains.veshizaSorokaName, level, id);

    return getCreature(
      UMountains.veshizaSorokaName,
      UnitTypes.Vestnick,
      Biom.Mountains,
      id,
      ...stats,
      level,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities,
      price
    );
  }

  static getPsoglav = (id, playerId, _, createPosition) => {
    const stats = UMountains.UNIT_STATS[UMountains.psoglavName];
    const abilities = UMountains.createAbilities(UMountains.psoglavName, 0, id);

    return getIdol(
      UMountains.psoglavName,
      Biom.Mountains,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }

  static getHala = (id, playerId, _, createPosition) => {
    const stats = UMountains.UNIT_STATS[UMountains.halaName];
    const abilities = UMountains.createAbilities(UMountains.halaName, 0, id);

    return getIdol(
      UMountains.halaName,
      Biom.Mountains,
      id,
      ...stats,
      getUnitState(id, playerId, ...stats, createPosition),
      abilities
    );
  }
}
