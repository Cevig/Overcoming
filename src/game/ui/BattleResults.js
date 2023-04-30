import React from 'react';
import {playerColors} from "../helpers/Constants";

export const BattleResults = (props) => {
  const data = props.props
  const style = props.style
  const player = data.G.players.find(p => p.id === +data.playerID);

  const [isPopupOpen, setIsPopupOpen, infoUnit, setInfoUnit] = props.info
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
        <div>Вцілілі Істоти</div>
        <div>
          {units.map((u, i) => {
            return (
              <div className="unit-instance" key={i} style={{border: "none", padding: 0, margin: "0 auto"}}>
                <h3 style={{color: playerColors[+p.id], fontSize: 18}} >{u.name} <span onClick={togglePopup.bind(this, u)} style={{color: "grey", fontSize: 19}}>&#9432;</span></h3>
              </div>
            )
          })
          }
        </div>
      </div>
    )
  }

  const addDamageButton = (p) => {
    if (p.id !== player.id && player.isPlayerInBattle && !player.dealtDamage) {
      return (
        <div className='building-info-buy' style={{margin: "auto", textAlign: "center"}} onClick={() => data.moves.damagePlayer(p.id)}>Атакувати Капітолій</div>
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
            <div key={i}>
              <div style={{color: playerColors[p.id]}} className="results-p-name">{p.name}</div>
              <div className="player-info" style={{fontSize: 24}}>
                <div><span style={{color: "red"}}>{p.heals}&hearts;</span> [<span style={{color: "black", fontWeight: "bold"}}>{p.essence}✾</span>]</div>
                <div>Здобуто перемог: {p.wins}</div>
                <div>Вбито істот: {p.killedUnits}</div>
                {showRemainUnits(p)}
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
