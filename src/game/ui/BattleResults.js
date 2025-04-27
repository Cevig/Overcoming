import React from 'react';
import {Buildings, playerColors} from "../helpers/Constants";
import {
  calculateSortie,
  logBuilding,
  logGameUi,
  logUnitName
} from "../helpers/Utils";
import i18n from "../../i18n";
import {withTranslation} from "react-i18next";

const BattleResults = (props) => {
  const data = props.props
  const style = props.style
  const player = data.G.players.find(p => p.id === +data.playerID);

  const [setIsPopupOpen, setInfoUnit, setIsNamePopupOpen] = props.info
  const togglePopup = (unit, e) => {
    if(e && e.stopPropagation) e.stopPropagation();
    setInfoUnit(unit)
    setIsPopupOpen(true);
  };

  const showRemainUnits = (p) => {
    const units = p.units.filter(u => u.unitState.isInGame)
    if (units.length === 0) return (<></>)

    return (
      <div style={{textAlign: "center", marginTop: 10, borderTop: "1px solid darkgrey"}}>
        <div>{logGameUi('survived_creatures')}</div>
        <div>
          {units.map((u, i) => {
            setIsNamePopupOpen(false);
            return (
              <div className="unit-instance" key={Math.random().toString(10).slice(2)} style={{border: "none", padding: 0, margin: "0 auto"}}>
                <h3 style={{color: playerColors[+p.id], fontSize: 18}} >{logUnitName(u.name)} <span onClick={togglePopup.bind(this, u)} style={{color: "#d6d9d9", fontSize: 19}}>&#9432;</span></h3>
              </div>
            )
          })
          }
        </div>
      </div>
    )
  }

  const showSortieUnits = (p) => {
    return (
      <div style={{textAlign: "center", marginTop: 10, borderTop: "1px solid darkgrey"}}>
        <div style={{fontSize: 20}}>{logGameUi('sortie_results')}</div>
        <div>
          {calculateSortie(data.G, p).map((res, i) => {
            return (
              <div style={{marginBottom: 10}}>
                <div style={{color: playerColors[res.player.id], fontSize: 16}}>{player.name}:</div>
                <div style={{fontSize: 16}}>{i18n.t('sortieTypes.'+res.type)}</div>
              </div>
            )
          })
          }
        </div>
        {p.houses.find(h => h.name === Buildings.NebesnaBrama.name) !== undefined ?
          <div style={{fontSize: 20}}>{i18n.t('game.income', {building: logBuilding('nebesnaBrama').name})} <span style={{fontWeight: "bold"}}>+{3 * p.units.filter(u => u.unitState.isInSortie).length}✾</span></div>
          : <></>
        }
      </div>
    )
  }

  const addDamageButton = (p) => {
    if (p.id !== player.id && player.isPlayerInBattle && !player.dealtDamage) {
      return (
        <div className='building-info-buy' style={{margin: "auto", textAlign: "center"}} onClick={() => data.moves.damagePlayer(p.id)}>{i18n.t('game.attack', {name: logBuilding('kapitoliy').name})}</div>
      )
    } else {
      return (<></>)
    }
  }

  const showPlayersList = () => {
    return (
      <div className="results-p-container">
        {data.G.players.filter(p => p.isPlayerInGame).map((p, i) => {
          return (
            <div key={Math.random().toString(10).slice(2)}>
              <div style={{color: playerColors[p.id]}} className="results-p-name">{p.name}</div>
              <div className="player-info" style={{fontSize: 24}}>
                <div><span style={{color: "red"}}>{p.heals}&hearts;</span> [<span>{p.essence}✾</span>]</div>
                <div>{logGameUi('player_won')} {p.wins}</div>
                <div>{logGameUi('player_killed')} {p.killedUnits}</div>
                {showRemainUnits(p)}
                {showSortieUnits(p)}
              </div>
              {addDamageButton(p)}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div style={style}>
      {showPlayersList()}
    </div>
  )
}

export default withTranslation()(BattleResults)
