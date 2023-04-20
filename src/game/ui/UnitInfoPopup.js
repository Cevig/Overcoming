import './UnitInfo.css';
import {unitImgMap} from "../helpers/UnitImg";

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

    return skills.map(skill => {
      if (skill.qty) {
        return `${skill.name} (${skill.qty})`
      } else {
        return skill.name ? `${skill.name}` : `${skill}`
      }
    }).join(", ")
  }

  const getUnitStatusesString = () => {
    return infoUnit.status.map(status => {
      if (status.qty) {
        return `${status.name} (${status.qty})`
      } else {
        return status.name ? `${status.name}` : `${status}`
      }
    }).join(", ")
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
                <div style={{display: "flex"}}><span style={{flexBasis: "50%"}}>Сила:</span> <span className="stat-power">{infoUnit.power} ({infoUnit.unitState.baseStats.power})</span></div>
                <div style={{display: "flex"}}><span style={{flexBasis: "50%"}}>Життя:</span> <span className="stat-heals">{infoUnit.heals}/{infoUnit.unitState.baseStats.heals}</span></div>
                <div style={{display: "flex"}}><span style={{flexBasis: "50%"}}>Ініціатива:</span> <span className="stat-initiative">{infoUnit.initiative} ({infoUnit.unitState.baseStats.initiative})</span></div>
              </div>
              {infoUnit.abilities.keywords.length > 0 ?
                <div>
                  <div style={{textAlign: "center", marginTop: 5, borderBottom: "1px solid #cbcbcb"}}>Особливості</div>
                  <div style={{fontSize: 20}}>{infoUnit.abilities.keywords.join(", ")}</div>
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

export default UnitInfoPopup;
