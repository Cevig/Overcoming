import {Biom} from "../helpers/Constants";
import {USteppe} from "./Steppe";
import {UForest} from "./Forest";
import {UMountains} from "./Mountains";
import {UDesert} from "./Desert";
import {UTundra} from "./Tundra";
import {UJungle} from "./Jungle";
import {UWater} from "./Water";
import {UMash} from "./Mash";
import {UGeysers} from "./Geysers";

export const UnitTypes = Object.freeze({
  Prispeshnick: "Prispeshnick",
  Ispolin: "Ispolin",
  Vestnick: "Vestnick",
  Idol: "Idol"
})

export const getCreature = (name, type, biom, id, power, heals, initiative, level, unitState, status = []) => ({
  id: id,
  name: name,
  type: type,
  biom: biom,
  power: power,
  heals: heals,
  initiative: initiative,
  level: level,
  unitState: unitState,
  status: status
})

export const getIdol = (name, biom, id, power, heals, initiative, unitState, status = []) => ({
  id: id,
  name: name,
  type: UnitTypes.Idol,
  biom: biom,
  power: power,
  heals: heals,
  initiative: initiative,
  unitState: unitState,
  status: status
})

export const getUnitState = (unitId, playerId, point = null, isClickable = true, isInGame = false, isInFight = false, skippedTurn = false) => ({
  unitId: unitId,
  playerId: playerId,
  point: point,
  isClickable: isClickable,
  isInGame: isInGame,
  isInFight: isInFight,
  skippedTurn: skippedTurn
})

export const createUnitObject = (...data) => {
  const [id, playerId, biom, type = UnitTypes.Idol, pos = 0, level = 1] = data
  const unitsTree = {
    [Biom.Steppe]: {
      [UnitTypes.Prispeshnick]: [USteppe.getPolydnica(id, playerId, level)],
      [UnitTypes.Ispolin]: [USteppe.getMara(id, playerId, level)],
      [UnitTypes.Vestnick]: [USteppe.getLetavica(id, playerId, level)],
      [UnitTypes.Idol]: [USteppe.getUrka(id, playerId), USteppe.getViy(id, playerId)]
    },
    [Biom.Forest]: {
      [UnitTypes.Prispeshnick]: [UForest.getLesavka(id, playerId, level)],
      [UnitTypes.Ispolin]: [UForest.getBereginya(id, playerId, level)],
      [UnitTypes.Vestnick]: [UForest.getSirin(id, playerId, level)],
      [UnitTypes.Idol]: [UForest.getAbasu(id, playerId), UForest.getChygayster(id, playerId)]
    },
    [Biom.Mountains]: {
      [UnitTypes.Prispeshnick]: [UMountains.getBeytir(id, playerId, level)],
      [UnitTypes.Ispolin]: [UMountains.getGarzyk(id, playerId, level)],
      [UnitTypes.Vestnick]: [UMountains.getVeshizaSoroka(id, playerId, level)],
      [UnitTypes.Idol]: [UMountains.getPsoglav(id, playerId), UMountains.getHala(id, playerId)]
    },
    [Biom.Desert]: {
      [UnitTypes.Prispeshnick]: [UDesert.getAmfisbena(id, playerId, level)],
      [UnitTypes.Ispolin]: [UDesert.getObajifo(id, playerId, level)],
      [UnitTypes.Vestnick]: [UDesert.getAdze(id, playerId, level)],
      [UnitTypes.Idol]: [UDesert.getSfinks(id, playerId), UDesert.getVasilisk(id, playerId)]
    },
    [Biom.Tundra]: {
      [UnitTypes.Prispeshnick]: [UTundra.getLedyanoyJack(id, playerId, level)],
      [UnitTypes.Ispolin]: [UTundra.getBonakon(id, playerId, level)],
      [UnitTypes.Vestnick]: [UTundra.getPlanetnick(id, playerId, level)],
      [UnitTypes.Idol]: [UTundra.getMedvedOboroten(id, playerId), UTundra.getMarena(id, playerId)]
    },
    [Biom.Jungle]: {
      [UnitTypes.Prispeshnick]: [UJungle.getBlemmii(id, playerId, level)],
      [UnitTypes.Ispolin]: [UJungle.getPetsyhos(id, playerId, level)],
      [UnitTypes.Vestnick]: [UJungle.getKaiery(id, playerId, level)],
      [UnitTypes.Idol]: [UJungle.getEpoko(id, playerId), UJungle.getAdjatar(id, playerId)]
    },
    [Biom.Water]: {
      [UnitTypes.Prispeshnick]: [UWater.getLerneyskiyRak(id, playerId, level)],
      [UnitTypes.Ispolin]: [UWater.getBykavaz(id, playerId, level)],
      [UnitTypes.Vestnick]: [UWater.getAidahar(id, playerId, level)],
      [UnitTypes.Idol]: [UWater.getBalor(id, playerId), UWater.getVodyanoi(id, playerId)]
    },
    [Biom.Mash]: {
      [UnitTypes.Prispeshnick]: [UMash.getMohovik(id, playerId, level)],
      [UnitTypes.Ispolin]: [UMash.getDrekavaz(id, playerId, level)],
      [UnitTypes.Vestnick]: [UMash.getMavka(id, playerId, level)],
      [UnitTypes.Idol]: [UMash.getBegemot(id, playerId), UMash.getFekst(id, playerId)]
    },
    [Biom.Geysers]: {
      [UnitTypes.Prispeshnick]: [UGeysers.getHimera(id, playerId, level)],
      [UnitTypes.Ispolin]: [UGeysers.getAly(id, playerId, level)],
      [UnitTypes.Vestnick]: [UGeysers.getRarog(id, playerId, level)],
      [UnitTypes.Idol]: [UGeysers.getCherufe(id, playerId), UGeysers.getJarPtiza(id, playerId)]
    }
  }

  return unitsTree[biom][type][pos]
}
