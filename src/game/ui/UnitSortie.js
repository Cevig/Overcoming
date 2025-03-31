import {playerColors, UnitTypes} from "../helpers/Constants";
import React from "react";
import {withTranslation} from "react-i18next";
import {logGameUi, logPlayerName, logUnitName} from "../helpers/Utils";

const UnitSortie = (props) => {
  const data = props.data
  const player = data.G.players.find(p => p.id === +data.playerID)

  const getSortieUnits = (p) => {
    return (
      <div className="sortie-info">
        {player.sortie.filter(su => su.playerId === p.id).map((su, i) => {
          return (<span key={Math.random().toString(10).slice(2)} style={{fontSize: 16, marginRight: 10}}>{logUnitName(su.unitName)}</span>)
        })}
        {player.currentUnit && !player.currentUnit.unitState.isInGame && player.currentUnit.type !== UnitTypes.Idol ?
          <span className='sortie-add' onClick={() => data.moves.unitToSortie(p.id)}>+</span>
          : <></>
        }
      </div>
    )
  }

  return (
    <div className="unit-list" style={{marginTop: 10}}>
      <div className="sortie-title">{logGameUi('sortie')}</div>
      {data.G.players.filter(p => p.isPlayerInGame).map((p, i) => {
        if (p.id === player.id) return (<></>)
        return (
          <div key={Math.random().toString(10).slice(2)} style={{position: "relative", height: 40}}>
            <div style={{color: playerColors[p.id], fontSize: 18, margin: 0}} className="results-p-name">{logPlayerName(p.id+1)}</div>
            {getSortieUnits(p)}
          </div>
        )
      })}
    </div>
  );
};

export default withTranslation()(UnitSortie);
