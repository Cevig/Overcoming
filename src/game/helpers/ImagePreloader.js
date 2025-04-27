import {useEffect} from 'react';
import {unitImgMap} from './UnitImg';
import {UForest} from '../units/Forest';
import {UDesert} from '../units/Desert';
import {UMash} from '../units/Mash';
import {UMountains} from '../units/Mountains';
import {USteppe} from '../units/Steppe';
import {UTundra} from '../units/Tundra';
import {UWater} from '../units/Water';
import {UGeysers} from "../units/Geysers";
import {UJungle} from "../units/Jungle";

const ImagePreloader = () => {
  useEffect(() => {
    // Collect all unit names from all biomes
    const unitNames = [
      // Forest units
      UForest.lesavkaName,
      UForest.bereginyaName,
      UForest.sirinName,
      UForest.abasuName,
      UForest.chygaysterName,

      // Desert units
      UDesert.amfisbenaName,
      UDesert.obajifoName,
      UDesert.adzeName,
      UDesert.sfinksName,
      UDesert.vasiliskName,

      // Mash units
      UMash.mohovikName,
      UMash.drekavazName,
      UMash.mavkaName,
      UMash.begemotName,
      UMash.fekstName,

      // Mountains units
      UMountains.beytirName,
      UMountains.garzykName,
      UMountains.veshizaSorokaName,
      UMountains.psoglavName,
      UMountains.halaName,

      // Steppe units
      USteppe.polydnicaName,
      USteppe.maraName,
      USteppe.letavicaName,
      USteppe.urkaName,
      USteppe.viyName,

      // Tundra units
      UTundra.ledyanoyJackName,
      UTundra.bonakonName,
      UTundra.planetnickName,
      UTundra.medvedOborotenName,
      UTundra.marenaName,

      // Water units
      UWater.lerneyskiyRakName,
      UWater.bykavazName,
      UWater.aidaharName,
      UWater.balorName,
      UWater.vodyanoiName,

      // Geysers units
      UGeysers.himeraName,
      UGeysers.alyName,
      UGeysers.rarogName,
      UGeysers.jarPtizaName,
      UGeysers.cherufeName,

      //Jungler units
      UJungle.blemmiiName,
      UJungle.petsyhosName,
      UJungle.kaieryName,
      UJungle.adjatarName,
      UJungle.elokoName,
    ];

    // Preload all unit images
    unitNames.forEach(unitName => {
      const img = new Image();
      img.src = unitImgMap(unitName);
    });
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default ImagePreloader;
