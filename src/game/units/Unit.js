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

export const getCreature = (name, type, biom, id, power, heals, initiative, level, unitState, abilities = JSON.parse(JSON.stringify(UnitAbilities)), status = []) => ({
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
  status: status
})

export const getUnitState = (unitId, playerId, createPosition, point = null, isClickable = true, isInGame = false, isInFight = false, skippedTurn = false, isCounterAttacked = false) => ({
  unitId: unitId,
  playerId: playerId,
  createPosition: createPosition,
  point: point,
  isClickable: isClickable,
  isInGame: isInGame,
  isInFight: isInFight,
  skippedTurn: skippedTurn,
  isCounterAttacked: false
})

export const createUnitObject = (...data) => {
  const [id, playerId, biom, type = UnitTypes.Idol, pos = 0, level = 1] = data
  const unitsTree = {
    [Biom.Steppe]: {
      [UnitTypes.Prispeshnick]: [USteppe.getPolydnica],
      [UnitTypes.Ispolin]: [USteppe.getMara],
      [UnitTypes.Vestnick]: [USteppe.getLetavica],
      [UnitTypes.Idol]: [USteppe.getUrka, USteppe.getViy]
    },
    [Biom.Forest]: {
      [UnitTypes.Prispeshnick]: [UForest.getLesavka],
      [UnitTypes.Ispolin]: [UForest.getBereginya],
      [UnitTypes.Vestnick]: [UForest.getSirin],
      [UnitTypes.Idol]: [UForest.getAbasu, UForest.getChygayster]
    },
    [Biom.Mountains]: {
      [UnitTypes.Prispeshnick]: [UMountains.getBeytir],
      [UnitTypes.Ispolin]: [UMountains.getGarzyk],
      [UnitTypes.Vestnick]: [UMountains.getVeshizaSoroka],
      [UnitTypes.Idol]: [UMountains.getPsoglav, UMountains.getHala]
    },
    [Biom.Desert]: {
      [UnitTypes.Prispeshnick]: [UDesert.getAmfisbena],
      [UnitTypes.Ispolin]: [UDesert.getObajifo],
      [UnitTypes.Vestnick]: [UDesert.getAdze],
      [UnitTypes.Idol]: [UDesert.getSfinks, UDesert.getVasilisk]
    },
    [Biom.Tundra]: {
      [UnitTypes.Prispeshnick]: [UTundra.getLedyanoyJack],
      [UnitTypes.Ispolin]: [UTundra.getBonakon],
      [UnitTypes.Vestnick]: [UTundra.getPlanetnick],
      [UnitTypes.Idol]: [UTundra.getMedvedOboroten, UTundra.getMarena]
    },
    [Biom.Jungle]: {
      [UnitTypes.Prispeshnick]: [UJungle.getBlemmii],
      [UnitTypes.Ispolin]: [UJungle.getPetsyhos],
      [UnitTypes.Vestnick]: [UJungle.getKaiery],
      [UnitTypes.Idol]: [UJungle.getEpoko, UJungle.getAdjatar]
    },
    [Biom.Water]: {
      [UnitTypes.Prispeshnick]: [UWater.getLerneyskiyRak],
      [UnitTypes.Ispolin]: [UWater.getBykavaz],
      [UnitTypes.Vestnick]: [UWater.getAidahar],
      [UnitTypes.Idol]: [UWater.getBalor, UWater.getVodyanoi]
    },
    [Biom.Mash]: {
      [UnitTypes.Prispeshnick]: [UMash.getMohovik],
      [UnitTypes.Ispolin]: [UMash.getDrekavaz],
      [UnitTypes.Vestnick]: [UMash.getMavka],
      [UnitTypes.Idol]: [UMash.getBegemot, UMash.getFekst]
    },
    [Biom.Geysers]: {
      [UnitTypes.Prispeshnick]: [UGeysers.getHimera],
      [UnitTypes.Ispolin]: [UGeysers.getAly],
      [UnitTypes.Vestnick]: [UGeysers.getRarog],
      [UnitTypes.Idol]: [UGeysers.getCherufe, UGeysers.getJarPtiza]
    }
  }

  return unitsTree[biom][type][pos](id, playerId, level, pos)
}

export const UnitAbilities = {
  onMove: [],
  statUpdates: {
    attack: [],
    defence: []
  },
  keywords: [],
  actions: [],
  onDeath: []
}


