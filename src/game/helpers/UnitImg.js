import polydnica from "../ui/Img/steppe/polydnica.png"
import mara from "../ui/Img/steppe/mara.png"
import letavica from "../ui/Img/steppe/letavica.png"
import urka from "../ui/Img/steppe/urka.png"
import viy from "../ui/Img/steppe/viy.png"

import lesavka from "../ui/Img/forest/lesavka.png"
import beregyna from "../ui/Img/forest/beregyna.png"
import sirin from "../ui/Img/forest/sirin.png"
import abasu from "../ui/Img/forest/abasu.png"
import chygayster from "../ui/Img/forest/chygayster.png"

import beityr from "../ui/Img/mountains/beityr.png"
import garcyk from "../ui/Img/mountains/garcyk.png"
import veshicaSoroka from "../ui/Img/mountains/veshica-soroka.png"
import psoglav from "../ui/Img/mountains/psoglav.png"
import hala from "../ui/Img/mountains/hala.png"

import amfisbena from "../ui/Img/desert/amfisbena.png"
import obayifo from "../ui/Img/desert/obayifo.png"
import adze from "../ui/Img/desert/adze.png"
import sfinks from "../ui/Img/desert/sfinks.png"
import vasilisk from "../ui/Img/desert/vasilisk.png"

import ledyanoy from "../ui/Img/tundra/ledyanoy.png"
import bonakon from "../ui/Img/tundra/bonakon.png"
import planetnik from "../ui/Img/tundra/planetnik.png"
import medved from "../ui/Img/tundra/medved.png"
import marena from "../ui/Img/tundra/marena.png"

import blemii from "../ui/Img/jungle/blemii.png"
import petsyhos from "../ui/Img/jungle/petsyhos.png"
import kayeri from "../ui/Img/jungle/kayeri.png"
import eloko from "../ui/Img/jungle/eloko.png"
import adjatar from "../ui/Img/jungle/adjatar.png"

import rak from "../ui/Img/water/rak.png"
import bykavaz from "../ui/Img/water/bykavaz.png"
import ajdahar from "../ui/Img/water/ajdahar.png"
import balor from "../ui/Img/water/balor.png"
import vodyanoy from "../ui/Img/water/vodyanoy.png"

import mohovik from "../ui/Img/mash/mohovik.png"
import drakaz from "../ui/Img/mash/drakaz.png"
import mavka from "../ui/Img/mash/mavka.png"
import begemot from "../ui/Img/mash/begemot.png"
import fecst from "../ui/Img/mash/fecst.png"

import himera from "../ui/Img/geyzer/himera.png"
import alu from "../ui/Img/geyzer/alu.png"
import rarog from "../ui/Img/geyzer/rarog.png"
import cherufe from "../ui/Img/geyzer/cherufe.png"
import ptica from "../ui/Img/geyzer/jar-ptica.png"

import {USteppe} from "../units/Steppe";
import {UForest} from "../units/Forest";
import {UMountains} from "../units/Mountains";
import {UDesert} from "../units/Desert";
import {UTundra} from "../units/Tundra";
import {UJungle} from "../units/Jungle";
import {UWater} from "../units/Water";
import {UMash} from "../units/Mash";
import {UGeysers} from "../units/Geysers";

export const unitImgMap = (name) => {
  const map = {
    [USteppe.polydnicaName]: polydnica,
    [USteppe.maraName]: mara,
    [USteppe.letavicaName]: letavica,
    [USteppe.urkaName]: urka,
    [USteppe.viyName]: viy,

    [UForest.lesavkaName]: lesavka,
    [UForest.bereginyaName]: beregyna,
    [UForest.sirinName]: sirin,
    [UForest.abasuName]: abasu,
    [UForest.chygaysterName]: chygayster,

    [UMountains.beytirName]: beityr,
    [UMountains.garzykName]: garcyk,
    [UMountains.veshizaSorokaName]: veshicaSoroka,
    [UMountains.psoglavName]: psoglav,
    [UMountains.halaName]: hala,

    [UDesert.amfisbenaName]: amfisbena,
    [UDesert.obajifoName]: obayifo,
    [UDesert.adzeName]: adze,
    [UDesert.sfinksName]: sfinks,
    [UDesert.vasiliskName]: vasilisk,

    [UTundra.ledyanoyJackName]: ledyanoy,
    [UTundra.bonakonName]: bonakon,
    [UTundra.planetnickName]: planetnik,
    [UTundra.medvedOborotenName]: medved,
    [UTundra.marenaName]: marena,

    [UJungle.blemmiiName]: blemii,
    [UJungle.petsyhosName]: petsyhos,
    [UJungle.kaieryName]: kayeri,
    [UJungle.elokoName]: eloko,
    [UJungle.adjatarName]: adjatar,

    [UWater.lerneyskiyRakName]: rak,
    [UWater.bykavazName]: bykavaz,
    [UWater.aidaharName]: ajdahar,
    [UWater.balorName]: balor,
    [UWater.vodyanoiName]: vodyanoy,

    [UMash.mohovikName]: mohovik,
    [UMash.drekavazName]: drakaz,
    [UMash.mavkaName]: mavka,
    [UMash.begemotName]: begemot,
    [UMash.fekstName]: fecst,

    [UGeysers.himeraName]: himera,
    [UGeysers.alyName]: alu,
    [UGeysers.rarogName]: rarog,
    [UGeysers.cherufeName]: cherufe,
    [UGeysers.jarPtizaName]: ptica,
  }
  return map[name]
}
