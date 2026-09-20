import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {useTranslation, withTranslation} from 'react-i18next';
import {Buildings, BuildingsType, UnitTypes} from "../helpers/Constants";
import "./BoardBuildings.css";
import {getHousePrice, logBuilding, logGameUi} from "../helpers/Utils";

const BuildingBuyButton = ({ house, player, onClick }) => {
  const isDisabled = getHousePrice(house, player) > player.essence || house.notAllowed;

  return (
    <div
      className={`building-info-buy ${isDisabled ? 'disabled' : ''}`}
      onClick={() => !isDisabled && onClick(house)}
    >
      {logGameUi('buy')}
    </div>
  );
};

const BuildingSellButton = ({ house, turn, isSellable, onClick }) => {
  if (turn !== house.turn) return null;

  return (
    <div
      className={`building-info-buy ${!isSellable ? 'disabled' : ''}`}
      onClick={() => isSellable && onClick(house)}
    >
      {logGameUi('return')}
    </div>
  );
};

const BuildingInfo = ({ house, player, onBuy, onSell, turn, isSellAvailable }) => {
  const buildingInfo = logBuilding(house.name);
  const housePrice = house.price > 0 ? `${getHousePrice(house, player)}✾` : '';

  return (
    <div className="building-info-wrapper">
      <div className="building-info-name" dangerouslySetInnerHTML={{ __html: buildingInfo.name}} />
      <div className="building-info-description">{buildingInfo.description}</div>
      <div className="building-info-price">{housePrice}</div>

      {onBuy && (
        <BuildingBuyButton
          house={house}
          player={player}
          onClick={onBuy}
        />
      )}

      {onSell && (
        <BuildingSellButton
          house={house}
          turn={turn}
          isSellable={isSellAvailable(house)}
          onClick={onSell}
        />
      )}
    </div>
  );
};

const BoardBuildings = ({ props, style }) => {
  const { t } = useTranslation();
  const player = props.G.players.find(p => p.id === +props.playerID);

  const isSellBuildingAvailable = (house) => {
    let isAllowed = true;
    const { VivtarPoplichnukiv, VivtarPoplichnukiv2, VivtarPoplichnukiv3,
            VivtarProminkoriv, VivtarProminkoriv2, VivtarProminkoriv3,
            VivtarVisnukiv, VivtarVisnukiv2, VivtarVisnukiv3 } = Buildings;

    // Map of building names to validation functions
    const validationMap = {
      [VivtarPoplichnukiv.name]: () =>
        !(player.units.find(u => u.type === UnitTypes.Prispeshnick && u.level === 1) ||
          player.houses.find(h => h.name === VivtarPoplichnukiv2.name)),

      [VivtarProminkoriv.name]: () =>
        !(player.units.find(u => u.type === UnitTypes.Prominkor && u.level === 1) ||
          player.houses.find(h => h.name === VivtarProminkoriv2.name)),

      [VivtarVisnukiv.name]: () =>
        !(player.units.find(u => u.type === UnitTypes.Vestnick && u.level === 1) ||
          player.houses.find(h => h.name === VivtarVisnukiv2.name)),

      [VivtarPoplichnukiv2.name]: () =>
        !(player.units.find(u => u.type === UnitTypes.Prispeshnick && u.level === 2) ||
          player.houses.find(h => h.name === VivtarPoplichnukiv3.name)),

      [VivtarProminkoriv2.name]: () =>
        !(player.units.find(u => u.type === UnitTypes.Prominkor && u.level === 2) ||
          player.houses.find(h => h.name === VivtarProminkoriv3.name)),

      [VivtarVisnukiv2.name]: () =>
        !(player.units.find(u => u.type === UnitTypes.Vestnick && u.level === 2) ||
          player.houses.find(h => h.name === VivtarVisnukiv3.name)),

      [VivtarPoplichnukiv3.name]: () =>
        !player.units.find(u => u.type === UnitTypes.Prispeshnick && u.level === 3),

      [VivtarProminkoriv3.name]: () =>
        !player.units.find(u => u.type === UnitTypes.Prominkor && u.level === 3),

      [VivtarVisnukiv3.name]: () =>
        !player.units.find(u => u.type === UnitTypes.Vestnick && u.level === 3)
    };

    // If we have a validation for this building, run it
    if (validationMap[house.name]) {
      isAllowed = validationMap[house.name]();
    }

    return isAllowed;
  };

  const getBuildingsByType = useMemo(() => {
    const buildingsByType = {};

    // Helper function to check if a building is allowed
    const isBuildingAllowed = (building) => {
      const dependencies = {
        [Buildings.VivtarPoplichnukiv2.name]: [Buildings.VivtarPoplichnukiv.name],
        [Buildings.VivtarPoplichnukiv3.name]: [Buildings.VivtarPoplichnukiv.name, Buildings.VivtarPoplichnukiv2.name],
        [Buildings.VivtarProminkoriv2.name]: [Buildings.VivtarProminkoriv.name],
        [Buildings.VivtarProminkoriv3.name]: [Buildings.VivtarProminkoriv.name, Buildings.VivtarProminkoriv2.name],
        [Buildings.VivtarVisnukiv2.name]: [Buildings.VivtarVisnukiv.name],
        [Buildings.VivtarVisnukiv3.name]: [Buildings.VivtarVisnukiv.name, Buildings.VivtarVisnukiv2.name],
      };

      if (!dependencies[building.name]) {
        return true;
      }

      return dependencies[building.name].every(depName =>
        player.houses.some(house => house.name === depName)
      );
    };

    // Group buildings by type
    Object.values(Buildings).forEach(building => {
      const playerHasBuilding = player.houses.some(house => house.name === building.name);

      if (!playerHasBuilding) {
        if (!buildingsByType[building.type]) {
          buildingsByType[building.type] = [];
        }

        const isAllowed = isBuildingAllowed(building);
        buildingsByType[building.type].push(
          isAllowed ? building : { ...building, notAllowed: true }
        );
      }
    });

    return buildingsByType;
  }, [player.houses, player.bioms]);

  const renderBuildingSection = (type) => {
    const buildings = getBuildingsByType[type] || [];
    if (buildings.length === 0) return null;

    return (
      <div className="buildings-type" key={type}>
        <div className="buildings-type-name">
          {t(`buildingsType.${type}`)}
          {type !== BuildingsType.Peace && (
            <div style={{ fontSize: 18, marginTop: 5 }}>
              [{t(`biom.${player.bioms[0]}`)}, {t(`biom.${player.bioms[1]}`)}]
            </div>
          )}
        </div>
        <div className="buildings-type-content">
          {buildings.map((house, i) => (
            <BuildingInfo
              key={i}
              house={house}
              player={player}
              onBuy={props.moves.buyHouse}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={style}>
      <div style={{ width: '100%' }}>
        <div className="buildings-container">
          <div className="buildings-head">{t('buildings.available')}</div>
          <div className="buildings-list">
            {renderBuildingSection(BuildingsType.Peace)}
            {renderBuildingSection(BuildingsType.Vivtar1)}
            {renderBuildingSection(BuildingsType.Vivtar2)}
            {renderBuildingSection(BuildingsType.Vivtar3)}
          </div>
        </div>
        <div className="buildings-divide"></div>
        <div className="buildings-container">
          <div className="buildings-head">{t('buildings.own')}</div>
          <div className="buildings-list">
            <div className="buildings-type">
              <div className="buildings-type-content">
                {player.houses.map((house, i) => (
                  <BuildingInfo
                    key={i}
                    house={house}
                    player={player}
                    turn={props.ctx.turn}
                    onSell={props.moves.sellHouse}
                    isSellAvailable={isSellBuildingAvailable}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BoardBuildings.propTypes = {
  props: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default React.memo(withTranslation()(BoardBuildings));
