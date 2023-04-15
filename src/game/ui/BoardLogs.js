import React from 'react';
import {playerColors} from "../helpers/Constants";
import './BoardLogs.css';
import {gameLog} from "../helpers/Log";

const style = {
  display: 'flex',
  flexDirection: 'column',
  flexBasis: `21%`
};

const sentChatMessages = [];

export class BoardLogs extends React.Component {
  render () {
    const props = this.props.props
    const messages = gameLog.log.filter(log => sentChatMessages.find(mes => mes === log.id) === undefined)
    messages.forEach(message => {
      props.sendChatMessage(message)
      sentChatMessages.push(message.id)
    })
    return (
      <div style={style}>
        <div style={{textAlign: "center", color: playerColors[+props.ctx.currentPlayer], fontSize: 24}}>
          <span style={{color: "#444444"}}>Хід:</span> Гравець {player ? player.id + 1 : "Невідомий"}
        </div>
        <div className="log-container" dangerouslySetInnerHTML={
          { __html: props.chatMessages.map(note => `<div>> <span style="color: ${playerColors[note.payload.player]}">(${note.payload.turn})</span> - [${note.payload.phase}] - <span>${note.payload.text}</span></div>`).join('')}
        } />
        {/*<div className="log-container" dangerouslySetInnerHTML={*/}
        {/*  { __html: gameLog.log.map(note => `<div>> <span style="color: ${playerColors[note.player]}">(${note.turn})</span> - [${note.phase}] - <span>${note.text}</span></div>`).join('')}*/}
        {/*} />*/}
      </div>
    )
  }
}
