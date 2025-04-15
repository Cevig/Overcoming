import React from 'react';
import {playerColors} from "../helpers/Constants";
import './BoardLogs.css';
import {LanguageToggle} from "./LanguageToggle";
import {logBuilding, logGameUi, logPlayerName} from "../helpers/Utils";
import i18n from "../../i18n";
import {withTranslation} from "react-i18next";

const style = {
  display: 'flex',
  flexDirection: 'column',
  flexBasis: `21%`
};

const BoardLogs = (data) => {
  const props = data.data
  const player = props.G.players.find(p => p.id === +props.playerID);

  const [isPopupAllUnitsOpen, setIsPopupAllUnitsOpen] = data.info
  const togglePopup = () => {
    setIsPopupAllUnitsOpen(true);
  };

  return (
    <div style={style}>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div className="top-panel-tools">
          <div className="creature-wiki-button" onClick={togglePopup}>{logGameUi('wiki')}</div>
          <LanguageToggle />
        </div>

        {props.ctx.activePlayers && ((props.ctx.activePlayers[+player.id] === "purchase") ||
          (props.ctx.activePlayers[+player.id] === "pickUnit"))?
          <div className="leave-game-button" onClick={() => props.moves.surrender()}>{logGameUi('leave_game')}</div>
          : <></>
        }
      </div>
      {props.ctx.phase === 'Building' || props.ctx.phase === 'Setup' ?
        <div>
          <div className="player-info">
            <div className="player-name" style={{color: playerColors[player.id]}}>{logPlayerName(player.id+1)}</div>
            <div className="player-heals">{logGameUi('heals_cap')}: <span>{player.heals}&hearts;</span></div>
            <div className="player-resources">{logGameUi('essence')}: <span>{player.essence}✾</span></div>
            <div className="player-wins">{logGameUi('player_won')} {player.wins}</div>
            <div className="player-frags">{logGameUi('player_killed')} {player.killedUnits}</div>
          </div>
          <div>
            <div className="enemy-info" dangerouslySetInnerHTML={
              { __html: props.G.players.filter(p => p.id !== player.id)
                  .map(p => `<div>
                                  <div>
                                      <span style="color: ${playerColors[p.id]}">${logPlayerName(p.id+1)}</span>
                                      <span style="font-size: 12px">[${i18n.t('biom.'+p.bioms[0])}, ${i18n.t('biom.'+p.bioms[1])}]</span> -
                                      <span style="color: red">${p.heals}&hearts;</span>
                                      [<span>${p.essenceFreeze}✾</span>]
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
            <div className="player-name small-name" style={{color: playerColors[player.id]}}>{logPlayerName(player.id+1)}</div>
            <div><span style={{color: "red"}}>{player.heals}&hearts;</span> [<span>{player.essence}✾</span>]</div>
            <div style={{}}>{logGameUi('player_won')} {player.wins}</div>
            <div style={{}}>{logGameUi('player_killed')} {player.killedUnits}</div>
          </div>
          <div>
            <div className="enemy-info full" dangerouslySetInnerHTML={
              { __html: props.G.players.filter(p => p.id !== player.id)
                  .map(p => `<div>
                                  <div>
                                    <span style="color: ${playerColors[p.id]}">${logPlayerName(p.id+1)}</span>
                                    <span style="font-size: 12px">[${i18n.t('biom.'+p.bioms[0])}, ${i18n.t('biom.'+p.bioms[1])}]</span> -
                                    <span style="color: red">${p.heals}&hearts;</span>
                                    [<span>${p.essence}✾</span>] -
                                    <span style="font-size: 14px;">${p.houses.map(h => logBuilding(h.name).name).join(', ')}</span>
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

export default withTranslation()(BoardLogs)
