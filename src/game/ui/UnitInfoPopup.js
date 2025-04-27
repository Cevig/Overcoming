import './UnitInfo.css';
import {unitImgMap} from "../helpers/UnitImg";
import React, {useState} from "react";
import {UnitKeywords, UnitSkills, UnitStatus} from "../helpers/Constants";
import {
  logUnitKeyword,
  logUnitName,
  logUnitSkill,
  logUnitStatus
} from "../helpers/Utils";
import i18n from "../../i18n";
import {withTranslation} from "react-i18next";

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
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.Surround3 || skill === UnitSkills.Surround3) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.BlockStatuses || skill === UnitSkills.BlockStatuses) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AddFreezeEffect || skill === UnitSkills.AddFreezeEffect) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AddUnfocusedEffect || skill === UnitSkills.AddUnfocusedEffect) {
        return (<><Tooltip text={i18n.t('unitSkills.'+(skill.name || skill)+'.description', {statusEffect: logUnitStatus('unfocused').description})}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AddPoisonEffect || skill === UnitSkills.AddPoisonEffect) {
        return (<><Tooltip text={i18n.t('unitSkills.'+(skill.name || skill)+'.description', {statusEffect: logUnitStatus('poison').description})}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AddPoisonEffectOnRaid || skill === UnitSkills.AddPoisonEffectOnRaid) {
        return (<><Tooltip text={i18n.t('unitSkills.'+(skill.name || skill)+'.description', {statusEffect: logUnitStatus('poison').description})}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AddStunEffect || skill === UnitSkills.AddStunEffect) {
        return (<><Tooltip text={i18n.t('unitSkills.'+(skill.name || skill)+'.description', {statusEffect: logUnitStatus('stun').description})}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AddVengeanceEffect || skill === UnitSkills.AddVengeanceEffect) {
        return (<><Tooltip text={i18n.t('unitSkills.'+(skill.name || skill)+'.description', {statusEffect: logUnitStatus('vengeance').description})}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.MaraAura || skill === UnitSkills.MaraAura) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.LowHealsAura || skill === UnitSkills.LowHealsAura) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.HalaAura || skill === UnitSkills.HalaAura) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ObajifoAura || skill === UnitSkills.ObajifoAura) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.UnfocusedAura || skill === UnitSkills.UnfocusedAura) {
        return (<><Tooltip text={i18n.t('unitSkills.'+(skill.name || skill)+'.description', {status:logUnitStatus('unfocused').name, statusEffect: logUnitStatus('unfocused').description})}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.Raid || skill === UnitSkills.Raid) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name).name}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.LethalGrab || skill === UnitSkills.LethalGrab) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.LethalBlow || skill === UnitSkills.LethalBlow) {
        return (<><Tooltip text={i18n.t('unitSkills.'+(skill.name || skill)+'.description', {statusEffect: logUnitStatus('unarmed').description})}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.Urka || skill === UnitSkills.Urka) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.InstantKill || skill === UnitSkills.InstantKill) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.InstantKillOnCounter || skill === UnitSkills.InstantKillOnCounter) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.Lesavka || skill === UnitSkills.Lesavka) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ThrowOver || skill === UnitSkills.ThrowOver) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.UtilizeDeath || skill === UnitSkills.UtilizeDeath) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.HealAlly || skill === UnitSkills.HealAlly) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AbasuCurse || skill === UnitSkills.AbasuCurse) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ChainDamage || skill === UnitSkills.ChainDamage) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ThrowWeapon || skill === UnitSkills.ThrowWeapon) {
        return (<><Tooltip text={i18n.t('unitSkills.'+(skill.name || skill)+'.description', {status: logUnitStatus('unarmed').name})}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ReplaceUnits || skill === UnitSkills.ReplaceUnits) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.PauseToRecover || skill === UnitSkills.PauseToRecover) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.NotMovedRecover || skill === UnitSkills.NotMovedRecover) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.RaidBlock || skill === UnitSkills.RaidBlock) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.AntiVestnick || skill === UnitSkills.AntiVestnick) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ReduceDamage || skill === UnitSkills.ReduceDamage) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.HealOnAttack || skill === UnitSkills.HealOnAttack) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.DeadlyDamage || skill === UnitSkills.DeadlyDamage) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.DoubleDamage || skill === UnitSkills.DoubleDamage) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.DoubleDamageInDefence || skill === UnitSkills.DoubleDamageInDefence) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.RoundDamage || skill === UnitSkills.RoundDamage) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ThroughDamage || skill === UnitSkills.ThroughDamage) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.BlockDamage || skill === UnitSkills.BlockDamage) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.InjuredDamage || skill === UnitSkills.InjuredDamage) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.DecreaseInitiative || skill === UnitSkills.DecreaseInitiative) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ChargeAttack || skill === UnitSkills.ChargeAttack) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.RemoveChargeAttack || skill === UnitSkills.RemoveChargeAttack) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.SetElokoCurse || skill === UnitSkills.SetElokoCurse) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.SetItOnFire || skill === UnitSkills.SetItOnFire) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      } else if (skill.name === UnitSkills.ReturnDamage || skill === UnitSkills.ReturnDamage) {
        return (<><Tooltip text={logUnitSkill(skill.name || skill).description}>{logUnitSkill(skill.name || skill).name}{skill.qty < 10 ? ` (${skill.qty})` : ``}</Tooltip>{i !== skills.length-1 ? ', ' : ''}</>)
      }
    })
  }

  const getUnitStatusesString = () => {
    const statuses = infoUnit.status
    return infoUnit.status.map((status, i) => {
      if (Object.values(UnitStatus).includes(status.name)){
        return (<><Tooltip text={logUnitStatus(status.name).description}>{logUnitStatus(status.name).name}{status.qty < 10 ? ` (${status.qty})` : ``}</Tooltip>{i !== statuses.length-1 ? ', ' : ''}</>)
      } else {
        return `${logUnitStatus(status.name).name} ${status.qty < 10 ? ` (${status.qty})` : ``}`
      }
    })
  }

  const getUnitKeywordsString = () => {
    const keywords = infoUnit.abilities.keywords
    return keywords.map((keyword, i) => {
      if (Object.values(UnitKeywords).includes(keyword)){
        return (<><Tooltip text={logUnitKeyword(keyword).description}>{logUnitKeyword(keyword).name}</Tooltip>{i !== keywords.length-1 ? ', ' : ''}</>)
      } else {
        return `${logUnitKeyword(keyword).name}`
      }
    })
  }

  if (infoUnit) {
    const unitAbilities = getUnitAbilitiesString()
    return (
      <div className="creature-popup" style={popupStyle}>
        <button className="close-button" onClick={handleClose}>
          X
        </button>
        <div className="popup-content">
          <div className="popup-main-info">
            <div className="creature-image">
              <img
                width="190"
                src={unitImgMap(infoUnit.name)}
                alt={logUnitName(infoUnit.name)}
                loading="eager"
              />
            </div>
            <div className="creature-info">
              <div className="creature-name">{logUnitName(infoUnit.name)}</div>
              <div style={{display: "flex", justifyContent: "space-around"}}>
                <div className="creature-type">{logUnitName(infoUnit.type)}</div>
                <div className="creature-origin">{i18n.t('biom.'+infoUnit.biom)}</div>
              </div>
              {infoUnit.level ?
                <div className="unit-stars-info">
                  {renderStarsCreated(infoUnit.level)}
                </div>
                : <></>
              }
              <div className="creature-stats">
                <div style={{display: "flex"}}><span style={{flexBasis: "45%"}}>{i18n.t('wiki.power')}:</span> <span className="stat-power">{infoUnit.power} ({infoUnit.unitState.baseStats.power})</span></div>
                <div style={{display: "flex"}}><span style={{flexBasis: "45%"}}>{i18n.t('wiki.hp')}:</span> <span className="stat-heals">{infoUnit.heals}/{infoUnit.unitState.baseStats.heals}</span></div>
                <div style={{display: "flex"}}><span style={{flexBasis: "45%"}}>{i18n.t('wiki.ini')}:</span> <span className="stat-initiative">{infoUnit.initiative} ({infoUnit.unitState.baseStats.initiative})</span></div>
              </div>
              {infoUnit.abilities.keywords.length > 0 ?
                <div>
                  <div style={{textAlign: "center", marginTop: 5, borderBottom: "1px solid #cbcbcb"}}>{i18n.t('wiki.specials')}</div>
                  <div style={{fontSize: 20}}>{getUnitKeywordsString()}</div>
                </div>
                : <></>
              }
            </div>
          </div>
          <div className="popup-description">
            <div className="creature-applied-statuses">
              {unitAbilities.length !== 0 ?
                <div style={{borderBottom: "1px solid #cbcbcb", borderTop: "1px solid #cbcbcb", marginBottom: 5}}>
                  <div style={{textAlign: "center", marginTop: 5}}>{i18n.t('wiki.skills')}</div>
                  <div style={{fontSize: 20}}>{unitAbilities}</div>
                </div>
                : <></>
              }
              {infoUnit.status.length > 0 ?
                <div>{i18n.t('wiki.current_statuses')}: <span style={{fontSize: 20}}>{getUnitStatusesString()}</span></div>
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

export default withTranslation()(UnitInfoPopup);
