import React from 'react';
import {playerColors} from "../helpers/Constants";
import UnitList from "./UnitList";

const styles = {
  moves: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  move: {
    padding: 5,
    border: '1px solid black',
    backgroundColor: 'grey',
    marginRight: 5,
    flexBasis: '18%',
    textAlign: 'center',
    marginTop: 5
  },
  clickableMove: {
    cursor: 'pointer',
    backgroundColor: 'white',
  },
  biom: {
    fontSize: 12,
    marginLeft: 3
  },

  mainStyles: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: `21%`,
    paddingRight: 10,
    maxWidth: 400
  },
  actions: {
    padding: 5,
    border: '1px solid black',
    backgroundColor: 'grey',
    marginRight: 5,
    textAlign: 'center',
    marginTop: 5
  },

  units: {
    display: 'flex',
    flexDirection: 'column'
  }
}

export class BoardUser extends React.Component {
  render () {
    const props = this.props.props
    return (
      <div style={styles.mainStyles}>
        <UnitList data={props} />
        {/*<div>phase: {props.ctx.phase}</div>*/}
        <div style={{color: playerColors[+props.playerID], textAlign: "center", marginTop: 20}}>Actions</div>
        <div style={styles.actions}>
          <button onClick={() => props.undo()}>Back</button>
          {props.ctx.activePlayers && (props.ctx.activePlayers[+props.playerID] === "placeUnit") ?
            <button onClick={() => props.moves.removeUnit()}>Remove</button>
            : <span></span>
          }
          {props.ctx.phase === 'Setup' ?
            <button onClick={() => props.moves.complete()}>Complete</button>
            : <span></span>
          }
          {props.ctx.activePlayers && (props.ctx.activePlayers[+props.ctx.currentPlayer] === "placeUnitOnBoard") ?
            <button onClick={() => props.moves.skipTurn()}>Skip</button>
            : <span></span>
          }
          {props.ctx.activePlayers && (props.ctx.activePlayers[+props.ctx.currentPlayer] === "doRaid") ?
            <button onClick={() => props.moves.skipTurn()}>Skip</button>
            : <span></span>
          }
          {props.ctx.activePlayers && (props.ctx.activePlayers[+props.ctx.currentPlayer] === "makeDamage") ?
            <button onClick={() => props.moves.skipTurn()}>Skip</button>
            : <span></span>
          }
        </div>
      </div>
    )
  }
}
