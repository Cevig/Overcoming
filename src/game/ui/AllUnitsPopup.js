import './AllUnitsPopup.css';
import {Biom, playerColors} from "../helpers/Constants";
import React, {useState} from "react";
import i18n from "i18next";
import {Trans, withTranslation} from "react-i18next";
import {
  logPhase,
  logUnitKeyword,
  logUnitName,
  logUnitSkill,
  logUnitStatus
} from "../helpers/Utils";

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
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{i18n.t('biom.steppe')}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">{i18n.t('wiki.type')}</div>
            <div className="popup-creature-header popup-creature-name">{i18n.t('wiki.name')}</div>
            <div className="popup-creature-header popup-creature-damage">{i18n.t('wiki.power')}</div>
            <div className="popup-creature-header popup-creature-heals">{i18n.t('wiki.hp')}</div>
            <div className="popup-creature-header popup-creature-initiative">{i18n.t('wiki.ini')}</div>
            <div className="popup-creature-header popup-creature-abilities">{i18n.t('wiki.skills')}</div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('urka')}</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals">7</div>
            <div className="popup-creature-initiative">4</div>
            <div className="popup-creature-abilities">
              {logUnitSkill('addFreezeEffect').name} ➪ <Trans i18nKey="unitSkills.addFreezeEffect.descriptionTooltip" components={{
                tooltip: <Tooltip text={i18n.t('unitSkills.addFreezeEffect.effect', {status: logUnitStatus('freeze').name})} />
              }}/><br/>
              {getSimpleKeywordTooltip('mainTarget')}<br/>
              <Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('urka').name }} components={{
                tooltip: <Tooltip text={i18n.t('wiki.skill.full_values', {chargeQty: 2, radius: 1, phase: logPhase('move'),endTurn: i18n.t('game.action_ending_turn')})} />
              }}/>&nbsp;
              <Trans i18nKey="unitSkills.urka.descriptionTooltip" components={{tooltip: <Tooltip text={i18n.t('game.zoc.description')} />}}/>
            </div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('viy')}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">10</div>
            <div className="popup-creature-initiative">2</div>
            <div className="popup-creature-abilities">
              {logUnitSkill('instantKill').name} ➪ {i18n.t('unitSkills.instantKill.descriptionTooltip', {unitName: logUnitName('viy')})}
            </div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{logUnitName('prispeshnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{logUnitName('polydnica')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{logUnitName('polydnica')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{logUnitName('polydnica')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>6</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>6</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>{logUnitSkill('surround3').name} ➪ {i18n.t('unitSkills.surround3.descriptionTooltip', {unitName: logUnitName('polydnica')})}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 7}}>..., {getSimpleSkillTooltip('wholeness')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 8}}>..., {logUnitSkill('addFreezeEffect').name} ➪ <Trans i18nKey="unitSkills.addFreezeEffect.descriptionTooltip" components={{
              tooltip: <Tooltip text={i18n.t('unitSkills.addFreezeEffect.effect', {status: logUnitStatus('freeze').name})} />
            }}/></div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{logUnitName('prominkor')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{logUnitName('mara')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{logUnitName('mara')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{logUnitName('mara')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}>{getSimpleKeywordTooltip('sneaky')}<br/>{logUnitSkill('maraAura').name} ➪ {i18n.t('unitSkills.maraAura.descriptionTooltip', {qty: 2})}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}>{getSimpleKeywordTooltip('sneaky')}<br/>{logUnitSkill('maraAura').name} ➪ {i18n.t('unitSkills.maraAura.descriptionTooltip', {qty: 3})}</div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{logUnitName('vestnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{logUnitName('letavica')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{logUnitName('letavica')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{logUnitName('letavica')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>5</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}>{getSimpleKeywordTooltip('unfocused')}, {getSimpleSkillTooltip('raid')}, {getSimpleKeywordTooltip('replaceHealsRaid')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 15}}>..., <Trans i18nKey="unitSkills.lethalGrab.descriptionTooltip" values={{ unitName: logUnitName('letavica') }} components={{
              tooltip: <Tooltip text={i18n.t('unitSkills.lethalGrab.effect', {qty: 1})} />
            }}/></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}>..., <Trans i18nKey="unitSkills.lethalGrab.descriptionTooltip" values={{ unitName: logUnitName('letavica') }} components={{
              tooltip: <Tooltip text={i18n.t('unitSkills.lethalGrab.effect', {qty: 2})} />
            }}/></div>
          </div>
        </>
      )
    }

    if (biom === Biom.Forest) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{i18n.t('biom.forest')}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">{i18n.t('wiki.type')}</div>
            <div className="popup-creature-header popup-creature-name">{i18n.t('wiki.name')}</div>
            <div className="popup-creature-header popup-creature-damage">{i18n.t('wiki.power')}</div>
            <div className="popup-creature-header popup-creature-heals">{i18n.t('wiki.hp')}</div>
            <div className="popup-creature-header popup-creature-initiative">{i18n.t('wiki.ini')}</div>
            <div className="popup-creature-header popup-creature-abilities">{i18n.t('wiki.skills')}</div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('abasu')}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">6</div>
            <div className="popup-creature-initiative">4</div>
            <div className="popup-creature-abilities">
              <Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('abasuCurse').name }} components={{
                tooltip: <Tooltip text={i18n.t('wiki.skill.full_values', {chargeQty: 0, radius: "∞", phase: logPhase('any'), endTurn: i18n.t('game.not_ending_turn')})} />
              }}/>
              <Trans i18nKey="unitSkills.abasuCurse.descriptionTooltip" components={{tooltip: <Tooltip text={logUnitSkill('abasuCurse').effect} />}}/>
            </div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('chygayster')}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">7</div>
            <div className="popup-creature-initiative">5</div>
            <div className="popup-creature-abilities">{logUnitSkill('addUnfocusedEffect').name} ➪ <Trans i18nKey="unitSkills.addUnfocusedEffect.descriptionTooltip" components={{
              tooltip: <Tooltip text={i18n.t('unitSkills.addUnfocusedEffect.effect', {status: logUnitStatus('unfocused').name, statusEffect: logUnitStatus('unfocused').description})} />
              }}/><br />
              {logUnitSkill('addPoisonEffect').name} ➪ <Trans i18nKey="unitSkills.addPoisonEffect.descriptionTooltip" components={{
                tooltip: <Tooltip text={i18n.t('unitSkills.addPoisonEffect.effect', {status: logUnitStatus('poison').name, statusEffect: logUnitStatus('poison').description})} />
              }}/><br />
              {logUnitSkill('addVengeanceEffect').name} ➪ <Trans i18nKey="unitSkills.addVengeanceEffect.descriptionTooltip" components={{
                tooltip: <Tooltip text={i18n.t('unitSkills.addVengeanceEffect.effect', {status: logUnitStatus('vengeance').name, statusEffect: logUnitStatus('vengeance').description})} />
              }}/><br />
              {logUnitKeyword('extendedMove').name} ➪ <Trans i18nKey="unitKeywords.extendedMove.descriptionTooltip" components={{tooltip: <Tooltip text={i18n.t('game.zoc.description')} />}}/>
            </div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{logUnitName('prispeshnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{logUnitName('lesavka')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{logUnitName('lesavka')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{logUnitName('lesavka')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>6</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>{logUnitSkill('lesavka').name} ➪ <Trans i18nKey="unitSkills.lesavka.descriptionTooltip" values={{ unitName: logUnitName('lesavka') }} components={{tooltip: <Tooltip text={i18n.t('game.zoc.description')} />}}/></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 7}}>{getSimpleSkillTooltip('decreaseInitiative')}</div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{logUnitName('prominkor')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{logUnitName('bereginya')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{logUnitName('bereginya')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{logUnitName('bereginya')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>6</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}>
              <Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('healAlly').name }} components={{
                tooltip: <Tooltip text={i18n.t('wiki.skill.full_values', {chargeQty: 2, radius: "∞", phase: logPhase('any'), endTurn: i18n.t('game.action_ending_turn')})} />
              }}/> {logUnitSkill('healAlly').description}<br />
              {getSimpleKeywordTooltip('sneaky')}
            </div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}>
              <Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('healAlly').name }} components={{
                tooltip: <Tooltip text={i18n.t('wiki.skill.full_values', {chargeQty: 3, radius: "∞", phase: logPhase('any'), endTurn: i18n.t('game.action_ending_turn')})} />
              }}/> {logUnitSkill('healAlly').description}<br />
              {getSimpleKeywordTooltip('sneaky')}<br />
              {getSimpleKeywordTooltip('support')}
            </div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{logUnitName('vestnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{logUnitName('sirin')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{logUnitName('sirin')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{logUnitName('sirin')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>6</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}>{getSimpleKeywordTooltip('unfocused')}, {getSimpleSkillTooltip('raid')}, {getSimpleKeywordTooltip('restrictedRaid')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}>{getSimpleKeywordTooltip('unfocused')}, {getSimpleSkillTooltip('raid')}, {getSimpleKeywordTooltip('absoluteRaid')}</div>
          </div>
        </>
        )
    }

    if (biom === Biom.Mountains) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{i18n.t('biom.mountains')}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">{i18n.t('wiki.type')}</div>
            <div className="popup-creature-header popup-creature-name">{i18n.t('wiki.name')}</div>
            <div className="popup-creature-header popup-creature-damage">{i18n.t('wiki.power')}</div>
            <div className="popup-creature-header popup-creature-heals">{i18n.t('wiki.hp')}</div>
            <div className="popup-creature-header popup-creature-initiative">{i18n.t('wiki.ini')}</div>
            <div className="popup-creature-header popup-creature-abilities">{i18n.t('wiki.skills')}</div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('psoglav')}</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals">6</div>
            <div className="popup-creature-initiative">4</div>
            <div className="popup-creature-abilities"><Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('pauseToRecover').name }} components={{
              tooltip: <Tooltip text={i18n.t('wiki.skill.no_distance_values', {chargeQty: 2, phase: logPhase('any'), endTurn: i18n.t('game.not_ending_turn')})} />
              }}/>&nbsp;
              <Trans i18nKey="unitSkills.pauseToRecover.descriptionTooltip" values={{ status: logUnitStatus('unfocused').name }} components={{
                tooltip: <Tooltip text={logUnitStatus('unfocused').description} />
              }}/>
            </div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('hala')}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">8</div>
            <div className="popup-creature-initiative">5</div>
            <div className="popup-creature-abilities">{getSimpleSkillTooltip('raidBlock')}<br />
              <Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('halaAura').name }} components={{tooltip: <Tooltip text={i18n.t('unitSkills.halaAura.effect')} />}}/>&nbsp;
              <Trans i18nKey="unitSkills.halaAura.descriptionTooltip" values={{ skill: logUnitSkill('raidBlock').name }} components={{
                tooltip: <Tooltip text={logUnitSkill('raidBlock').description} />
              }}/>
            </div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{logUnitName('prispeshnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{logUnitName('beytir')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{logUnitName('beytir')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{logUnitName('beytir')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>6</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>7</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>{getSimpleSkillTooltip('chainDamage')}</div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{logUnitName('prominkor')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{logUnitName('garzyk')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{logUnitName('garzyk')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{logUnitName('garzyk')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>5</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}>{getSimpleKeywordTooltip('sneaky')},&nbsp;{getSimpleSkillTooltip('wholeness')},&nbsp;{getSimpleSkillTooltip('raidBlock')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}>..., <Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('throwWeapon').name }} components={{
              tooltip: <Tooltip text={i18n.t('wiki.skill.full_values', {chargeQty: 1, radius: 2, phase: logPhase('move'), endTurn: i18n.t('game.action_ending_turn')})} />
              }}/>&nbsp;
              <Trans i18nKey="unitSkills.throwWeapon.descriptionTooltip" values={{ status: logUnitStatus('unarmed').name }} components={{
                tooltip: <Tooltip text={logUnitStatus('unarmed').description} />
              }}/>
            </div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{logUnitName('vestnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{logUnitName('veshizaSoroka')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{logUnitName('veshizaSoroka')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{logUnitName('veshizaSoroka')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}>{getSimpleKeywordTooltip('unfocused')}, {getSimpleSkillTooltip('raid')}, {getSimpleKeywordTooltip('noObstaclesRaid')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 15}}>..., <Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('replaceUnits').name }} components={{
              tooltip: <Tooltip text={i18n.t('wiki.skill.full_values', {chargeQty: 1, radius: '∞', phase: logPhase('any'),endTurn: i18n.t('game.action_ending_turn')})} />
              }}/>&nbsp;
              <Trans i18nKey="unitSkills.replaceUnits.descriptionTooltip" components={{tooltip: <Tooltip text={i18n.t('game.zoc.description')} />}}/>
            </div>
          </div>
        </>
      )
    }

    if (biom === Biom.Desert) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{i18n.t('biom.desert')}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">{i18n.t('wiki.type')}</div>
            <div className="popup-creature-header popup-creature-name">{i18n.t('wiki.name')}</div>
            <div className="popup-creature-header popup-creature-damage">{i18n.t('wiki.power')}</div>
            <div className="popup-creature-header popup-creature-heals">{i18n.t('wiki.hp')}</div>
            <div className="popup-creature-header popup-creature-initiative">{i18n.t('wiki.ini')}</div>
            <div className="popup-creature-header popup-creature-abilities">{i18n.t('wiki.skills')}</div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('sfinks')}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">12</div>
            <div className="popup-creature-initiative">4</div>
            <div className="popup-creature-abilities">{getSimpleKeywordTooltip('sneaky')}<br />
              {getSimpleSkillTooltip('doubleDamage')}
            </div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('vasilisk')}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">8</div>
            <div className="popup-creature-initiative">4</div>
            <div className="popup-creature-abilities">{logUnitSkill('addPoisonEffect').name} ➪ <Trans i18nKey="unitSkills.addPoisonEffect.descriptionTooltip" components={{
              tooltip: <Tooltip text={i18n.t('unitSkills.addPoisonEffect.effect', {status: logUnitStatus('poison').name, statusEffect: logUnitStatus('poison').description})} />
              }}/><br />
              {getSimpleSkillTooltip('roundDamage')}
            </div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{logUnitName('prispeshnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{logUnitName('amfisbena')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{logUnitName('amfisbena')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{logUnitName('amfisbena')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>{getSimpleKeywordTooltip('alwaysCounterDamage')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 7}}>..., {getSimpleKeywordTooltip('fullDeathDamage')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 8}}>..., {getSimpleSkillTooltip('antiVestnick')}</div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{logUnitName('prominkor')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{logUnitName('obajifo')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{logUnitName('obajifo')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{logUnitName('obajifo')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>6</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>6</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}>{getSimpleKeywordTooltip('sneaky')}<br />
              <Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('obajifoAura').name }} components={{tooltip: <Tooltip text={i18n.t('unitSkills.obajifoAura.effect')} />}}/>&nbsp;{logUnitSkill('obajifoAura').descriptionTooltip}
            </div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}>..., {getSimpleSkillTooltip('healOnAttack')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 12}}>..., '{getSimpleKeywordTooltip('support')}</div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{logUnitName('vestnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{logUnitName('adze')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{logUnitName('adze')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{logUnitName('adze')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>3</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}>{getSimpleKeywordTooltip('unfocused')}, {getSimpleSkillTooltip('raid')}, {getSimpleKeywordTooltip('replaceHealsRaid')}, {getSimpleSkillTooltip('deadlyDamage')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 15}}>..., {getSimpleKeywordTooltip('additionalSacrificeRaid')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}>..., {getSimpleSkillTooltip('wholeness')}</div>
          </div>
        </>
      )
    }

    if (biom === Biom.Tundra) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{i18n.t('biom.tundra')}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">{i18n.t('wiki.type')}</div>
            <div className="popup-creature-header popup-creature-name">{i18n.t('wiki.name')}</div>
            <div className="popup-creature-header popup-creature-damage">{i18n.t('wiki.power')}</div>
            <div className="popup-creature-header popup-creature-heals">{i18n.t('wiki.hp')}</div>
            <div className="popup-creature-header popup-creature-initiative">{i18n.t('wiki.ini')}</div>
            <div className="popup-creature-header popup-creature-abilities">{i18n.t('wiki.skills')}</div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('medvedOboroten')}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">8</div>
            <div className="popup-creature-initiative">3</div>
            <div className="popup-creature-abilities">{getSimpleSkillTooltip('reduceDamage')}<br />
            <Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('chargeAttack').name }} components={{
              tooltip: <Tooltip text={i18n.t('wiki.skill.no_distance_values', {chargeQty: 2, phase: logPhase('move'),endTurn: i18n.t('game.action_ending_turn')})} />
            }}/>&nbsp; {logUnitSkill('chargeAttack').description}
            </div>
            <div className="popup-divider"></div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('marena')}</div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-heals">10</div>
            <div className="popup-creature-initiative">1</div>
            <div className="popup-creature-abilities">{getSimpleSkillTooltip('chainDamage')},&nbsp;{getSimpleSkillTooltip('raidBlock')}<br />
              {logUnitSkill('addFreezeEffect').name} ➪ <Trans i18nKey="unitSkills.addFreezeEffect.descriptionTooltip" components={{
                tooltip: <Tooltip text={i18n.t('unitSkills.addFreezeEffect.effect', {status: logUnitStatus('freeze').name})} />
              }}/><br/>
              {logUnitSkill('addUnfocusedEffect').name} ➪ <Trans i18nKey="unitSkills.addUnfocusedEffect.descriptionTooltip" components={{
                tooltip: <Tooltip text={i18n.t('unitSkills.addUnfocusedEffect.effect', {status: logUnitStatus('unfocused').name, statusEffect: logUnitStatus('unfocused').description})} />
              }}/><br />
              {getSimpleSkillTooltip('healOnAttack')}
            </div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{logUnitName('prispeshnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{logUnitName('ledyanoyJack')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{logUnitName('ledyanoyJack')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{logUnitName('ledyanoyJack')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>{}
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>7</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>3</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>{getSimpleSkillTooltip('blockDamage')}</div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{logUnitName('prominkor')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{logUnitName('bonakon')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{logUnitName('bonakon')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{logUnitName('bonakon')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>5</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}>{getSimpleKeywordTooltip('sneaky')},&nbsp;{getSimpleKeywordTooltip('unfocused')},&nbsp;{getSimpleSkillTooltip('injuredDamage')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}>..., {getSimpleKeywordTooltip('support')}</div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{logUnitName('vestnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{logUnitName('planetnick')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{logUnitName('planetnick')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{logUnitName('planetnick')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>3</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}>{getSimpleKeywordTooltip('unfocused')},&nbsp;{getSimpleSkillTooltip('raid')},&nbsp;{getSimpleSkillTooltip('decreaseInitiative')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 15}}>..., {logUnitKeyword('extendedMove').name} ➪ <Trans i18nKey="unitKeywords.extendedMove.descriptionTooltip" components={{tooltip: <Tooltip text={i18n.t('game.zoc.description')} />}}/></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}>..., {getSimpleSkillTooltip('wholeness')}</div>
          </div>
        </>
      )
    }

    if (biom === Biom.Jungle) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{i18n.t('biom.jungle')}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">{i18n.t('wiki.type')}</div>
            <div className="popup-creature-header popup-creature-name">{i18n.t('wiki.name')}</div>
            <div className="popup-creature-header popup-creature-damage">{i18n.t('wiki.power')}</div>
            <div className="popup-creature-header popup-creature-heals">{i18n.t('wiki.hp')}</div>
            <div className="popup-creature-header popup-creature-initiative">{i18n.t('wiki.ini')}</div>
            <div className="popup-creature-header popup-creature-abilities">{i18n.t('wiki.skills')}</div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('eloko')}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">8</div>
            <div className="popup-creature-initiative">4</div>
            <div className="popup-creature-abilities"><Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('setElokoCurse').name }} components={{
                tooltip: <Tooltip text={i18n.t('wiki.skill.full_values', {chargeQty: 2, radius: '∞', phase: logPhase('move'), endTurn: i18n.t('game.not_ending_turn')})} />
                }}/>&nbsp;
              <Trans i18nKey="unitSkills.setElokoCurse.descriptionTooltip" values={{ status: logUnitStatus('vengeance').name }} components={{
                tooltip: <Tooltip text={logUnitStatus('vengeance').description} />
              }}/>
            </div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('adjatar')}</div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-heals">10</div>
            <div className="popup-creature-initiative">5</div>
            <div className="popup-creature-abilities">{getSimpleKeywordTooltip('mainTarget')},&nbsp;{getSimpleSkillTooltip('returnDamage')}</div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{logUnitName('prispeshnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{logUnitName('blemmii')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{logUnitName('blemmii')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{logUnitName('blemmii')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>6</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>6</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>7</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>{getSimpleSkillTooltip('wholeness')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 7}}>..., {getSimpleSkillTooltip('raidBlock')}</div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{logUnitName('prominkor')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{logUnitName('petsyhos')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{logUnitName('petsyhos')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{logUnitName('petsyhos')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>6</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>6</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}>{getSimpleKeywordTooltip('sneaky')}<br/>
              {logUnitSkill('addUnfocusedEffect').name} ➪ <Trans i18nKey="unitSkills.addUnfocusedEffect.descriptionTooltip" components={{
                tooltip: <Tooltip text={i18n.t('unitSkills.addUnfocusedEffect.effect', {status: logUnitStatus('unfocused').name, statusEffect: logUnitStatus('unfocused').description})} />
              }}/>
            </div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{logUnitName('vestnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{logUnitName('kaiery')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{logUnitName('kaiery')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{logUnitName('kaiery')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>5</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}>{getSimpleSkillTooltip('raid')},&nbsp;{getSimpleSkillTooltip('blockDamage')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}><Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('chargeAttack').name }} components={{
              tooltip: <Tooltip text={i18n.t('wiki.skill.no_distance_values', {chargeQty: 1, phase: logPhase('move'),endTurn: i18n.t('game.action_ending_turn')})} />
              }}/>&nbsp;{logUnitSkill('chargeAttack').description}
            </div>
          </div>
        </>
      )
    }

    if (biom === Biom.Water) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{i18n.t('biom.water')}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">{i18n.t('wiki.type')}</div>
            <div className="popup-creature-header popup-creature-name">{i18n.t('wiki.name')}</div>
            <div className="popup-creature-header popup-creature-damage">{i18n.t('wiki.power')}</div>
            <div className="popup-creature-header popup-creature-heals">{i18n.t('wiki.hp')}</div>
            <div className="popup-creature-header popup-creature-initiative">{i18n.t('wiki.ini')}</div>
            <div className="popup-creature-header popup-creature-abilities">{i18n.t('wiki.skills')}</div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('balor')}</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals">8</div>
            <div className="popup-creature-initiative">1</div>
            <div className="popup-creature-abilities">{logUnitKeyword('absoluteMove').name} ➪ <Trans i18nKey="unitKeywords.absoluteMove.descriptionTooltip" components={{tooltip: <Tooltip text={i18n.t('game.zoc.description')} />}}/><br />
              {getSimpleSkillTooltip('instantKillOnCounter')}&nbsp;{getSimpleSkillTooltip('doubleDamageInDefence')}
            </div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('vodyanoi')}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">7</div>
            <div className="popup-creature-initiative">5</div>
            <div className="popup-creature-abilities">{getSimpleSkillTooltip('lowHealsAura')}<br/>
              {logUnitSkill('throwOver').name} ➪ <Trans i18nKey="unitSkills.throwOver.descriptionTooltip" components={{tooltip: <Tooltip text={i18n.t('game.zoc.description')} />}}/>
            </div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{logUnitName('prispeshnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{logUnitName('lerneyskiy')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{logUnitName('lerneyskiy')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{logUnitName('lerneyskiy')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>2</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>2</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>2</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>1</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>1</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>1</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>{getSimpleKeywordTooltip('lowCost')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 7}}>..., {logUnitSkill('surround3').name} ➪ {i18n.t('unitSkills.surround3.descriptionTooltip', {unitName: logUnitName('lerneyskiy')})}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 8}}>..., {logUnitSkill('instantKill').name} ➪ {i18n.t('unitSkills.instantKill.descriptionTooltip', {unitName: logUnitName('lerneyskiy')})}</div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{logUnitName('prominkor')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{logUnitName('bykavaz')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{logUnitName('bykavaz')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{logUnitName('bykavaz')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>5</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}>{getSimpleKeywordTooltip('sneaky')}, {getSimpleKeywordTooltip('support')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}>..., {logUnitSkill('addStunEffect').name} ➪ <Trans i18nKey="unitSkills.addStunEffect.descriptionTooltip" components={{
              tooltip: <Tooltip text={i18n.t('unitSkills.addStunEffect.effect', {status: logUnitStatus('stun').name, statusEffect: logUnitStatus('stun').description})} />
            }}/></div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{logUnitName('vestnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{logUnitName('aidahar')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{logUnitName('aidahar')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{logUnitName('aidahar')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>3</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}>{getSimpleSkillTooltip('raid')}, {getSimpleKeywordTooltip('unfocused')}<br />
              <Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('healAlly').name }} components={{
                tooltip: <Tooltip text={i18n.t('wiki.skill.full_values', {chargeQty: 1, radius: "∞", phase: logPhase('any'), endTurn: i18n.t('game.action_ending_turn')})} />
              }}/> {logUnitSkill('healAlly').description}
            </div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}>..., {getSimpleKeywordTooltip('support')}</div>
          </div>
        </>
      )
    }

    if (biom === Biom.Mash) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{i18n.t('biom.mash')}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">{i18n.t('wiki.type')}</div>
            <div className="popup-creature-header popup-creature-name">{i18n.t('wiki.name')}</div>
            <div className="popup-creature-header popup-creature-damage">{i18n.t('wiki.power')}</div>
            <div className="popup-creature-header popup-creature-heals">{i18n.t('wiki.hp')}</div>
            <div className="popup-creature-header popup-creature-initiative">{i18n.t('wiki.ini')}</div>
            <div className="popup-creature-header popup-creature-abilities">{i18n.t('wiki.skills')}</div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('begemot')}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">8</div>
            <div className="popup-creature-initiative">3</div>
            <div className="popup-creature-abilities">{getSimpleKeywordTooltip('mainTarget')}, {getSimpleKeywordTooltip('alwaysCounterDamage')}</div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('fekst')}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">7</div>
            <div className="popup-creature-initiative">4</div>
            <div className="popup-creature-abilities"><Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('notMovedRecover').name }} components={{
              tooltip: <Tooltip text={i18n.t('wiki.skill.no_distance_values', {chargeQty: '∞', phase: logPhase('move'),endTurn: i18n.t('game.action_ending_turn')})} />
              }}/>&nbsp; {logUnitSkill('notMovedRecover').description}<br />
              {getSimpleSkillTooltip('healOnAttack')}, {getSimpleSkillTooltip('blockStatuses')}<br />
              <Trans i18nKey="unitSkills.lethalGrab.descriptionTooltip" values={{ unitName: logUnitName('letavica') }} components={{
                tooltip: <Tooltip text={i18n.t('unitSkills.lethalGrab.effect', {qty: 1})} />
              }}/>
            </div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{logUnitName('prispeshnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{logUnitName('mohovik')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{logUnitName('mohovik')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{logUnitName('mohovik')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>{logUnitKeyword('absoluteMove').name} ➪ <Trans i18nKey="unitKeywords.absoluteMove.descriptionTooltip" components={{tooltip: <Tooltip text={i18n.t('game.zoc.description')} />}}/></div>
            <div className="popup-creature-abilities" style={{gridRowStart: 7}}>..., {getSimpleKeywordTooltip('alwaysCounterDamage')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 8}}>..., {getSimpleKeywordTooltip('sneaky')}</div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{logUnitName('prominkor')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{logUnitName('drekavaz')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{logUnitName('drekavaz')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{logUnitName('drekavaz')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>6</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>6</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}>{getSimpleKeywordTooltip('sneaky')}<br />
              {logUnitSkill('lethalBlow').name} ➪ <Trans i18nKey="unitSkills.lethalBlow.descriptionTooltip" components={{
                tooltip: <Tooltip text={i18n.t('unitSkills.lethalBlow.effect', {status: logUnitStatus('unarmed').name, statusEffect: logUnitStatus('unarmed').description})} />
              }}/>
            </div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}>..., {getSimpleKeywordTooltip('support')}</div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{logUnitName('vestnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{logUnitName('mavka')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{logUnitName('mavka')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{logUnitName('mavka')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-damage">1</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}>{getSimpleSkillTooltip('raid')}, {getSimpleKeywordTooltip('unfocused')}<br/>
              {logUnitSkill('addVengeanceEffect').name} ➪ <Trans i18nKey="unitSkills.addVengeanceEffect.descriptionTooltip" components={{
                tooltip: <Tooltip text={i18n.t('unitSkills.addVengeanceEffect.effect', {status: logUnitStatus('vengeance').name, statusEffect: logUnitStatus('vengeance').description})} />
              }}/>
            </div>
            <div className="popup-creature-abilities" style={{gridRowStart: 15}}>..., {logUnitSkill('addPoisonEffectOnRaid').name} ➪ <Trans i18nKey="unitSkills.addPoisonEffectOnRaid.descriptionTooltip" components={{
              tooltip: <Tooltip text={i18n.t('unitSkills.addPoisonEffectOnRaid.effect', {status: logUnitStatus('poison').name, statusEffect: logUnitStatus('poison').description})} />
            }}/>
            </div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}>..., <Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('replaceUnits').name }} components={{
              tooltip: <Tooltip text={i18n.t('wiki.skill.full_values', {chargeQty: 1, radius: '∞', phase: logPhase('any'),endTurn: i18n.t('game.action_ending_turn')})} />
              }}/>&nbsp;
              <Trans i18nKey="unitSkills.replaceUnits.descriptionTooltip" components={{tooltip: <Tooltip text={i18n.t('game.zoc.description')} />}}/>
            </div>
          </div>
        </>
      )
    }

    if (biom === Biom.Geysers) {
      return (
        <>
          <div className="popup-biome" style={{color: playerColors[playerId]}}>{i18n.t('biom.geysers')}</div>
          <div className="popup-creature">
            <div className="popup-creature-header popup-creature-type">{i18n.t('wiki.type')}</div>
            <div className="popup-creature-header popup-creature-name">{i18n.t('wiki.name')}</div>
            <div className="popup-creature-header popup-creature-damage">{i18n.t('wiki.power')}</div>
            <div className="popup-creature-header popup-creature-heals">{i18n.t('wiki.hp')}</div>
            <div className="popup-creature-header popup-creature-initiative">{i18n.t('wiki.ini')}</div>
            <div className="popup-creature-header popup-creature-abilities">{i18n.t('wiki.skills')}</div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('cherufe')}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">5</div>
            <div className="popup-creature-initiative">5</div>
            <div className="popup-creature-abilities">{getSimpleKeywordTooltip('unfocused')}<br/>
              <Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('setItOnFire').name }} components={{
                tooltip: <Tooltip text={i18n.t('wiki.skill.full_values', {chargeQty: 3, radius: '∞', phase: logPhase('any'), endTurn: i18n.t('game.action_ending_turn')})} />
                }}/>&nbsp;
              <Trans i18nKey="unitSkills.setItOnFire.descriptionTooltip" values={{ status: logUnitStatus('fired').name }} components={{
                tooltip: <Tooltip text={logUnitStatus('fired').description} />
              }}/>
            </div>

            <div className="popup-divider"></div>

            <div className="popup-creature-type">{logUnitName('idol')}</div>
            <div className="popup-creature-name" style={{color: playerColors[playerId]}}>{logUnitName('jarPtiza')}</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-heals">7</div>
            <div className="popup-creature-initiative">5</div>
            <div className="popup-creature-abilities">{getSimpleKeywordTooltip('additionalEssence')}, {getSimpleSkillTooltip('blockStatuses')}, {getSimpleSkillTooltip('throughDamage')}<br />
              <Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('healAlly').name }} components={{
                tooltip: <Tooltip text={i18n.t('wiki.skill.full_values', {chargeQty: 3, radius: "∞", phase: logPhase('any'), endTurn: i18n.t('game.action_ending_turn')})} />
              }}/> {logUnitSkill('healAlly').description}
            </div>

            <div style={{gridRowStart: 5}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 6}}>{logUnitName('prispeshnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 6, color: playerColors[playerId]}}>{logUnitName('himera')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 7, color: playerColors[playerId]}}>{logUnitName('himera')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 8, color: playerColors[playerId]}}>{logUnitName('himera')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 6}}>5</div>
            <div className="popup-creature-heals" style={{gridRowStart: 7}}>6</div>
            <div className="popup-creature-heals" style={{gridRowStart: 8}}>6</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 6}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 7}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 8}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 6}}>{getSimpleSkillTooltip('throughDamage')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 7}}>..., {getSimpleSkillTooltip('injuredDamage')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 8}}>..., {getSimpleSkillTooltip('roundDamage')}, {getSimpleKeywordTooltip('restrictedRoundDamage')}</div>

            <div style={{gridRowStart: 9}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 10}}>{logUnitName('prominkor')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 10, color: playerColors[playerId]}}>{logUnitName('aly')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 11, color: playerColors[playerId]}}>{logUnitName('aly')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 12, color: playerColors[playerId]}}>{logUnitName('aly')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 10}}>3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 11}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 12}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 10}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 11}}>5</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 12}}>5</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 10}}><Trans i18nKey="wiki.skill.text" values={{ skill: logUnitSkill('unfocusedAura').name }} components={{tooltip: <Tooltip text={i18n.t('unitSkills.unfocusedAura.effect')} />}}/>&nbsp;
              <Trans i18nKey="unitSkills.unfocusedAura.descriptionTooltip" values={{ status: logUnitStatus('unfocused').name }} components={{
                tooltip: <Tooltip text={logUnitStatus('unfocused').description} />
              }}/>
            </div>
            <div className="popup-creature-abilities" style={{gridRowStart: 11}}>..., {getSimpleKeywordTooltip('support')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 12}}>..., {getSimpleKeywordTooltip('fullDeathDamage')}</div>

            <div style={{gridRowStart: 13}} className="popup-divider"></div>

            <div className="popup-creature-type" style={{gridRowStart: 14}}>{logUnitName('vestnick')}</div>
            <div className="popup-creature-name" style={{gridRowStart: 14, color: playerColors[playerId]}}>{logUnitName('rarog')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(1)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 15, color: playerColors[playerId]}}>{logUnitName('rarog')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(2)}</div></div>
            <div className="popup-creature-name" style={{gridRowStart: 16, color: playerColors[playerId]}}>{logUnitName('rarog')} <div style={{display: "inline"}} className="unit-stars-info">{renderStarsCreated(3)}</div></div>
            <div className="popup-creature-damage">2</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-damage">3</div>
            <div className="popup-creature-heals" style={{gridRowStart: 14}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 15}}>4</div>
            <div className="popup-creature-heals" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 14}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 15}}>3</div>
            <div className="popup-creature-initiative" style={{gridRowStart: 16}}>4</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 14}}>{getSimpleSkillTooltip('raid')}, {getSimpleKeywordTooltip('unfocused')}<br/>
              {logUnitSkill('addPoisonEffect').name} ➪ <Trans i18nKey="unitSkills.addPoisonEffect.descriptionTooltip" components={{
                tooltip: <Tooltip text={i18n.t('unitSkills.addPoisonEffect.effect', {status: logUnitStatus('poison').name, statusEffect: logUnitStatus('poison').description})} />
              }}/>
            </div>
            <div className="popup-creature-abilities" style={{gridRowStart: 15}}>..., {getSimpleSkillTooltip('wholeness')}</div>
            <div className="popup-creature-abilities" style={{gridRowStart: 16}}>..., {logUnitSkill('addPoisonEffectOnRaid').name} ➪ <Trans i18nKey="unitSkills.addPoisonEffectOnRaid.descriptionTooltip" components={{
              tooltip: <Tooltip text={i18n.t('unitSkills.addPoisonEffectOnRaid.effect', {status: logUnitStatus('poison').name, statusEffect: logUnitStatus('poison').description})} />
              }}/>
            </div>
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

export const getSimpleKeywordTooltip = (name) => {
  return (<Trans i18nKey="wiki.keyword" values={{ keyword: logUnitKeyword(name).name }} components={{tooltip: <Tooltip text={logUnitKeyword(name).description} />}}/>)
}

export const getSimpleSkillTooltip = (name) => {
  return (<Trans i18nKey="wiki.keyword" values={{ keyword: logUnitSkill(name).name }} components={{tooltip: <Tooltip text={logUnitSkill(name).description} />}}/>)
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

export default withTranslation()(AllUnitsPopup);
