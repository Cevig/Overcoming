import './UnitInfo.css';
import {unitImgMap} from "../helpers/UnitImg";
import React, {useMemo, useState} from "react";
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

  // Memoize star rendering to prevent unnecessary recalculations
  const renderStarsCreated = useMemo(() => {
    return (count) => {
      const stars = [];
      for (let i = 0; i < 3; i++) {
        if (count - 1 >= i) {
          stars.push(<i key={i} className="star star-active"></i>);
        } else {
          stars.push(<i key={i} className="star star-sad"></i>);
        }
      }
      return stars;
    };
  }, []);

  // Map of skills that need special tooltip text handling
  const specialTooltipSkills = useMemo(() => ({
    [UnitSkills.AddUnfocusedEffect]: (skill) => i18n.t('unitSkills.'+skill.name+'.description', {statusEffect: logUnitStatus('unfocused').description}),
    [UnitSkills.AddPoisonEffect]: (skill) => i18n.t('unitSkills.'+skill.name+'.description', {statusEffect: logUnitStatus('poison').description}),
    [UnitSkills.AddPoisonEffectOnRaid]: (skill) => i18n.t('unitSkills.'+skill.name+'.description', {statusEffect: logUnitStatus('poison').description}),
    [UnitSkills.AddStunEffect]: (skill) => i18n.t('unitSkills.'+skill.name+'.description', {statusEffect: logUnitStatus('stun').description}),
    [UnitSkills.AddVengeanceEffect]: (skill) => i18n.t('unitSkills.'+skill.name+'.description', {statusEffect: logUnitStatus('vengeance').description}),
    [UnitSkills.UnfocusedAura]: (skill) => i18n.t('unitSkills.'+skill.name+'.description', {status: logUnitStatus('unfocused').name, statusEffect: logUnitStatus('unfocused').description}),
    [UnitSkills.LethalBlow]: (skill) => i18n.t('unitSkills.'+skill.name+'.description', {statusEffect: logUnitStatus('unarmed').description}),
    [UnitSkills.ThrowWeapon]: (skill) => i18n.t('unitSkills.'+skill.name+'.description', {status: logUnitStatus('unarmed').name}),
  }), []);

  // Memoized function to extract and render unit abilities with tooltips
  const getUnitAbilitiesString = useMemo(() => {
    if (!infoUnit || !infoUnit.abilities) return [];

    // Extract all skills from different ability categories
    const skills = [];
    for (const [key] of Object.entries(infoUnit.abilities)) {
      if (key !== 'keywords') {
        if (key === 'statUpdates') {
          skills.push(...infoUnit.abilities[key].attack);
          skills.push(...infoUnit.abilities[key].defence);
        } else {
          skills.push(...infoUnit.abilities[key]);
        }
      }
    }

    // Render each skill with appropriate tooltip
    return skills.map((skill, i) => {
      const skillName = skill.name;
      const skillObj = logUnitSkill(skillName);

      // Get tooltip text - either from special cases or default
      const tooltipText = specialTooltipSkills[skillName]
        ? specialTooltipSkills[skillName](skill)
        : skillObj.description;

      // Special case for Raid skill which doesn't show quantity
      const showQty = skillName !== UnitSkills.Raid && skill.qty < 10 ? ` (${skill.qty})` : '';

      // Render the skill with tooltip
      return (
        <React.Fragment key={`skill-${skillName}-${i}`}>
          <Tooltip text={tooltipText}>
            {skillObj.name}{showQty}
          </Tooltip>
          {i !== skills.length - 1 ? ', ' : ''}
        </React.Fragment>
      );
    });
  }, [infoUnit, specialTooltipSkills]);

  // Memoized function to render unit statuses with tooltips
  const getUnitStatusesString = useMemo(() => {
    if (!infoUnit || !infoUnit.status) return [];

    const statuses = infoUnit.status;
    return statuses.map((status, i) => {
      const statusObj = logUnitStatus(status.name);
      const showQty = status.qty < 10 ? ` (${status.qty})` : '';

      if (Object.values(UnitStatus).includes(status.name)) {
        return (
          <React.Fragment key={`status-${status.name}-${i}`}>
            <Tooltip text={statusObj.description}>
              {statusObj.name}{showQty}
            </Tooltip>
            {i !== statuses.length - 1 ? ', ' : ''}
          </React.Fragment>
        );
      } else {
        return `${statusObj.name}${showQty}`;
      }
    });
  }, [infoUnit]);

  // Memoized function to render unit keywords with tooltips
  const getUnitKeywordsString = useMemo(() => {
    if (!infoUnit || !infoUnit.abilities || !infoUnit.abilities.keywords) return [];

    const keywords = infoUnit.abilities.keywords;
    return keywords.map((keyword, i) => {
      const keywordObj = logUnitKeyword(keyword);

      if (Object.values(UnitKeywords).includes(keyword)) {
        return (
          <React.Fragment key={`keyword-${keyword}-${i}`}>
            <Tooltip text={keywordObj.description}>
              {keywordObj.name}
            </Tooltip>
            {i !== keywords.length - 1 ? ', ' : ''}
          </React.Fragment>
        );
      } else {
        return `${keywordObj.name}`;
      }
    });
  }, [infoUnit]);

  // Only render the popup if infoUnit exists
  if (!infoUnit) return null;

  // Access the memoized values
  const hasKeywords = infoUnit.abilities?.keywords?.length > 0;
  const hasStatuses = infoUnit.status?.length > 0;
  const hasAbilities = getUnitAbilitiesString.length > 0;

  // Store references to memoized values for clarity
  const unitKeywords = getUnitKeywordsString;
  const unitAbilities = getUnitAbilitiesString;
  const unitStatuses = getUnitStatusesString;

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

            {infoUnit.level > 0 && (
              <div className="unit-stars-info">
                {renderStarsCreated(infoUnit.level)}
              </div>
            )}

            <div className="creature-stats">
              <div style={{display: "flex"}}>
                <span style={{flexBasis: "45%"}}>{i18n.t('wiki.power')}:</span>
                <span className="stat-power">{infoUnit.power} ({infoUnit.unitState.baseStats.power})</span>
              </div>
              <div style={{display: "flex"}}>
                <span style={{flexBasis: "45%"}}>{i18n.t('wiki.hp')}:</span>
                <span className="stat-heals">{infoUnit.heals}/{infoUnit.unitState.baseStats.heals}</span>
              </div>
              <div style={{display: "flex"}}>
                <span style={{flexBasis: "45%"}}>{i18n.t('wiki.ini')}:</span>
                <span className="stat-initiative">{infoUnit.initiative} ({infoUnit.unitState.baseStats.initiative})</span>
              </div>
            </div>

            {hasKeywords && (
              <div>
                <div style={{textAlign: "center", marginTop: 5, borderBottom: "1px solid #cbcbcb"}}>
                  {i18n.t('wiki.specials')}
                </div>
                <div style={{fontSize: 20}}>{unitKeywords}</div>
              </div>
            )}
          </div>
        </div>

        <div className="popup-description">
          <div className="creature-applied-statuses">
            {hasAbilities && (
              <div style={{borderBottom: "1px solid #cbcbcb", borderTop: "1px solid #cbcbcb", marginBottom: 5}}>
                <div style={{textAlign: "center", marginTop: 5}}>{i18n.t('wiki.skills')}</div>
                <div style={{fontSize: 20}}>{unitAbilities}</div>
              </div>
            )}

            {hasStatuses && (
              <div>
                {i18n.t('wiki.current_statuses')}:
                <span style={{fontSize: 20}}>{unitStatuses}</span>
              </div>
            )}
          </div>
          {/* Commented out description section
          <div style={{fontSize: 20, fontStyle: "italic", marginTop: 10, borderTop: "1px dashed grey", padding: "0 10px"}}>
            Вий - это один из самых известных персонажей украинской демонологии, который чаще всего предстает в образе старика с густыми и длинными бровями и ресницами, через которые он ничего не видит. Его взгляд может быть смертельным для живых существ.
          </div>
          */}
        </div>
      </div>
    </div>
  );


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
