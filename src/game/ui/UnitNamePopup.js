import './UnitInfo.css';
import React from "react";

const UnitNamePopup = (props) => {

  const [isNamePopupOpen, setIsNamePopupOpen, nameUnit, setNameUnit, nameUnitPosition, setNameUnitPosition] = props.info

  const popupStyle = {
    display: isNamePopupOpen ? "block" : "none",
    top: nameUnitPosition ? nameUnitPosition.y : 0,
    left: nameUnitPosition ? nameUnitPosition.x : 0,
  };

  if (isNamePopupOpen && nameUnit) {
    return (
      <div className="creature-name-popup" style={popupStyle}>
        <div className="popup">
          {nameUnit.name}
        </div>
      </div>
    )
  } else {
    return (<></>)
  }
}

export default UnitNamePopup;
