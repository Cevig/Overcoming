import {playerColors, UnitTypes} from "../helpers/Constants";
import React from "react";
import {withTranslation} from "react-i18next";
import {logGameUi, logUnitName} from "../helpers/Utils";

const UnitSortie = (props) => {
  const data = props.data;
  const player = data.G.players.find(p => p.id === +data.playerID);

  const getSortieUnits = (p) => {
    return (
      <div className="sortie-info">
        {player.sortie.filter(su => su.playerId === p.id).map((su, index) => (
            <span key={`${p.id}-sortie-${index}`} style={{ fontSize: 16, marginRight: 10 }}>
              {logUnitName(su.unitName)}
            </span>
        ))}
        {player.currentUnit && !player.currentUnit.unitState.isInGame && player.currentUnit.type !== UnitTypes.Idol ? (
          <span key={`${p.id}-sortie-add`} className="sortie-add" onClick={() => data.moves.unitToSortie(p.id)}>+</span>
        ) : null}
      </div>
    );
  };

  return (
    <div className="unit-list" style={{ marginTop: 10 }}>
      <div className="sortie-title">{logGameUi('sortie')}</div>
      {data.G.players.filter(p => p.isPlayerInGame).map(p => {
        if (p.id === player.id) return null;
        return (
          <div key={p.id} style={{ position: "relative", height: 40 }}>
            <div style={{ color: playerColors[p.id], fontSize: 18, margin: 0 }} className="results-p-name">
              {p.name}
            </div>
            {getSortieUnits(p)}
          </div>
        );
      })}
    </div>
  );
};

export default withTranslation()(UnitSortie);
