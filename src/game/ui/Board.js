import React, {useState} from 'react';
import {HexGrid, Token} from './HexGrid';
import {
  createPoint,
  getInGameUnits,
  isSame,
  setEnemyMarks
} from '../helpers/Utils';
import {UnitUI} from './UnitUI';
import {motion} from 'framer-motion';
import {Link} from "react-router-dom";
import {playerColors} from "../helpers/Constants";
import {startPositions} from "../state/Setup";
import {BoardUser} from "./BoardUser";
import {BoardLogs} from "./BoardLogs";
import UnitInfoPopup from "./UnitInfoPopup";
import {UnstablePointsUI} from "./UnstablePointsUI";

const style = {
  display: 'flex',
  margin: 5
  // backgroundImage: `url(${Background})`
  // backgroundColor: "#39546a",
};

const hexStyle = {
  display: 'flex',
  flexGrow: 1,
  flexBasis: `58%`,
  maxWidth: 1085,
  backgroundColor: "#39546a"
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
    } else if (stage && stage === 'chooseBlockSideActionStage') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.setBlockSide(found);
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
    } else if (stage && stage === 'doRaid') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.G.currentEnemySelectedId ? props.moves.replaceHeals(found) : props.moves.attackTarget(found);
      }
    } else if (stage && stage === 'showUrkaAction') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.moveAgain(found);
      }
    } else if (stage && stage === 'selectEnemyByUrka') {
      const found = getInGameUnits(props.G).find((unit) => isSame(point)(unit.unitState.point))
      const isItAvailablePoint = props.G.availablePoints.find(isSame(point));
      if (found && isItAvailablePoint) {
        props.moves.selectEnemy(found);
      }
    } else if (stage && stage === 'placeEnemyByUrka') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.moveEnemy(found);
      }
    } else if (stage && stage === 'healAllyActionStage') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.healAlly(found);
      }
    } else if (stage && stage === 'curseAbasyActionStage') {
      const found = getInGameUnits(props.G).find((unit) => isSame(point)(unit.unitState.point))
      const isItAvailablePoint = props.G.availablePoints.find(isSame(point));
      if (found && isItAvailablePoint) {
        props.moves.curseOrRecover(found);
      }
    } else if (stage && stage === 'throwWeaponActionStage') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.throwWeapon(found);
      }
    } else if (stage && stage === 'replaceUnitsActionStage') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        if (props.G.currentEnemySelectedId) props.moves.replaceUnits(found);
        else props.moves.replaceUnitsFirst(found);
      }
    } else if (stage && stage === 'setElokoCurseActionStage') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.setElokoCurse(found);
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
    } else if (stage && stage === 'hookUnitAction') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.hookUnit(found);
      }
    } else if (stage && stage === 'healAllyActionStage') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.healAlly(found);
      }
    } else if (stage && stage === 'curseAbasyActionStage') {
      const found = getInGameUnits(props.G).find((unit) => isSame(point)(unit.unitState.point))
      const isItAvailablePoint = props.G.availablePoints.find(isSame(point));
      if (found && isItAvailablePoint) {
        props.moves.curseOrRecover(found);
      }
    } else if (stage && stage === 'replaceUnitsActionStage') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        if (props.G.currentEnemySelectedId) props.moves.replaceUnits(found);
        else props.moves.replaceUnitsFirst(found);
      }
    }
  }

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

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [infoUnit, setInfoUnit] = useState(false);
  return (
      <div style={style}>
        <BoardUser props={props} info={[isPopupOpen, setIsPopupOpen, infoUnit, setInfoUnit]} />
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
                  markEnemy={setEnemyMarks(props, unit)}
                  fightQueue={props.G.fightQueue}
                  info={[isPopupOpen, setIsPopupOpen, infoUnit, setInfoUnit]}
                />
              </Token>
            })
          }
          {
            props.G.grid.unstablePoints.map((point, i) => {
              return <Token x={point.x} y={point.y} z={point.z} key={i+10000}>
                <UnstablePointsUI />
              </Token>
            })
          }
        </HexGrid>
        <BoardLogs props={props} info={isPopupOpen}></BoardLogs>
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
        <UnitInfoPopup props={props} info={[isPopupOpen, setIsPopupOpen, infoUnit, setInfoUnit]} />

      </div>

  )
}
