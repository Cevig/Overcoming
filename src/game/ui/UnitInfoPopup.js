import './UnitInfo.css';
import {unitImgMap} from "../helpers/UnitImg";
import React, {useState} from "react";
import {UnitKeywords, UnitSkills, UnitStatus} from "../helpers/Constants";

const UnitInfoPopup = (props) => {

  const [isPopupOpen, setIsPopupOpen, infoUnit, setInfoUnit] = props.info

  const popupStyle = {
    display: isPopupOpen ? "block" : "none",
  };

  const handleClose = () => {
    setInfoUnit(null)
    setIsPopupOpen(false)
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

  const getUnitAbilitiesString = () => {
    const skills = []
    for (const [key, value] of Object.entries(infoUnit.abilities)) {
      if (key !== 'keywords') {
        if (key === 'statUpdates') {
          infoUnit.abilities[key].attack.forEach(skill => {skills.push(skill)})
          infoUnit.abilities[key].defence.forEach(skill => {skills.push(skill)})
        } else {
          infoUnit.abilities[key].forEach(skill => {skills.push(skill)})
        }
      }
    }

    return skills.map((skill, i) => {

      if (skill.name === UnitSkills.Wholeness || skill === UnitSkills.Wholeness) {
        return (<><Tooltip text="Атака та ініціатива не опускаються нижче базових значень">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.Surround3 || skill === UnitSkills.Surround3) {
        return (<><Tooltip text="Вбиває ворожу істоту (окрім Ідола) коли 3 Полудниці опиняться поруч">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.BlockStatuses || skill === UnitSkills.BlockStatuses) {
        return (<><Tooltip text="Опір до всіх негативних ефектів, статусів та аур">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AddFreezeEffect || skill === UnitSkills.AddFreezeEffect) {
        return (<><Tooltip text="Істота не може рухатися доки не пропустить хід">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AddUnfocusedEffect || skill === UnitSkills.AddUnfocusedEffect) {
        return (<><Tooltip text="Істота не може відповідати на атаку">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AddPoisonEffect || skill === UnitSkills.AddPoisonEffect) {
        return (<><Tooltip text="Істота втрачає 1 життя на початку кожної фази пересування">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AddPoisonEffectOnRaid || skill === UnitSkills.AddPoisonEffectOnRaid) {
        return (<><Tooltip text="Істота втрачає 1 життя на початку кожної фази пересування">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AddStunEffect || skill === UnitSkills.AddStunEffect) {
        return (<><Tooltip text="Істота пропускає хід у наступній фазі пересування">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AddVengeanceEffect || skill === UnitSkills.AddVengeanceEffect) {
        return (<><Tooltip text="Істота може атакувати/рейдити тільки того, хто наклав помсту">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.MaraAura || skill === UnitSkills.MaraAura) {
        return (<><Tooltip text="Знижує ініціативу у ворожих істот у радіусі 1">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.LowHealsAura || skill === UnitSkills.LowHealsAura) {
        return (<><Tooltip text="-1 життя (не вбиває) у ворожих істот у радіусі 1">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.HalaAura || skill === UnitSkills.HalaAura) {
        return (<><Tooltip text="Союзні істоти поруч не отримують урону від рейду">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ObajifoAura || skill === UnitSkills.ObajifoAura) {
        return (<><Tooltip text="+1 до ініціативи у союзних істот у радіусі 1">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.UnfocusedAura || skill === UnitSkills.UnfocusedAura) {
        return (<><Tooltip text="Ворожі істоти у радіусі 1 не можуть відповідати на атаку">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.Raid || skill === UnitSkills.Raid) {
        return (<><Tooltip text="Може нанести урон по істоті (50% сили атаки, радіус 2). Не можна здійснити рейд, якщо поруч є ворог чи скрізь союзну істоту">{skill.name}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.LethalGrab || skill === UnitSkills.LethalGrab) {
        return (<><Tooltip text="Отримує бонус до характеристик при вбивстві">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.LethalBlow || skill === UnitSkills.LethalBlow) {
        return (<><Tooltip text="При смерті усі ворожі істоти у радіусі 1 не можуть наносити урон в цій битві">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.Urka || skill === UnitSkills.Urka) {
        return (<><Tooltip text="Може походити далі чи пересунути ворожу істоту">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.InstantKill || skill === UnitSkills.InstantKill) {
        return (<><Tooltip text="Миттєво вбиває істоту або завдає 50% урону Ідолу, якщо поруч союзна істота">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.InstantKillOnCounter || skill === UnitSkills.InstantKillOnCounter) {
        return (<><Tooltip text="Вбиває ворожу істоту (окрім Ідола) при відповіді">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.Lesavka || skill === UnitSkills.Lesavka) {
        return (<><Tooltip text="Може пересунути істоту після атаки">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ThrowOver || skill === UnitSkills.ThrowOver) {
        return (<><Tooltip text="Може перекинути істоту через себе після атаки">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.UtilizeDeath || skill === UnitSkills.UtilizeDeath) {
        return (<><Tooltip text="Отримує заряд при смерті істоти у радіусі 2">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.healAlly || skill === UnitSkills.healAlly) {
        return (<><Tooltip text="Відновити життя союзній істоті">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.abasuCurse || skill === UnitSkills.abasuCurse) {
        return (<><Tooltip text="Відновити собі життя чи знизити силу та ініціативу істоті">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.chainDamage || skill === UnitSkills.chainDamage) {
        return (<><Tooltip text="Якщо не рухався, то б'є усіх по ланцюжку">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.throwWeapon || skill === UnitSkills.throwWeapon) {
        return (<><Tooltip text="Нанести урон не у битві та втратити можливість атакувати">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.replaceUnits || skill === UnitSkills.replaceUnits) {
        return (<><Tooltip text="Поміняти місцями союзну та ворожу істоту, що стоять поруч">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.pauseToRecover || skill === UnitSkills.pauseToRecover) {
        return (<><Tooltip text="Відновити життя, але втратити можливість відповідати">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.NotMovedRecover || skill === UnitSkills.NotMovedRecover) {
        return (<><Tooltip text="Відновити життя, якщо поруч немає ворогів">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.RaidBlock || skill === UnitSkills.RaidBlock) {
        return (<><Tooltip text="Не отримує урону від рейду">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AntiVestnick || skill === UnitSkills.AntiVestnick) {
        return (<><Tooltip text="Знижує урон від Весників на 1">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ReduceDamage || skill === UnitSkills.ReduceDamage) {
        return (<><Tooltip text="При уроні більше 1 знижує урон по собі на 1">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.HealOnAttack || skill === UnitSkills.HealOnAttack) {
        return (<><Tooltip text="Отримує 1 життя при атаці">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.DeadlyDamage || skill === UnitSkills.DeadlyDamage) {
        return (<><Tooltip text="Вмирає, якщо отримає урон в пораненому стані">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.DoubleDamage || skill === UnitSkills.DoubleDamage) {
        return (<><Tooltip text="Отримує подвійний урон, якщо у ворога більше життя">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.DoubleDamageInDefence || skill === UnitSkills.DoubleDamageInDefence) {
        return (<><Tooltip text="Отримує подвійний урон, якщо ворог першим наблизився">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.RoundDamage || skill === UnitSkills.RoundDamage) {
        return (<><Tooltip text="Атака завдає урон по істотам праворуч та ліворуч від цілі">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ThroughDamage || skill === UnitSkills.ThroughDamage) {
        return (<><Tooltip text="Атака також завдає шкоди істоті позаду цілі">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.BlockDamage || skill === UnitSkills.BlockDamage) {
        return (<><Tooltip text="Заблокувати урон з одного боку">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.InjuredDamage || skill === UnitSkills.InjuredDamage) {
        return (<><Tooltip text="Одноразово збільшити силу на 1 при поранені">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.DecreaseInitiative || skill === UnitSkills.DecreaseInitiative) {
        return (<><Tooltip text="Знижує ініціативу цілі при атаці на 1">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ChargeAttack || skill === UnitSkills.ChargeAttack) {
        return (<><Tooltip text="Одноразово збільшити силу на 2 на наступний удар">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.RemoveChargeAttack || skill === UnitSkills.RemoveChargeAttack) {
        return (<><Tooltip text="Повернути звичайне значення сили">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.SetElokoCurse || skill === UnitSkills.SetElokoCurse) {
        return (<><Tooltip text="Зачарувати істоту знизив її ініціативу на 1 та змусити атакувати тільки себе">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.SetItOnFire || skill === UnitSkills.SetItOnFire) {
        return (<><Tooltip text="Спалити істоту знизив її силу та життя на 1">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ReturnDamage || skill === UnitSkills.ReturnDamage) {
        return (<><Tooltip text="Повернути урон скривднику у розмірі 50%">{skill.name ? skill.name : skill}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      }
    })
  }

  const getUnitStatusesString = () => {
    const statuses = infoUnit.status
    return infoUnit.status.map((status, i) => {
      if (status.name === UnitStatus.Freeze) {
        return (<><Tooltip text="Істота не може рухатися доки не пропустить хід">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.Stun) {
        return (<><Tooltip text="Істота пропускає хід у наступній фазі пересування">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.InitiativeDown) {
        return (<><Tooltip text="Ініціативу істоти знижено">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.InitiativeDownAura) {
        return (<><Tooltip text="Ініціативу істоти знижено">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.InitiativeUpAura) {
        return (<><Tooltip text="Ініціативу істоти збільшено">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.HealsDownAura) {
        return (<><Tooltip text="Вплив аури поблизу: -1 життя">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.PowerDown) {
        return (<><Tooltip text="Сила істоти була зменшена">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.PowerUp) {
        return (<><Tooltip text="Сила істоти було збільшено">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.PowerUpCharge) {
        return (<><Tooltip text="Одноразове збільшення сили">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.PowerUpSupport) {
        return (<><Tooltip text="Силу збільшено в наслідок Підтримки">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.Poison) {
        return (<><Tooltip text="Істота втрачає 1 життя на початку кожної фази пересування">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.Unfocused) {
        return (<><Tooltip text="Істота не може відповідати на атаку">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.Vengeance) {
        return (<><Tooltip text="Істота може атакувати/рейдити тільки того, хто наклав помсту">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.VengeanceTarget) {
        return (<><Tooltip text="Ціль для мстивих істот">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.Unarmed) {
        return (<><Tooltip text="Істота не може атакувати/відповідати/рейдити">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.Fired) {
        return (<><Tooltip text="Істота спалена">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else if (status.name === UnitStatus.Cursed) {
        return (<><Tooltip text="Істота проклята">{status.name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      }
      return `${status.name} ${status.qty < 10 ? ` (${status.qty})` : ``}`
    })
  }

  const getUnitKeywordsString = () => {
    const keywords = infoUnit.abilities.keywords
    return infoUnit.status.map((keyword, i) => {
      if (keyword === UnitKeywords.Sneaky) {
        return (<><Tooltip text="Не отримує відповіді після атаки">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.Unfocused) {
        return (<><Tooltip text="Істота не може відповідати на атаку">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.MainTarget) {
        return (<><Tooltip text="Істоти мають атакувати головну ціль у першу чергу">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.Support) {
        return (<><Tooltip text="Рандомно додає 1 силу до істоти поруч (окрім Ідола) на початку битви">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.RestrictedRaid) {
        return (<><Tooltip text="Не може здійснювати Рейд, якщо поруч є 2 союзних істоти">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.AbsoluteRaid) {
        return (<><Tooltip text="Може здійснювати рейд скрізь союзника та якщо поруч є ворог">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.NoObstaclesRaid) {
        return (<><Tooltip text="Істота може здійснити рейд навіть скрізь союзну істоту">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.ReplaceHealsRaid) {
        return (<><Tooltip text="Під час рейду може відняти додаткове життя та додати його союзній до цілі істоті у радіусі 1">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.AdditionalSacrificeRaid) {
        return (<><Tooltip text="Рейд отрумує +1 урону, але Адзе втрачає 1 життя">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.ExtendedMove) {
        return (<><Tooltip text="Істота може рухатись на 2 клітини">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.AbsoluteMove) {
        return (<><Tooltip text="Істота може рухатись на 2 клітини завжди">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.AlwaysCounterDamage) {
        return (<><Tooltip text="Істота завжди відповідає на атаку">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.FullDeathDamage) {
        return (<><Tooltip text="Істота б'є з повною силою при відповіді">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.RestrictedRoundDamage) {
        return (<><Tooltip text="Істота б'є сусідніх з ціллю істот тільки на 1 урон">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.LowCost) {
        return (<><Tooltip text="Знижка на виклик істоти">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else if (keyword === UnitKeywords.AdditionalEssence) {
        return (<><Tooltip text="Додаткова есенція при вбивстві">{keyword}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      }
    })
  }

  if (infoUnit) {
    return (
      <div className="creature-popup" style={popupStyle}>
        <button className="close-button" onClick={handleClose}>
          X
        </button>
        <div className="popup-content">
          <div className="popup-main-info">
            <div className="creature-image">
              <img width="190" src={unitImgMap(infoUnit.name)} alt={infoUnit.name} />
            </div>
            <div className="creature-info">
              <div className="creature-name">{infoUnit.name}</div>
              <div style={{display: "flex", justifyContent: "space-around"}}>
                <div className="creature-type">{infoUnit.type}</div>
                <div className="creature-origin">{infoUnit.biom}</div>
              </div>
              {infoUnit.level ?
                <div className="unit-stars-info">
                  {renderStarsCreated(infoUnit.level)}
                </div>
                : <></>
              }
              <div className="creature-stats">
                <div style={{display: "flex"}}><span style={{flexBasis: "45%"}}>Сила:</span> <span className="stat-power">{infoUnit.power} ({infoUnit.unitState.baseStats.power})</span></div>
                <div style={{display: "flex"}}><span style={{flexBasis: "45%"}}>Життя:</span> <span className="stat-heals">{infoUnit.heals}/{infoUnit.unitState.baseStats.heals}</span></div>
                <div style={{display: "flex"}}><span style={{flexBasis: "45%"}}>Ініціатива:</span> <span className="stat-initiative">{infoUnit.initiative} ({infoUnit.unitState.baseStats.initiative})</span></div>
              </div>
              {infoUnit.abilities.keywords.length > 0 ?
                <div>
                  <div style={{textAlign: "center", marginTop: 5, borderBottom: "1px solid #cbcbcb"}}>Особливості</div>
                  <div style={{fontSize: 20}}>{getUnitKeywordsString()}</div>
                </div>
                : <></>
              }
            </div>
          </div>
          <div className="popup-description">
            <div className="creature-applied-statuses">
              <div style={{borderBottom: "1px solid #cbcbcb", borderTop: "1px solid #cbcbcb", marginBottom: 5}}>
                <div style={{textAlign: "center", marginTop: 5}}>Навички</div>
                <div style={{fontSize: 20}}>{getUnitAbilitiesString()}</div>
              </div>
              {infoUnit.status.length > 0 ?
                <div>Поточні статуси: <span style={{fontSize: 20}}>{getUnitStatusesString()}</span></div>
                : <></>
              }
            </div>
            {/*<div style={{fontSize: 20, fontStyle: "italic", marginTop: 10, borderTop: "1px dashed grey", padding: "0 10px"}}>Вий - это один из самых известных персонажей украинской демонологии, который чаще всего предстает в образе старика с густыми и длинными бровями и ресницами, через которые он ничего не видит. Его взгляд может быть смертельным для живых существ. </div>*/}
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

export default UnitInfoPopup;
