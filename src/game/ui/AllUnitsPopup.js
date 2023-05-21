import './AllUnitsPopup.css';
import {
  Biom,
  playerColors,
  UnitKeywords,
  UnitSkills,
  UnitStatus,
  UnitTypes
} from "../helpers/Constants";
import {USteppe} from "../units/Steppe";
import React, {useState} from "react";
import {UForest} from "../units/Forest";
import {UMountains} from "../units/Mountains";
import {UDesert} from "../units/Desert";
import {UTundra} from "../units/Tundra";
import {UJungle} from "../units/Jungle";
import {UWater} from "../units/Water";
import {UMash} from "../units/Mash";
import {UGeysers} from "../units/Geysers";

const AllUnitsPopup = (data) => {
  const props = data.props;
  const player = props.G.players.find(p => p.id === +props.playerID);
  const [isPopupAllUnitsOpen, setIsPopupAllUnitsOpen] = data.info

  const popupStyle = {
    display: isPopupAllUnitsOpen ? "block" : "none",
  };

  const handleClose = () => {
    setIsPopupAllUnitsOpen(false)
  }

  const renderStarsCreated = (count) => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      if (count-1 >= i) {
        stars.push(<i key={i} className="star star-active"></i>);
      } else {
        stars.push(<i key={i} className="star star-sad"></i>);
      }
    }
    return stars;
  };

  const getCreaturesByBiom = (biom, playerId) => {
    if (biom === Biom.Steppe) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{Biom.Steppe}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">Тип</div>
            <div className="popup-creature-header popup-creature-name">Ім'я</div>
            <div className="popup-creature-header popup-creature-damage">Сила</div>
            <div className="popup-creature-header popup-creature-heals">Життя</div>
            <div className="popup-creature-header popup-creature-initiative">Ініціатива</div>
            <div className="popup-creature-header popup-creature-abilities">Навички</div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{USteppe.urkaName}</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals">7</div>
            <div className="popup-creature-initiative">4</div>
            <div className="popup-creature-abilities">При атаці <Tooltip text="Істота не може рухатися доки не пропустить хід">зупиняє</Tooltip> ціль. <Tooltip text="Ворожа істота має атакувати тільки цю істоту при виборі цілей">Головна ціль</Tooltip>. <Tooltip text="Заряди: 2, Дальність: 1, Фаза: Пересування">
              Активно</Tooltip>: Після завершення руху може пройти на одну клітину далі у тому ж напрямку або пересунути активну ворожу істоту, ігноруючи <Tooltip text="Зона Контролю: істоти не можуть пресуватися на клітини відходячи від ворога поруч">ЗК</Tooltip></div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{USteppe.viyName}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">10</div>
            <div className="popup-creature-initiative">2</div>
            <div className="popup-creature-abilities">Миттєво вбиває істоту при атаці, якщо союзна істота знаходиться поруч з цілью та {USteppe.viyName}.
              Якщо ціль - {UnitTypes.Idol}, то атакує з силою у розмірі 50% від початкового життя цілі</div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{UnitTypes.Prispeshnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{USteppe.polydnicaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{USteppe.polydnicaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{USteppe.polydnicaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>6</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>6</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>Якщо 2 {USteppe.polydnicaName} оточують ворожу істоту (окрім {UnitTypes.Idol}) з протилежних боків, то ціль миттєво гине</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 7}}>..., <Tooltip text="Атака та ініціатива не опускаються нижче базових значень">{UnitSkills.Wholeness}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 8}}>..., При атаці <Tooltip text="Істота не може рухатися доки не пропустить хід">зупиняє</Tooltip> ціль</div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{UnitTypes.Prominkor}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{USteppe.maraName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{USteppe.maraName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{USteppe.maraName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}><Tooltip text="Не отримує відповіді після атаки">{UnitKeywords.Sneaky}</Tooltip>, <Tooltip text="Діє на ворожих істот у радіусі 1">{UnitSkills.MaraAura}</Tooltip>: -2 до ініціативи</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}><Tooltip text="Не отримує відповіді після атаки">{UnitKeywords.Sneaky}</Tooltip>, <Tooltip text="Діє на ворожих істот у радіусі 1">{UnitSkills.MaraAura}</Tooltip>: -3 до ініціативи</div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{UnitTypes.Vestnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{USteppe.letavicaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{USteppe.letavicaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{USteppe.letavicaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>5</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}><Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip>, <Tooltip text="Може нанести урон по істоті (50% сили атаки, радіус 2). Не можна здійснити рейд, якщо поруч є ворог чи скрізь союзну істоту">
              {UnitSkills.Raid}</Tooltip>, <Tooltip text="Під час рейду може відняти додаткове життя та додати його союзній до цілі істоті у радіусі 1">{UnitKeywords.ReplaceHealsRaid}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 15}}>..., При вбивстві істоти {USteppe.letavicaName} отримає бонус до характеристик в залежності від типу цілі:
              {UnitTypes.Prispeshnick}: +1 життя, {UnitTypes.Prominkor}: +1 ініціатива, {UnitTypes.Vestnick}:+1 сила, {UnitTypes.Idol}:+1 до всіх параметрів</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}>..., При вбивстві істоти {USteppe.letavicaName} отримає бонус до характеристик в залежності від типу цілі:
              {UnitTypes.Prispeshnick}: +2 життя, {UnitTypes.Prominkor}: +2 ініціатива, {UnitTypes.Vestnick}:+2 сила, {UnitTypes.Idol}:+2 до всіх параметрів</div>
          </div>
        </>
      )
    }

    if (biom === Biom.Forest) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{Biom.Forest}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">Тип</div>
            <div className="popup-creature-header popup-creature-name">Ім'я</div>
            <div className="popup-creature-header popup-creature-damage">Сила</div>
            <div className="popup-creature-header popup-creature-heals">Життя</div>
            <div className="popup-creature-header popup-creature-initiative">Ініціатива</div>
            <div className="popup-creature-header popup-creature-abilities">Навички</div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UForest.abasuName}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">6</div>
            <div className="popup-creature-initiative">4</div>
            <div className="popup-creature-abilities">Отримує заряд, якщо істота вмирає у радіусі 2. <Tooltip text="Дальність: ∞, Фаза: будь-яка, Не завершує хід">
              Активно</Tooltip>: відновлює 2 життя або насилає <Tooltip text="-1 сила, -1 ініціатива, не стакається">прокляття</Tooltip> на істоту (окрім {UnitTypes.Idol})</div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UForest.chygaysterName}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">7</div>
            <div className="popup-creature-initiative">5</div>
            <div className="popup-creature-abilities">При атаці істота отримує <Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip>, <Tooltip text="Істота втрачає 1 життя на початку кожної фази пересування">
              {UnitStatus.Poison}</Tooltip>, <Tooltip text="Істота може атакувати/рейдити тільки того, хто наклав помсту">{UnitStatus.Vengeance}</Tooltip>. Може рухатись на 2 клітини,
              НЕ ігноруючи <Tooltip text="Зона Контролю: істоти не можуть пресуватися на клітини відходячи від ворога поруч">ЗК</Tooltip></div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{UnitTypes.Prispeshnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{UForest.lesavkaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{UForest.lesavkaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{UForest.lesavkaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>6</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>Може перемістити істоту після атаки на вільну клітину поруч з {UForest.lesavkaName} ігноруючи <Tooltip text="Зона Контролю: істоти не можуть пресуватися на клітини відходячи від ворога поруч">ЗК</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 7}}><Tooltip text="Знижує ініціативу цілі на 1 при атаці">{UnitSkills.DecreaseInitiative}</Tooltip></div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{UnitTypes.Prominkor}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{UForest.bereginyaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{UForest.bereginyaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{UForest.bereginyaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>6</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}><Tooltip text="Зарядів: 2, Дальність: ∞, Фаза: будь-яка, Завершує хід">Активно</Tooltip>: відновлює істоті (окрім {UnitTypes.Idol}) до 2 життів. <Tooltip text="Не отримує відповіді після атаки">{UnitKeywords.Sneaky}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}><Tooltip text="Зарядів: 3, Дальність: ∞, Фаза: будь-яка, Завершує хід">Активно</Tooltip>: відновлює істоті (окрім {UnitTypes.Idol}) до 2 життів. <Tooltip text="Не отримує відповіді після атаки">{UnitKeywords.Sneaky}</Tooltip>. <Tooltip text="Рандомно додає 1 силу до істоти поруч (окрім Ідола) на початку битви">{UnitKeywords.Support}</Tooltip></div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{UnitTypes.Vestnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{UForest.sirinName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{UForest.sirinName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{UForest.sirinName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>6</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}><Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip>, <Tooltip text="Може нанести урон по істоті (50% сили атаки, радіус 2). Не можна здійснити рейд, якщо поруч є ворог чи скрізь союзну істоту">
              {UnitSkills.Raid}</Tooltip>, <Tooltip text="Не може здійснювати Рейд, якщо поруч є 2 союзних істоти">{UnitKeywords.RestrictedRaid}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}><Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip>, <Tooltip text="Може нанести урон по істоті (50% сили атаки, радіус 2). Не можна здійснити рейд, якщо поруч є ворог чи скрізь союзну істоту">
              {UnitSkills.Raid}</Tooltip>, <Tooltip text="Може здійснювати рейд скрізь союзника та якщо поруч є ворог">{UnitKeywords.AbsoluteRaid}</Tooltip></div>
          </div>
        </>
        )
    }

    if (biom === Biom.Mountains) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{Biom.Mountains}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">Тип</div>
            <div className="popup-creature-header popup-creature-name">Ім'я</div>
            <div className="popup-creature-header popup-creature-damage">Сила</div>
            <div className="popup-creature-header popup-creature-heals">Життя</div>
            <div className="popup-creature-header popup-creature-initiative">Ініціатива</div>
            <div className="popup-creature-header popup-creature-abilities">Навички</div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UMountains.psoglavName}</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals">6</div>
            <div className="popup-creature-initiative">4</div>
            <div className="popup-creature-abilities"><Tooltip text="Зарядів: 2, Фаза: будь-яка, Не завершує хід">Активно</Tooltip>:
              відновлює життя та отримує <Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip> на наступну фазу битви</div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UMountains.halaName}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">8</div>
            <div className="popup-creature-initiative">5</div>
            <div className="popup-creature-abilities"><Tooltip text="Не отримує урону від Рейду">{UnitSkills.RaidBlock}</Tooltip>. <Tooltip text='Діє на союзних істот у радіусі 1'>{UnitSkills.HalaAura}</Tooltip>: Дає навичок {UnitSkills.RaidBlock}</div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{UnitTypes.Prispeshnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{UMountains.beytirName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{UMountains.beytirName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{UMountains.beytirName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>6</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>7</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>Наносить 1 урон при атаці кожній ворожій істоті поріч з ціллю по ланцюжку, якщо не рухався у минулій фазі пересування</div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{UnitTypes.Prominkor}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{UMountains.garzykName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{UMountains.garzykName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{UMountains.garzykName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>5</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}><Tooltip text="Не отримує відповіді після атаки">{UnitKeywords.Sneaky}</Tooltip>, <Tooltip text="Атака та ініціатива не опускаються нижче базових значень">{UnitSkills.Wholeness}</Tooltip>, <Tooltip text="Не отримує урону від Рейду">{UnitSkills.RaidBlock}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}>..., <Tooltip text="Зарядів: 1, Дальність: 2, Фаза: пересування, Завершує хід">Активно</Tooltip>: наносить урон рівний силі атаки та отримує статус <Tooltip text="Істота не може атакувати/відповідати/рейдити">
              {UnitStatus.Unarmed}</Tooltip> на 2 ходи.</div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{UnitTypes.Vestnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{UMountains.veshizaSorokaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{UMountains.veshizaSorokaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{UMountains.veshizaSorokaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}><Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip>, <Tooltip text="Може нанести урон по істоті (50% сили атаки, радіус 2). Не можна здійснити рейд, якщо поруч є ворог чи скрізь союзну істоту">
              {UnitSkills.Raid}</Tooltip>, {UnitKeywords.NoObstaclesRaid}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 15}}>..., <Tooltip text="Зарядів: 1, Дальність: ∞, Фаза: будь-яка, Завершує хід">Активно</Tooltip>: може поміняти місцями поруч розташованих союзну та ворожу істоту (окрім {UnitTypes.Idol})
            ігноруючи <Tooltip text="Зона Контролю: істоти не можуть пресуватися на клітини відходячи від ворога поруч">ЗК</Tooltip></div>
          </div>
        </>
      )
    }

    if (biom === Biom.Desert) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{Biom.Desert}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">Тип</div>
            <div className="popup-creature-header popup-creature-name">Ім'я</div>
            <div className="popup-creature-header popup-creature-damage">Сила</div>
            <div className="popup-creature-header popup-creature-heals">Життя</div>
            <div className="popup-creature-header popup-creature-initiative">Ініціатива</div>
            <div className="popup-creature-header popup-creature-abilities">Навички</div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UDesert.sfinksName}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">12</div>
            <div className="popup-creature-initiative">4</div>
            <div className="popup-creature-abilities"><Tooltip text="Не отримує відповіді після атаки">{UnitKeywords.Sneaky}</Tooltip>, Отримує в 2 рази більше урону, якщо у скривдника більше життя</div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UDesert.vasiliskName}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">8</div>
            <div className="popup-creature-initiative">4</div>
            <div className="popup-creature-abilities">При атаці істота отримує <Tooltip text="Істота втрачає 1 життя на початку кожної фази пересування">{UnitStatus.Poison}</Tooltip>
              . <Tooltip text="Атака завдає урон по істотам праворуч та ліворуч від цілі">{UnitSkills.RoundDamage}</Tooltip></div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{UnitTypes.Prispeshnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{UDesert.amfisbenaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{UDesert.amfisbenaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{UDesert.amfisbenaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>Завжди відповідає на атаку (навіть при смерті)</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 7}}>..., Відповідь у повну силу</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 8}}>..., Зменшує урон від істот типу {UnitTypes.Vestnick} на 1</div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{UnitTypes.Prominkor}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{UDesert.obajifoName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{UDesert.obajifoName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{UDesert.obajifoName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>6</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>6</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}><Tooltip text="Не отримує відповіді після атаки">{UnitKeywords.Sneaky}</Tooltip>, <Tooltip text="Діє на союзних істот у радіусі 1">{UnitSkills.ObajifoAura}</Tooltip>: +1 до ініціативи</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}>..., <Tooltip text="Отримує 1 життя при атаці">{UnitSkills.HealOnAttack}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 12}}>..., <Tooltip text="Рандомно додає 1 силу до істоти поруч (окрім Ідола) на початку битви">{UnitKeywords.Support}</Tooltip></div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{UnitTypes.Vestnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{UDesert.adzeName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{UDesert.adzeName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{UDesert.adzeName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>3</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}><Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip>, <Tooltip text="Може нанести урон по істоті (50% сили атаки, радіус 2). Не можна здійснити рейд, якщо поруч є ворог чи скрізь союзну істоту">
              {UnitSkills.Raid}</Tooltip>, <Tooltip text="Під час рейду може відняти додаткове життя та додати його союзній до цілі істоті у радіусі 1">{UnitKeywords.ReplaceHealsRaid}</Tooltip>, Якщо {UDesert.adzeName} поранений, то будь-який урон у фазі битви вбиває його</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 15}}>..., <Tooltip text="Рейд отрумує +1 урону, але Адзе втрачає 1 життя">{UnitKeywords.AdditionalSacrificeRaid}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}>..., <Tooltip text="Атака та ініціатива не опускаються нижче базових значень">{UnitSkills.Wholeness}</Tooltip></div>
          </div>
        </>
      )
    }

    if (biom === Biom.Tundra) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{Biom.Tundra}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">Тип</div>
            <div className="popup-creature-header popup-creature-name">Ім'я</div>
            <div className="popup-creature-header popup-creature-damage">Сила</div>
            <div className="popup-creature-header popup-creature-heals">Життя</div>
            <div className="popup-creature-header popup-creature-initiative">Ініціатива</div>
            <div className="popup-creature-header popup-creature-abilities">Навички</div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UTundra.medvedOborotenName}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">8</div>
            <div className="popup-creature-initiative">3</div>
            <div className="popup-creature-abilities">Отримає -1 до будь-якого урону, якщо урон > 1. <Tooltip text="Заряди: 1, Фаза: пересування, Завершує хід">
              Активно</Tooltip>: додає +2 сили для своєї наступної атаки/відповіді</div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UTundra.marenaName}</div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-heals">10</div>
            <div className="popup-creature-initiative">1</div>
            <div className="popup-creature-abilities">Наносить 1 урон при атаці кожній ворожій істоті поріч з ціллю по ланцюжку, якщо не рухався у минулій фазі пересування. При атаці істота отримує <Tooltip text="Істота не може відповідати на атаку">
              {UnitKeywords.Unfocused}</Tooltip>, <Tooltip text="Істота не може рухатися доки не пропустить хід">{UnitStatus.Freeze}</Tooltip>. <Tooltip text="Отримує 1 життя при атаці">
              {UnitSkills.HealOnAttack}</Tooltip>. <Tooltip text="Не отримує урону від Рейду">{UnitSkills.RaidBlock}</Tooltip></div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{UnitTypes.Prispeshnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{UTundra.ledyanoyJackName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{UTundra.ledyanoyJackName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{UTundra.ledyanoyJackName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>7</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>3</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}><Tooltip text="Не отримує урону з вибраного у фазі розташування боку">{UnitSkills.BlockDamage}</Tooltip></div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{UnitTypes.Prominkor}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{UTundra.bonakonName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{UTundra.bonakonName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{UTundra.bonakonName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>5</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}><Tooltip text="Не отримує відповіді після атаки">{UnitKeywords.Sneaky}</Tooltip>, <Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip>.
            Отримує +1 до сили коли поранився (одноразово)</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}>..., <Tooltip text="Рандомно додає 1 силу до істоти поруч (окрім Ідола) на початку битви">{UnitKeywords.Support}</Tooltip></div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{UnitTypes.Vestnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{UTundra.planetnickName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{UTundra.planetnickName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{UTundra.planetnickName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>3</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}><Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip>, <Tooltip text="Може нанести урон по істоті (50% сили атаки, радіус 2). Не можна здійснити рейд, якщо поруч є ворог чи скрізь союзну істоту">
              {UnitSkills.Raid}</Tooltip>, <Tooltip text="Знижує ініціативу цілі на 1 при атаці/рейді">{UnitSkills.DecreaseInitiative}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 15}}>..., Може рухатись на 2 клітини, НЕ ігноруючи <Tooltip text="Зона Контролю: істоти не можуть пресуватися на клітини відходячи від ворога поруч">ЗК</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}>..., <Tooltip text="Атака та ініціатива не опускаються нижче базових значень">{UnitSkills.Wholeness}</Tooltip></div>
          </div>
        </>
      )
    }

    if (biom === Biom.Jungle) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{Biom.Jungle}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">Тип</div>
            <div className="popup-creature-header popup-creature-name">Ім'я</div>
            <div className="popup-creature-header popup-creature-damage">Сила</div>
            <div className="popup-creature-header popup-creature-heals">Життя</div>
            <div className="popup-creature-header popup-creature-initiative">Ініціатива</div>
            <div className="popup-creature-header popup-creature-abilities">Навички</div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UJungle.elokoName}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">8</div>
            <div className="popup-creature-initiative">4</div>
            <div className="popup-creature-abilities"><Tooltip text="Заряди: 2, Дальність: ∞, Фаза: пересування, Не завершує хід">Активно</Tooltip>: знижує ініціативу вибраної цілі на 3 та ціль отримує статус <Tooltip text="Істота може атакувати/рейдити тільки того, хто наклав помсту">{UnitStatus.Vengeance}</Tooltip></div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UJungle.adjatarName}</div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-heals">10</div>
            <div className="popup-creature-initiative">5</div>
            <div className="popup-creature-abilities"><Tooltip text="Істоти мають атакувати головну ціль у першу чергу">{UnitKeywords.MainTarget}</Tooltip>, Повертає половину урону ворожим істотам (округлення до меньшої сторони)</div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{UnitTypes.Prispeshnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{UJungle.blemmiiName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{UJungle.blemmiiName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{UJungle.blemmiiName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>6</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>6</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>7</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}><Tooltip text="Атака та ініціатива не опускаються нижче базових значень">{UnitSkills.Wholeness}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 7}}>..., <Tooltip text="Не отримує урону від Рейду">{UnitSkills.RaidBlock}</Tooltip></div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{UnitTypes.Prominkor}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{UJungle.petsyhosName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{UJungle.petsyhosName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{UJungle.petsyhosName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>6</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>6</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}><Tooltip text="Не отримує відповіді після атаки">{UnitKeywords.Sneaky}</Tooltip>, при атаці ціль отримує статус <Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip></div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{UnitTypes.Vestnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{UJungle.kaieryName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{UJungle.kaieryName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{UJungle.kaieryName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>5</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}><Tooltip text="Може нанести урон по істоті (50% сили атаки, радіус 2). Не можна здійснити рейд, якщо поруч є ворог чи скрізь союзну істоту">
              {UnitSkills.Raid}</Tooltip>, <Tooltip text="Не отримує урону з вибраного у фазі розташування боку">{UnitSkills.BlockDamage}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}><Tooltip text="Заряди: 1, Фаза: пересування, Завершує хід">Активно</Tooltip>: додає +2 сили для своєї наступної атаки/рейду/відповіді</div>
          </div>
        </>
      )
    }

    if (biom === Biom.Water) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{Biom.Water}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">Тип</div>
            <div className="popup-creature-header popup-creature-name">Ім'я</div>
            <div className="popup-creature-header popup-creature-damage">Сила</div>
            <div className="popup-creature-header popup-creature-heals">Життя</div>
            <div className="popup-creature-header popup-creature-initiative">Ініціатива</div>
            <div className="popup-creature-header popup-creature-abilities">Навички</div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UWater.balorName}</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals">8</div>
            <div className="popup-creature-initiative">1</div>
            <div className="popup-creature-abilities">Може рухатись на 2 клітини, ІГНОРУЮЧИ <Tooltip text="Зона Контролю: істоти не можуть пресуватися на клітини відходячи від ворога поруч">ЗК</Tooltip>.
            Миттєве вбивство істоти (окрім {UnitTypes.Idol}) при відповіді. Отримує у 2 рази більше урону, якщо ворожа істота (окрім {UnitTypes.Idol}) першою наблизалися перед боєм</div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UWater.vodyanoiName}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">7</div>
            <div className="popup-creature-initiative">5</div>
            <div className="popup-creature-abilities"><Tooltip text="Діє на ворожих істот у радіусі 1">{UnitSkills.LowHealsAura}</Tooltip>: віднімає у істот 1 життя, але не вбиває. <Tooltip text="Заряди: ∞, Дальність: 1, Фаза: бій, Завершує хід">
              Активно</Tooltip>: після атаки може перекинути істоту на клітку позаду, ігноруючи <Tooltip text="Зона Контролю: істоти не можуть пресуватися на клітини відходячи від ворога поруч">ЗК</Tooltip></div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{UnitTypes.Prispeshnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{UWater.lerneyskiyRakName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{UWater.lerneyskiyRakName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{UWater.lerneyskiyRakName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>1</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>1</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>1</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>1</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>1</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>1</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>Завжди коштує 3✾</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 7}}>..., Якщо 2 {UWater.lerneyskiyRakName} оточують ворожу істоту (окрім {UnitTypes.Idol}) з протилежних боків, то ціль миттєво гине</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 8}}>..., Миттєво вбиває істоту при атаці, якщо союзна істота знаходиться поруч з цілью та {UWater.lerneyskiyRakName}.
              Якщо ціль - {UnitTypes.Idol}, то атакує з силою у розмірі 50% від початкового життя цілі</div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{UnitTypes.Prominkor}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{UWater.bykavazName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{UWater.bykavazName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{UWater.bykavazName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>5</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}><Tooltip text="Не отримує відповіді після атаки">{UnitKeywords.Sneaky}</Tooltip>, <Tooltip text="Рандомно додає 1 силу до істоти поруч (окрім Ідола) на початку битви">{UnitKeywords.Support}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}>..., При атаці ціль отримує статус <Tooltip text="Істота миттєво завершує хід та пропускає хід у наступній фазі пересування">{UnitStatus.Stun}</Tooltip></div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{UnitTypes.Vestnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{UWater.aidaharName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{UWater.aidaharName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{UWater.aidaharName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>3</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}><Tooltip text="Може нанести урон по істоті (50% сили атаки, радіус 2). Не можна здійснити рейд, якщо поруч є ворог чи скрізь союзну істоту">
              {UnitSkills.Raid}</Tooltip>, <Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip>. <Tooltip text="Зарядів: 1, Дальність: ∞, Фаза: будь-яка, Завершує хід">Активно</Tooltip>: відновлює істоті (окрім {UnitTypes.Idol}) до 2 життів.</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}>..., <Tooltip text="Рандомно додає 1 силу до істоти поруч (окрім Ідола) на початку битви">{UnitKeywords.Support}</Tooltip></div>
          </div>
        </>
      )
    }

    if (biom === Biom.Mash) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{Biom.Mash}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">Тип</div>
            <div className="popup-creature-header popup-creature-name">Ім'я</div>
            <div className="popup-creature-header popup-creature-damage">Сила</div>
            <div className="popup-creature-header popup-creature-heals">Життя</div>
            <div className="popup-creature-header popup-creature-initiative">Ініціатива</div>
            <div className="popup-creature-header popup-creature-abilities">Навички</div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UMash.begemotName}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">8</div>
            <div className="popup-creature-initiative">3</div>
            <div className="popup-creature-abilities"><Tooltip text="Істоти мають атакувати головну ціль у першу чергу">{UnitKeywords.MainTarget}</Tooltip>. Завжди відповідає на атаку (навіть при смерті)</div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UMash.fekstName}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">7</div>
            <div className="popup-creature-initiative">4</div>
            <div className="popup-creature-abilities"><Tooltip text="Заряди: ∞, Фаза: пересування, Завершує хід">Активно</Tooltip>: може відновити життя, якщо поруч немає ворожих істот. <Tooltip text="Отримує 1 життя при атаці">
              {UnitSkills.HealOnAttack}</Tooltip>. <Tooltip text="Опір до всіх негативних ефектів, статусів та аур">{UnitSkills.BlockStatuses}</Tooltip>. При вбивстві істоти {UMash.fekstName} отримає бонус до характеристик в залежності від типу цілі:
              {UnitTypes.Prispeshnick}: +1 життя, {UnitTypes.Prominkor}: +1 ініціатива, {UnitTypes.Vestnick}:+1 сила, {UnitTypes.Idol}:+1 до всіх параметрів</div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{UnitTypes.Prispeshnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{UMash.mohovikName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{UMash.mohovikName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{UMash.mohovikName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>Може рухатись на 2 клітини, ІГНОРУЮЧИ <Tooltip text="Зона Контролю: істоти не можуть пресуватися на клітини відходячи від ворога поруч">ЗК</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 7}}>..., Завжди відповідає на атаку (навіть при смерті)</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 8}}>..., <Tooltip text="Не отримує відповіді після атаки">{UnitKeywords.Sneaky}</Tooltip></div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{UnitTypes.Prominkor}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{UMash.drekavazName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{UMash.drekavazName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{UMash.drekavazName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>6</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>6</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}><Tooltip text="Не отримує відповіді після атаки">{UnitKeywords.Sneaky}</Tooltip>. При смерті усі ворожі істоти поруч отримують
              статус <Tooltip text="Істота не може атакувати/відповідати/рейдити">{UnitStatus.Unarmed}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}>..., <Tooltip text="Рандомно додає 1 силу до істоти поруч (окрім Ідола) на початку битви">{UnitKeywords.Support}</Tooltip></div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{UnitTypes.Vestnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{UMash.mavkaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{UMash.mavkaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{UMash.mavkaName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}><Tooltip text="Може нанести урон по істоті (50% сили атаки, радіус 2). Не можна здійснити рейд, якщо поруч є ворог чи скрізь союзну істоту">
              {UnitSkills.Raid}</Tooltip>, <Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip>. При атаці/рейді ціль отримує статус <Tooltip text="Істота може атакувати/рейдити тільки того, хто наклав помсту">{UnitStatus.Vengeance}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 15}}>..., При рейді ціль отримує статус <Tooltip text="Істота втрачає 1 життя на початку кожної фази пересування">{UnitStatus.Poison}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}>..., <Tooltip text="Зарядів: 1, Дальність: ∞, Фаза: будь-яка, Завершує хід">Активно</Tooltip>: може поміняти місцями поруч розташованих союзну та ворожу істоту (окрім {UnitTypes.Idol})
              ігноруючи <Tooltip text="Зона Контролю: істоти не можуть пресуватися на клітини відходячи від ворога поруч">ЗК</Tooltip></div>
          </div>
        </>
      )
    }

    if (biom === Biom.Geysers) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{Biom.Geysers}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">Тип</div>
            <div className="popup-creature-header popup-creature-name">Ім'я</div>
            <div className="popup-creature-header popup-creature-damage">Сила</div>
            <div className="popup-creature-header popup-creature-heals">Життя</div>
            <div className="popup-creature-header popup-creature-initiative">Ініціатива</div>
            <div className="popup-creature-header popup-creature-abilities">Навички</div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UGeysers.cherufeName}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">5</div>
            <div className="popup-creature-initiative">5</div>
            <div className="popup-creature-abilities"><Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip>. <Tooltip text="Заряди: 3, Дальність: ∞, Фаза: будь-яка, Завершує хід">
              Активно</Tooltip>: одноразово може спалити істоту, віднімаючи в неї 1 життя та 1 силу</div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{UnitTypes.Idol}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{UGeysers.jarPtizaName}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">7</div>
            <div className="popup-creature-initiative">5</div>
            <div className="popup-creature-abilities"><Tooltip text="Зарядів: 3, Дальність: ∞, Фаза: будь-яка, Завершує хід">Активно</Tooltip>: відновлює істоті (окрім {UnitTypes.Idol}) до 2 життів. При вбивстві
              істоти приностить додатково 2✾. При атаці/відповіді урон отримує ще й істота позаду цілі. <Tooltip text="Опір до всіх негативних ефектів, статусів та аур">{UnitSkills.BlockStatuses}</Tooltip></div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{UnitTypes.Prispeshnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{UGeysers.himeraName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{UGeysers.himeraName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{UGeysers.himeraName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>6</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>6</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>При атаці/відповіді урон отримує ще й істота позаду цілі.</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 7}}>Отримує +1 до сили коли поранився (одноразово)</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 8}}>..., <Tooltip text="Атака завдає 1 урон по істотам праворуч та ліворуч від цілі">{UnitSkills.RoundDamage}</Tooltip></div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{UnitTypes.Prominkor}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{UGeysers.alyName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{UGeysers.alyName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{UGeysers.alyName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>5</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}><Tooltip text="Діє на ворожих істот у радіусі 1">{UnitSkills.UnfocusedAura}</Tooltip>: дає ворожим істотам статус <Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip>.</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}>..., <Tooltip text="Рандомно додає 1 силу до істоти поруч (окрім Ідола) на початку битви">{UnitKeywords.Support}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 12}}>..., Відповідь у повну силу</div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{UnitTypes.Vestnick}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{UGeysers.rarogName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{UGeysers.rarogName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{UGeysers.rarogName} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}><Tooltip text="Може нанести урон по істоті (50% сили атаки, радіус 2). Не можна здійснити рейд, якщо поруч є ворог чи скрізь союзну істоту">
              {UnitSkills.Raid}</Tooltip>, <Tooltip text="Істота не може відповідати на атаку">{UnitKeywords.Unfocused}</Tooltip>. При атаці ціль отримує статус <Tooltip text="Істота втрачає 1 життя на початку кожної фази пересування">{UnitStatus.Poison}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 15}}>..., <Tooltip text="Атака та ініціатива не опускаються нижче базових значень">{UnitSkills.Wholeness}</Tooltip></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}>..., При рейді ціль отримує статус <Tooltip text="Істота втрачає 1 життя на початку кожної фази пересування">{UnitStatus.Poison}</Tooltip></div>
          </div>
        </>
      )
    }
  }

  const playersBiomsList = [
    {biom: player.bioms[0], id: player.id},
    {biom: player.bioms[1], id: player.id}
  ];
  props.G.players.filter(p => p.id !== player.id).forEach(p => {
    playersBiomsList.push({biom: p.bioms[0], id: p.id});
    playersBiomsList.push({biom: p.bioms[1], id: p.id});
  })

  if (isPopupAllUnitsOpen) {
    return (
      <div className="creature-wiki-popup" style={popupStyle}>
        <button className="close-button" onClick={handleClose}>
          X
        </button>
        <div className="popup">
          <div className="biome-list" style={{marginBottom: 20}}>
            {playersBiomsList.map((biomData, i) => getCreaturesByBiom(biomData.biom, biomData.id))}
          </div>
        </div>
      </div>
    )
  } else {
    return (<></>)
  }

}

const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);

  const handleMouseEnter = () => {
    setShow(true);
  };

  const handleMouseLeave = () => {
    setShow(false);
  };



  return (
    <div className="tooltip-container">
      <span
        className="tooltip-text"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
      {show && <div className="tooltip">{text}</div>}
    </div>
  );
};

export default AllUnitsPopup;
