import React from 'react';
// import { HexGrid } from 'boardgame.io/ui';
import {HexGrid, Token} from './custom/myHex';
import {createPoint, getInGameUnits, isSame} from '../utils';
import {UnitUI} from './UnitUI';

const style = {
  display: 'flex',
  flexDirection: 'column'
};

const hexStyle = {
  display: 'flex',
  flexGrow: 1,
  width: 1100,
  backgroundColor: "#39546a"
}

const styles = {
  moves: {
    display: 'flex',
    flexDirection: 'row',
  },
  move: {
    padding: 5,
    border: '1px solid black',
    backgroundColor: 'grey',
  },
  clickableMove: {
    cursor: 'pointer',
    backgroundColor: 'white',
  }
}
const getCellColor_old = HexGrid.prototype._getCellColor;

HexGrid.prototype._getCellColor = function(...coords) {
  const color = getCellColor_old.bind(this)(...coords);
  let result = color
  if (color === 'white') {
    let point = createPoint(...coords)
    for (const playerColor in this.props.colorMap) {
      let found = this.props.colorMap[playerColor].find(coord => isSame(coord)(point))
      if (found !== undefined && isSame(found)(point)) {
        result = playerColor;
        break;
      }
    }
  }
  return result;
}

export function Board (props) {

  const cellClicked = ({ x, y, z }) => {
    const phase = props.ctx.phase;
    const point = createPoint(x, y, z);
    if (phase === 'Setup') {
      handleSetupMoves(point)
    } else if (phase === 'Positioning') {
      handlePositioningMoves(point)
    } else if (phase === 'Fight') {

    }
  }
  const handleSetupMoves = (point) => {
    const stage = props.ctx.activePlayers[+props.ctx.currentPlayer]
    if (stage && stage === 'pickUnit') {
      const found = getInGameUnits(props.G).find((unit) => isSame(point)(unit.unitState.point))
      if (found && found.unitState.playerId === +props.ctx.currentPlayer && found.unitState.isClickable === true) {
        props.moves.selectOldUnit(found);
      }
    } else if (stage && stage === 'placeUnit') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.moveUnit(found);
      }
    }
  }

  const handlePositioningMoves = (point) => {
    const stage = props.ctx.activePlayers[+props.ctx.currentPlayer]
    if (stage && stage === 'pickUnitOnBoard') {
      const found = getInGameUnits(props.G).find((unit) => isSame(point)(unit.unitState.point))
      if (found && found.unitState.playerId === +props.ctx.currentPlayer && found.unitState.isClickable === true) {
        props.moves.selectUnitOnBoard(found);
      }
    } else if (stage && stage === 'placeUnitOnBoard') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.moveUnitOnBoard(found);
      }
    }
  }

  const player = props.G.players.find(p => p.id === +props.ctx.currentPlayer);
  return (
      <div style={style}>
        <HexGrid
          levels={props.G.grid.levels}
          style={hexStyle}
          colorMap={props.G.grid.colorMap}
          onClick={cellClicked}>
          {
            getInGameUnits(props.G).map((unit, i) => {
              const { x, y, z } = unit.unitState.point;
              return <Token x={x} y={y} z={z} key={i}>
                <UnitUI unit={unit} />
              </Token>
            })
          }
        </HexGrid>
        <div>
          <div>Player: {player.id}</div>
          <div style={styles.moves}>
            {player.units.map((unit, i) => {
              return unit.unitState.isInGame ?
                <div style={styles.move} key={i}>{unit.name}</div>:
                <div style={{ ...styles.move, ...styles.clickableMove }} onClick={() => props.moves.selectNewUnit(unit)} key={i}>{unit.name}</div>;
            })}
          </div>
        </div>
        <div>phase: {props.ctx.phase}</div>
        <button onClick={() => props.undo()}>Cancel</button>
        {props.ctx.phase === 'Setup' ?
          <button onClick={props.moves.complete}>Complete</button>
          : <div></div>
        }
        {props.ctx.phase === 'Fight' ?
          <button onClick={props.moves.finish}>Finish</button>
          : <div></div>
        }
      </div>
  )
}
