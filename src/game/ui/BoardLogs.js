import React from 'react';
import {playerColors} from "../helpers/Constants";
import './BoardLogs.css';

const style = {
  display: 'flex',
  flexDirection: 'column',
  flexBasis: `21%`
};

export const BoardLogs = (data) => {
  const props = data.data
  const player = props.G.players.find(p => p.id === +props.playerID);

  const [isPopupAllUnitsOpen, setIsPopupAllUnitsOpen] = data.info
  const togglePopup = () => {
    setIsPopupAllUnitsOpen(true);
  };

  return (
    <div style={style}>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div className="creature-wiki-button" onClick={togglePopup}>Істотопедія</div>
        {props.ctx.activePlayers && ((props.ctx.activePlayers[+player.id] === "purchase") ||
          (props.ctx.activePlayers[+player.id] === "pickUnit"))?
          <div className="leave-game-button" onClick={() => props.moves.surrender()}>Покинути гру</div>
          : <></>
        }
      </div>
      {props.ctx.phase === 'Building' || props.ctx.phase === 'Setup' ?
        <div>
          <div className="player-info">
            <div className="player-heals">Життя Капітолію: <span>{player.heals}&hearts;</span></div>
            <div className="player-resources">Есенції: <span>{player.essence}✾</span></div>
            <div className="player-wins">Здобуто перемог: {player.wins}</div>
            <div className="player-frags">Вбито істот: {player.killedUnits}</div>
          </div>
          <div>
            <div className="enemy-info" dangerouslySetInnerHTML={
              { __html: props.G.players.filter(p => p.id !== player.id)
                  .map(p => `<div>
                                  <div>
                                      <span style="color: ${playerColors[p.id]}">${p.name}</span>
                                      <span style="font-size: 12px">[${p.bioms[0]}, ${p.bioms[1]}]</span> -
                                      <span style="color: red">${p.heals}&hearts;</span>
                                      [<span style="color: black; font-weight: bold">${p.essenceFreeze}✾</span>]
                                  </div>
                                </div>`).join('')}
            } />
          </div>
        </div>
        : <></>
      }
      {props.ctx.phase === 'Positioning' || props.ctx.phase === 'Fight' || props.ctx.phase === 'FinishBattle' ?
        <div>
          <div className="player-info" style={{fontSize: 18}}>
            <div><span style={{color: "red"}}>{player.heals}&hearts;</span> [<span style={{color: "black", fontWeight: "bold"}}>{player.essence}✾</span>]</div>
            <div style={{}}>Здобуто перемог: {player.wins}</div>
            <div style={{}}>Вбито істот: {player.killedUnits}</div>
          </div>
          <div>
            <div className="enemy-info full" dangerouslySetInnerHTML={
              { __html: props.G.players.filter(p => p.id !== player.id)
                  .map(p => `<div>
                                  <div>
                                    <span style="color: ${playerColors[p.id]}">${p.name}</span>
                                    <span style="font-size: 12px">[${p.bioms[0]}, ${p.bioms[1]}]</span> -
                                    <span style="color: red">${p.heals}&hearts;</span>
                                    [<span style="color: black; font-weight: bold">${p.essence}✾</span>] -
                                    <span style="font-size: 14px;">${p.houses.map(h => h.name).join(', ')}</span>
                                  </div>
                                </div>`).join('')}
            } />
          </div>
        </div>
        : <></>
      }
      <div className="log-container">
        <div style={{display: "flex", flexDirection: "column"}} dangerouslySetInnerHTML={
          { __html: props.G.serverMsgLog.map(note => `<div>> <span style="color: ${playerColors[note.player]}">(${note.turn})</span> - <span>${note.text}</span></div>`).join('')}
        } />
      </div>

    </div>
  )
}
