import React from 'react';
import {HexGrid, Token} from './custom/myHex';
import {createPoint, getInGameUnits, isSame} from '../utils';
import {UnitUI} from './UnitUI';
import {motion} from 'framer-motion';

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
      let found = this.props.colorMap[playerColor].find(isSame(point))
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
      handleFightMoves(point)
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

  const handleFightMoves = (point) => {
    const stage = props.ctx.activePlayers[+props.ctx.currentPlayer]
    if (stage && stage === 'pickUnitForAttack') {
      const found = getInGameUnits(props.G).find((unit) => isSame(point)(unit.unitState.point))
      if (found && props.G.fightQueue[0].unitId === found.unitState.unitId) {
        props.moves.selectUnitForAttack(found);
      }
    } else if (stage && stage === 'makeDamage') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.attackTarget(found);
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
                <UnitUI
                  unit={unit}
                  highlight={(props.G.currentUnit && props.G.currentUnit.unitState.point && isSame(props.G.currentUnit.unitState.point)(unit.unitState.point))}
                  markEnemy={(props.ctx.phase === "Fight") && (props.G.availablePoints.length > 0) && (props.G.availablePoints.find(isSame(unit.unitState.point)) !== undefined)}
                  fightQueue={props.G.fightQueue}
                />
              </Token>
            })
          }
        </HexGrid>
        <div>
          <div>Player: {player ? player.id + 1 : "Unknown"}</div>
          <div style={styles.moves}>
            {player ? player.units.map((unit, i) => {
              return unit.unitState.isInGame ?
                <div style={styles.move} key={i}>{unit.name}</div>:
                <div style={{ ...styles.move, ...styles.clickableMove }} onClick={() => props.moves.selectNewUnit(unit)} key={i}>{unit.name}</div>;
            }) : 0}
          </div>
        </div>
        <div>phase: {props.ctx.phase}</div>
        <div style={styles.move}>
          <button onClick={() => props.undo()}>Cancel</button>
        {props.ctx.phase === 'Setup' ?
          <button onClick={props.moves.complete}>Complete</button>
          : <span></span>
        }
        {props.ctx.activePlayers && ((props.ctx.activePlayers[+props.ctx.currentPlayer] === "placeUnitOnBoard") || (props.ctx.activePlayers[+props.ctx.currentPlayer] === "makeDamage")) ?
          <button onClick={props.moves.skipTurn}>Skip</button>
          : <span></span>
        }
        </div>
        {
          props.G.winner !== undefined ?
            <motion.div
              className="winner-popup-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="winner-popup">
                <h2>Congratulations {props.G.winner === -1 ? "it's a draw" : props.G.players.find(p => p.id === props.G.winner).name}!</h2>
                <p>You are the winner!</p>
              </div>
            </motion.div> :
            <div></div>
        }

      </div>

  )
}
