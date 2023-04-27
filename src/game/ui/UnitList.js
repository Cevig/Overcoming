import {useState} from 'react';
import './UnitList.css';
import {createUnitObject} from "../units/Unit";
import {playerColors, UnitTypes} from "../helpers/Constants";

const UnitList = (data) => {

  const player = data.data.G.players.find(p => p.id === +data.data.playerID)
  const ctx = data.data.ctx
  const newId = () => Math.random().toString(10).slice(2)
  const [isPopupOpen, setIsPopupOpen, infoUnit, setInfoUnit] = data.info

  const getAssignedUnits = () => {
    if (player !== undefined) {
      return player.bioms.flatMap(biom => {
          return [
            createUnitObject(newId(), 99, biom),
            createUnitObject(newId(), 99, biom, UnitTypes.Idol, 1),
            createUnitObject(newId(), 99, biom, UnitTypes.Prispeshnick),
            createUnitObject(newId(), 99, biom, UnitTypes.Ispolin),
            createUnitObject(newId(), 99, biom, UnitTypes.Vestnick),
          ]
        })
    } else return []
  }

  const availableUnitsList = getAssignedUnits()
  const starHandler = [
    useState(1),
    useState(1),
    useState(1),
    useState(1),
    useState(1),
    useState(1),

    useState(1),
    useState(1),
    useState(1),
    useState(1),
    useState(1),
    useState(1),
  ]
  // const [selectedStars, setSelectedStars] = useState(1);
  // Define the state for the list of created unit instances
  const [createdUnits, setCreatedUnits] = useState([]);

  // Handle the creation of a new unit instance
  const handleCreateUnit = (id) => {
    const chosenUnit = availableUnitsList.find(unit => unit.id === id)
    if (chosenUnit !== undefined) {
      const index = availableUnitsList.filter(u => u.type !== UnitTypes.Idol).indexOf(chosenUnit);
      const [selectedStars] = index !== -1 ? starHandler[index] : [1];
      const newUnit = createUnitObject(newId(), player.id, chosenUnit.biom, chosenUnit.type, chosenUnit.unitState.createPosition, selectedStars)
      data.data.moves.summonUnit(newUnit)
      setCreatedUnits([...createdUnits, newUnit])
    }
  };

  // Render the list of unit types
  const renderUnitTypes = () => {
    return Object.values(UnitTypes).map((type, i) => {
      return (
        <div key={i} className="unit-section">
          <h2>{type}</h2>
          {renderAvailableUnits(type)}
        </div>
      );
    });
  };

  // Render the list of unit levels for a given type
  const renderAvailableUnits = (type) => {
    return availableUnitsList.filter(unit => unit.type === type)
      .map((unit, i) => {
      return (
        <div key={unit.id} className="unit-row">
          <h3 style={{color: playerColors[+player.id]}}>{unit.name} <span onClick={togglePopup.bind(this, unit)} style={{color: "grey", cursor: "pointer", fontSize: 20}}>&#9432;</span></h3>
          <span>[{unit.biom}]</span>
          <div className="unit-stars">
            {unit.level !== undefined ? renderStars(unit.level, unit) : ""}
          </div>
          <button
            className="unit-create-button"
            onClick={() => handleCreateUnit(unit.id)}
          >
            Призвати
          </button>
        </div>
      );
    });
  };

  const handleStarClick = (e) => {
    const currentStar = e.target;
    const stars = currentStar.parentNode.children;

    // Get the index of the current star in the list of stars
    const index = Array.from(stars).indexOf(currentStar);

    // Update the selected stars state

    const setSelectedStars = starHandler[+currentStar.getAttribute('handler')][1];
    setSelectedStars(index + 1);

    // Update the class of the previous siblings to make them active
    for (let i = 0; i <= index; i++) {
      stars[i].classList.remove("star-sad");
      stars[i].classList.add("star-active");
    }

    // Update the class of the following siblings to make them inactive
    for (let i = index + 1; i < stars.length; i++) {
      stars[i].classList.remove("star-active");
      stars[i].classList.add("star-sad");
    }
  };

  // Render the star icons for a given level
  const renderStars = (count, unit) => {
    const stars = [];
    const index = availableUnitsList.filter(u => u.type !== UnitTypes.Idol).indexOf(unit);
    const [selectedStars] = starHandler[index];
    for (let i = 0; i < 3; i++) {
      if (selectedStars-1 >= i) {
        stars.push(<i key={i} handler={index} className="star star-active" onClick={handleStarClick}></i>);
      } else {
        stars.push(<i key={i} handler={index} className="star star-sad" onClick={handleStarClick}></i>);
      }
    }
    return stars;
  };

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

  const togglePopup = (unit, e) => {
    if(e && e.stopPropagation) e.stopPropagation();
    setInfoUnit(unit)
    setIsPopupOpen(true);
  };

  // Render the list of created unit instances
  const renderCreatedUnits = () => {
    return (
      <div className="created-wrapper">
        <h2>Призвані істоти:</h2>
        <ul className="unit-instance-list">
          {createdUnits.filter(unit => unit.unitState.playerId === player.id).map((unit) => {
            return (
              <li className="unit-instance" key={unit.id} onClick={() => data.data.moves.selectNewUnit(unit)}>
                <h3 style={{color: playerColors[+player.id]}} >{unit.name} <span onClick={togglePopup.bind(this, unit)} style={{color: "grey", fontSize: 20}}>&#9432;</span></h3>
                <div className="unit-stars">
                  {unit.level !== undefined ? renderStarsCreated(unit.level) : ""}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="unit-list">
      {ctx.phase === 'Setup' ?
        <div className="unit-types">
          <h2>Доступні істоти</h2>
          {renderUnitTypes()}
        </div> :
        <></>
      }
      {renderCreatedUnits()}
    </div>
  );
};

export default UnitList;
