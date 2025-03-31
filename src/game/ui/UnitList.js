import './UnitList.css';
import {createUnitObject} from "../units/Unit";
import {
  Buildings,
  playerColors,
  UnitKeywords,
  UnitTypes
} from "../helpers/Constants";
import {hasKeyword, logGameUi, logUnitName} from "../helpers/Utils";
import {withTranslation} from "react-i18next";
import i18n from "i18next";

const UnitList = (data) => {

  const player = data.data.G.players.find(p => p.id === +data.data.playerID)
  const ctx = data.data.ctx
  const newId = () => Math.random().toString(10).slice(2)
  const [isPopupOpen, setIsPopupOpen, infoUnit, setInfoUnit] = data.info

  const getAssignedUnits = () => {
    if (player !== undefined) {
      return player.bioms.flatMap(biom => {
          return [
            createUnitObject(newId(), 99, biom, UnitTypes.Idol, 0),
            createUnitObject(newId(), 99, biom, UnitTypes.Idol, 1),
            createUnitObject(newId(), 99, biom, UnitTypes.Prispeshnick, 0, 1),
            createUnitObject(newId(), 99, biom, UnitTypes.Prispeshnick, 0, 2),
            createUnitObject(newId(), 99, biom, UnitTypes.Prispeshnick, 0, 3),
            createUnitObject(newId(), 99, biom, UnitTypes.Prominkor, 0, 1),
            createUnitObject(newId(), 99, biom, UnitTypes.Prominkor, 0, 2),
            createUnitObject(newId(), 99, biom, UnitTypes.Prominkor, 0, 3),
            createUnitObject(newId(), 99, biom, UnitTypes.Vestnick, 0, 1),
            createUnitObject(newId(), 99, biom, UnitTypes.Vestnick, 0, 2),
            createUnitObject(newId(), 99, biom, UnitTypes.Vestnick, 0, 3)
          ]
        })
    } else return []
  }

  const getAvailableIdols = () => {
    return availableUnitsList.filter(u => u.type === UnitTypes.Idol)
  }

  const availableUnitsList = getAssignedUnits()
  const availableIdols = getAvailableIdols()

  // Handle the creation of a new unit instance
  const handleCreateUnit = (id, price) => {
    const chosenUnit = availableUnitsList.find(unit => unit.id === id)
    if (chosenUnit !== undefined) {
      const newUnit = createUnitObject(newId(), player.id, chosenUnit.biom, chosenUnit.type, chosenUnit.unitState.createPosition, chosenUnit.level)
      data.data.moves.summonUnit(newUnit, price)
    }
  };

  // Render the list of unit types
  const renderUnitTypes = () => {
    return Object.values(UnitTypes).map((type, i) => {
      return (
        <div key={i} className="unit-section">
          <h2>{logUnitName(type)}</h2>
          {renderAvailableUnits(type)}
        </div>
      );
    });
  };

  // Render the list of unit levels for a given type
  const renderAvailableUnits = (type) => {
    return availableUnitsList.filter(unit => unit.type === type)
      .filter(unit => unit.type === UnitTypes.Idol ? !!availableIdols.find(u => u.id === unit.id) : true)
      .filter(unit => {
        if (type === UnitTypes.Prispeshnick) {
          if (unit.level === 1) return !!player.houses.find(h => h.name === Buildings.VivtarPoplichnukiv.name)
          if (unit.level === 2) return !!player.houses.find(h => h.name === Buildings.VivtarPoplichnukiv2.name)
          if (unit.level === 3) return !!player.houses.find(h => h.name === Buildings.VivtarPoplichnukiv3.name)
        } else if (type === UnitTypes.Prominkor) {
          if (unit.level === 1) return !!player.houses.find(h => h.name === Buildings.VivtarProminkoriv.name)
          if (unit.level === 2) return !!player.houses.find(h => h.name === Buildings.VivtarProminkoriv2.name)
          if (unit.level === 3) return !!player.houses.find(h => h.name === Buildings.VivtarProminkoriv3.name)
        } else if (type === UnitTypes.Vestnick) {
          if (unit.level === 1) return !!player.houses.find(h => h.name === Buildings.VivtarVisnukiv.name)
          if (unit.level === 2) return !!player.houses.find(h => h.name === Buildings.VivtarVisnukiv2.name)
          if (unit.level === 3) return !!player.houses.find(h => h.name === Buildings.VivtarVisnukiv3.name)
        } else return true
      })
      .map((unit, i) => {
      return (
        <div key={unit.id} className="unit-row">
          <h3 style={{color: playerColors[+player.id]}}>{logUnitName(unit.name)} <span onClick={togglePopup.bind(this, unit)} style={{color: "grey", cursor: "pointer", fontSize: 20}}>&#9432;</span></h3>
          <div className="unit-details">
            <span>[{i18n.t('biom.'+unit.biom)}]</span>
            <div className="unit-stars">
              {unit.level !== undefined ? renderStars(unit.level) : ""}
            </div>
          </div>
          {handleSummonButton(unit)}
        </div>
      );
    });
  };

  const renderStars = (count) => {
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
        <h2>{logGameUi('own')}:</h2>
        <ul className="unit-instance-list">
          {player.units.map((unit) => {
            return (
              <li className={getSummonedUnitClass(unit)} key={unit.id} onClick={() => data.data.moves.selectNewUnit(unit)}>
                <h3 style={{color: playerColors[+player.id]}} >{logUnitName(unit.name)} <span onClick={togglePopup.bind(this, unit)} style={{color: "grey", fontSize: 20}}>&#9432;</span></h3>
                <div className="unit-stars">
                  {unit.level !== undefined ? renderStars(unit.level) : ""}
                </div>
                <div className="unit-removal" onClick={() => data.data.moves.sellUnit(unit)} dangerouslySetInnerHTML={{ __html: `${unit.price}✾` }}></div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const getSummonedUnitClass = (u) => {
    let className = 'unit-instance';
    if (u.unitState.isInGame && u.heals > 0) className += ' in-battle'
    if (u.heals <= 0) className += ' already-dead'
    if (u.unitState.isInSortie) className += ' in-sortie'
    return className
  }

  const handleSummonButton = (unit) => {
    let isDisable
    let price = 0
    if (unit.type === UnitTypes.Idol) {
      isDisable = !!player.units.find(u => u.type === unit.type)
      if (player.essence < unit.price) isDisable = true
      price = unit.price
    }
    else {
      isDisable = player.units.filter(u => u.type !== UnitTypes.Idol).length >= 6
      price = unit.price + (player.units.filter(u => u.type === unit.type).length * 2) + unit.level-1
      if (hasKeyword(unit, UnitKeywords.LowCost)) {
        price = 3;
      }
      if (player.essence < price) isDisable = true
    }
    return (
      isDisable ?
          <button className="unit-create-button disabled">
            {logGameUi('summon')} {price}✾
          </button> :
          <button className="unit-create-button" onClick={() => handleCreateUnit(unit.id, price)} dangerouslySetInnerHTML={{ __html: `<span style="font-weight: bold">${price}✾</span></br>${logGameUi('summon')}` }}>
          </button>
    )
  }

  return (
    <div className="unit-list">
      {ctx.phase === 'Setup' || ctx.phase === 'Building' ?
        <div className="unit-types">
          <h2>{logGameUi('available')}</h2>
          {renderUnitTypes()}
        </div> :
        <></>
      }
      {renderCreatedUnits()}
    </div>
  );
};

export default withTranslation()(UnitList);
