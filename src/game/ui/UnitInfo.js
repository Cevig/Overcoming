import {useState} from "react";
import './UnitInfo.css';

const UnitInfo = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const togglePopup = (e) => {
    setX(e.clientX > (window.outerWidth/2) ? e.clientX - 1500 : e.clientX + 1500);
    setY(e.clientY > (window.outerHeight/2) ? e.clientY - 2500 : e.clientY + 1000);
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <>
      <g className="creature-popup-container">
        <path id="info_unit" onMouseOver={togglePopup} onMouseLeave={togglePopup} stroke="#000" fill="#999999" strokeWidth="0" d="m490.71979,515.78975c-20.71066,0 -37.50001,16.78938 -37.50001,37.50001c0,20.7111 16.78935,37.50002 37.50001,37.50002c20.7111,0 37.50002,-16.78893 37.50002,-37.50002c0,-20.71063 -16.78892,-37.50001 -37.50002,-37.50001zm-3.2072,16.85877l6.2441,0l0,6.64173l-6.2441,0l0,-6.64173zm10.33367,40.30757l-6.86811,0c-2.66829,0 -3.80611,-1.13533 -3.80611,-3.86023l0,-17.71259c0,-0.85139 -0.45374,-1.24901 -1.24853,-1.24901l-2.27065,0l0,-6.13288l6.86859,0c2.67028,0 3.80315,1.19191 3.80315,3.85974l0,17.76967c0,0.79727 0.45374,1.24904 1.24853,1.24904l2.27067,0l0,6.07628l0.00245,0l0,0l0.00001,0z" />
        {isPopupOpen && (
          <foreignObject className="creature-popup" width="2000" height="2000" transform={`translate(${x} ${y})`}>
            <h1>HELLO!</h1>
            {/*<div className="creature-image">*/}
            {/*  <img src={props.image} alt={props.name} />*/}
            {/*</div>*/}
            {/*<div className="creature-info">*/}
            {/*  <div className="creature-name">{props.name}</div>*/}
            {/*  <div className="creature-type">Type: {props.type}</div>*/}
            {/*  <div className="creature-origin">Origin: {props.origin}</div>*/}
            {/*  <div className="creature-level">Level: {props.level}</div>*/}
            {/*  <div className="creature-stats">*/}
            {/*    <div>Power: {props.power}</div>*/}
            {/*    <div>Heals: {props.heals}</div>*/}
            {/*    <div>Initiative: {props.initiative}</div>*/}
            {/*  </div>*/}
            {/*  <div className="creature-applied-statuses">*/}
            {/*    <div>Current applied statuses: {props.appliedStatuses.join(", ")}</div>*/}
            {/*    <div>Abilities: {props.abilities.join(", ")}</div>*/}
            {/*    <div>Keywords: {props.keywords.join(", ")}</div>*/}
            {/*  </div>*/}
            {/*  <div className="creature-description">*/}
            {/*    <div className="description-left">{props.description}</div>*/}
            {/*    <div className="description-right">{props.description}</div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </foreignObject>
          )
        }
      </g>
    </>
  )
}

export default UnitInfo;
