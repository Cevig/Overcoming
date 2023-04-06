import React from 'react';
import {HexGrid, Token} from './HexGrid';
import {createPoint, getInGameUnits, isSame} from '../helpers/Utils';
import {UnitUI} from './UnitUI';
import {motion} from 'framer-motion';
import {Link} from "react-router-dom";
import {UnitTypes} from "../units/Unit";
import {playerColors} from "../helpers/Constants";
import {startPositions} from "../state/Setup";

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
  let colorMapSecret = {}
  if ((props.ctx.phase === "Setup") && (props.ctx.currentPlayer !== props.playerID)) {
    colorMapSecret = {
        [playerColors[0]]: startPositions[0],//red
        [playerColors[1]]: startPositions[1],//blue
        [playerColors[2]]: startPositions[2],//green
        [playerColors[3]]: startPositions[3]//yellow
      }
  } else {
    colorMapSecret = props.G.grid.colorMap;
  }
  return (
      <div style={style}>
        <HexGrid
          levels={props.G.grid.levels}
          style={hexStyle}
          colorMap={colorMapSecret}
          onClick={cellClicked}>
          {
            getInGameUnits(props.G, (unit) => (props.ctx.phase === "Setup") ? props.playerID && (unit.unitState.playerId === +props.playerID) : true).map((unit, i) => {
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
            {props.playerID ? props.G.players.find(p => p.id === +props.playerID).units.map((unit, i) => {
              return unit.unitState.isInGame ?
                <div style={styles.move} key={i}>{unit.name}
                  {(unit.type !== UnitTypes.Idol) ?
                    [...Array(unit.level).keys()].map(() => "*").join('') : ""
                  }
                  {(unit.type !== UnitTypes.Idol) ?
                    <span style={styles.biom}>[{unit.biom}]</span>: ""
                  }
                </div>:
                <div style={{ ...styles.move, ...styles.clickableMove }} onClick={() => props.moves.selectNewUnit(unit)} key={i}>{unit.name}
                  {(unit.type !== UnitTypes.Idol) ?
                    [...Array(unit.level).keys()].map(() => "*").join('') : ""
                  }
                  {(unit.type !== UnitTypes.Idol) ?
                    <span style={styles.biom}>[{unit.biom}]</span>: ""
                  }
                </div>;
            }) : 0}
          </div>
        </div>
        <div>phase: {props.ctx.phase}</div>
        <div style={styles.move}>
          <button onClick={() => props.undo()}>Cancel</button>
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
          {props.ctx.activePlayers && (props.ctx.activePlayers[+props.ctx.currentPlayer] === "makeDamage") ?
            <button onClick={() => props.moves.skipTurn()}>Skip</button>
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
                {props.isMultiplayer ?
                  <div className="btn btn-primary"><Link to={"/"}>Restart</Link></div> :
                  <div className="btn btn-primary" onClick={() => props.reset()}>Restart</div>
                }
              </div>
            </motion.div> :
            <div></div>
        }

      </div>

  )
}
