import {Biom, UnitTypes} from "../helpers/Constants";
import {USteppe} from "./Steppe";
import {UForest} from "./Forest";
import {UMountains} from "./Mountains";
import {UDesert} from "./Desert";
import {UTundra} from "./Tundra";
import {UJungle} from "./Jungle";
import {UWater} from "./Water";
import {UMash} from "./Mash";
import {UGeysers} from "./Geysers";

export const getCreature = (name, type, biom, id, power, heals, initiative, level, unitState, abilities = JSON.parse(JSON.stringify(UnitAbilities)), price = 2, status = []) => ({
  id: id,
  name: name,
  type: type,
  biom: biom,
  power: power,
  heals: heals,
  initiative: initiative,
  level: level,
  unitState: unitState,
  abilities: abilities,
  price: price,
  status: status
})

export const getIdol = (name, biom, id, power, heals, initiative, unitState, abilities = JSON.parse(JSON.stringify(UnitAbilities)), status = []) => ({
  id: id,
  name: name,
  type: UnitTypes.Idol,
  biom: biom,
  power: power,
  heals: heals,
  initiative: initiative,
  unitState: unitState,
  abilities: abilities,
  status: status,
  price: 4
})

export const getUnitState = (unitId, playerId, power, heals, initiative, createPosition, point = null) => ({
  unitId: unitId,
  playerId: playerId,
  baseStats: {power: power, heals: heals, initiative: initiative},
  createPosition: createPosition,
  point: point,
  isClickable: true,
  isInGame: false,
  isInFight: false,
  isInSortie: false,
  skippedTurn: false,
  isCounterAttacked: false,
  isMovedLastPhase: false,
  initiatorFor: []
})

export const createUnitObject = (...data) => {
  const [id, playerId, biom, type = UnitTypes.Idol, pos = 0, level = 1, price = 2] = data
  const unitsTree = {
    [Biom.Steppe]: {
      [UnitTypes.Prispeshnick]: [USteppe.getPolydnica],
      [UnitTypes.Prominkor]: [USteppe.getMara],
      [UnitTypes.Vestnick]: [USteppe.getLetavica],
      [UnitTypes.Idol]: [USteppe.getUrka, USteppe.getViy]
    },
    [Biom.Forest]: {
      [UnitTypes.Prispeshnick]: [UForest.getLesavka],
      [UnitTypes.Prominkor]: [UForest.getBereginya],
      [UnitTypes.Vestnick]: [UForest.getSirin],
      [UnitTypes.Idol]: [UForest.getAbasu, UForest.getChygayster]
    },
    [Biom.Mountains]: {
      [UnitTypes.Prispeshnick]: [UMountains.getBeytir],
      [UnitTypes.Prominkor]: [UMountains.getGarzyk],
      [UnitTypes.Vestnick]: [UMountains.getVeshizaSoroka],
      [UnitTypes.Idol]: [UMountains.getPsoglav, UMountains.getHala]
    },
    [Biom.Desert]: {
      [UnitTypes.Prispeshnick]: [UDesert.getAmfisbena],
      [UnitTypes.Prominkor]: [UDesert.getObajifo],
      [UnitTypes.Vestnick]: [UDesert.getAdze],
      [UnitTypes.Idol]: [UDesert.getSfinks, UDesert.getVasilisk]
    },
    [Biom.Tundra]: {
      [UnitTypes.Prispeshnick]: [UTundra.getLedyanoyJack],
      [UnitTypes.Prominkor]: [UTundra.getBonakon],
      [UnitTypes.Vestnick]: [UTundra.getPlanetnick],
      [UnitTypes.Idol]: [UTundra.getMedvedOboroten, UTundra.getMarena]
    },
    [Biom.Jungle]: {
      [UnitTypes.Prispeshnick]: [UJungle.getBlemmii],
      [UnitTypes.Prominkor]: [UJungle.getPetsyhos],
      [UnitTypes.Vestnick]: [UJungle.getKaiery],
      [UnitTypes.Idol]: [UJungle.getEloko, UJungle.getAdjatar]
    },
    [Biom.Water]: {
      [UnitTypes.Prispeshnick]: [UWater.getLerneyskiyRak],
      [UnitTypes.Prominkor]: [UWater.getBykavaz],
      [UnitTypes.Vestnick]: [UWater.getAidahar],
      [UnitTypes.Idol]: [UWater.getBalor, UWater.getVodyanoi]
    },
    [Biom.Mash]: {
      [UnitTypes.Prispeshnick]: [UMash.getMohovik],
      [UnitTypes.Prominkor]: [UMash.getDrekavaz],
      [UnitTypes.Vestnick]: [UMash.getMavka],
      [UnitTypes.Idol]: [UMash.getBegemot, UMash.getFekst]
    },
    [Biom.Geysers]: {
      [UnitTypes.Prispeshnick]: [UGeysers.getHimera],
      [UnitTypes.Prominkor]: [UGeysers.getAly],
      [UnitTypes.Vestnick]: [UGeysers.getRarog],
      [UnitTypes.Idol]: [UGeysers.getCherufe, UGeysers.getJarPtiza]
    }
  }

  return unitsTree[biom][type][pos](id, playerId, level, pos, price)
}

export const UnitAbilities = {
  onMove: [],
  statUpdates: {
    attack: [],
    defence: []
  },
  keywords: [],
  actions: [],
  afterHitActions: [],
  allTimeActions: [],
  onDeath: []
}


