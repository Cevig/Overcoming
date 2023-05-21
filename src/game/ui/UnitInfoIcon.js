import './UnitInfo.css';

const UnitInfoIcon = (props) => {
  const [isPopupOpen, setIsPopupOpen, infoUnit, setInfoUnit] = props.info
  const togglePopup = (e) => {
    if(e && e.stopPropagation) e.stopPropagation();
    setInfoUnit(props.currentUnit)
    setIsPopupOpen(true);
  };

  return (
    <>
      <g className="creature-popup-container" onClick={togglePopup}>
        <path stroke="#000" id="svg_45" d="m427.76,537.56999l0,0c0,-27.61424 22.38576,-50 50,-50l0,0c13.26082,0 25.97851,5.26784 35.35533,14.64466c9.37682,9.37682 14.64465,22.09452 14.64465,35.35534l0,0c0,27.61423 -22.38576,49.99999 -49.99999,49.99999l0,0c-27.61424,0 -50,-22.38576 -50,-49.99999zm50,-50l0,99.99999m-50,-49.99999l99.99999,0" stroke-width="0" fill="#999999"/>
        <text fontWeight="normal" transform="matrix(2.72853 0 0 2.72853 -803.764 -877.127)" stroke="#000" fontStyle="normal" xmlSpace="preserve" textAnchor="start" fontFamily="'Andada Pro'" fontSize="30" id="svg_147" y="528.267" x="465.3665" strokeWidth="0" fill="#ffffff">i</text>
      </g>
    </>
  )
}

export default UnitInfoIcon;
