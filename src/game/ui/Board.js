import React, {useState} from 'react';
import {HexGrid, Token} from './HexGrid';
import {
  getInGameUnits,
  isSame,
  logGameUi,
  logPlayerName,
  setEnemyMarks
} from '../helpers/Utils';
import {motion} from 'framer-motion';
import {Link} from "react-router-dom";
import BoardUser from "./BoardUser";
import BoardLogs from "./BoardLogs";
import UnitInfoPopup from "./UnitInfoPopup";
import {UnstablePointsUI} from "./UnstablePointsUI";
import BoardBuildings from "./BoardBuildings";
import BattleResults from "./BattleResults";
import {createPoint, playerColors} from "../helpers/Constants";
import {EssenceGiftsUI} from "./EssenceGiftsUI";
import AllUnitsPopup from "./AllUnitsPopup";
import UnitUI from "./UnitUI";
import UnitNamePopup from "./UnitNamePopup";

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
    const stage = props.ctx.activePlayers[+props.playerID]
    if (stage && stage === 'pickUnit') {
      const found = getInGameUnits(props.G).find((unit) => isSame(point)(unit.unitState.point))
      if (found && found.unitState.playerId === +props.playerID && found.unitState.isClickable === true) {
        props.moves.selectOldUnit(found);
      }
    } else if (stage && stage === 'placeUnit') {
      const found = props.G.players[+props.playerID].availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.moveUnit(found);
      }
    } else if (stage && stage === 'chooseBlockSideActionStage') {
      const found = props.G.players[+props.playerID].availablePoints.find(isSame(point));
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
    } else if (stage && stage === 'setItOnFireActionStage') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.setItOnFire(found);
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
    } else if (stage && stage === 'throwOverAction') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.throwOver(found);
      }
    } else if (stage && stage === 'setItOnFireActionStage') {
      const found = props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        props.moves.setItOnFire(found);
      }
    }
  }

  let colorMapSecret = {}
  if ((props.ctx.phase === "Setup")) {
    colorMapSecret = props.G.players[+props.playerID].grid.colorMap;
  } else {
    colorMapSecret = props.G.grid.colorMap;
  }

  const [isPopupAllUnitsOpen, setIsPopupAllUnitsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isNamePopupOpen, setIsNamePopupOpen] = useState(false);
  const [nameUnit, setNameUnit] = useState(false);
  const [nameUnitPosition, setNameUnitPosition] = useState(false);
  const [infoUnit, setInfoUnit] = useState(false);
  return (
      <div style={style}>
        <BoardUser props={props} info={[isPopupOpen, setIsPopupOpen, infoUnit, setInfoUnit]} />
        {props.ctx.phase === 'Building' ?
          <BoardBuildings style={hexStyle} props={props} />
          : <></>
        }
        {(props.ctx.phase === 'FinishBattle' ||  props.ctx.phase === null)?
          <BattleResults style={hexStyle} props={props} info={[isPopupOpen, setIsPopupOpen, infoUnit, setInfoUnit]} />
          : <></>
        }
        {(props.ctx.phase === 'Setup' || props.ctx.phase === 'Positioning' || props.ctx.phase === 'Fight') ?
          <HexGrid
            levels={props.G.grid.levels}
            players={props.ctx.numPlayers}
            style={hexStyle}
            colorMap={colorMapSecret}
            onClick={cellClicked}>
            {
              getInGameUnits(props.G, (unit) => (props.ctx.phase === "Setup") ? props.playerID && (unit.unitState.playerId === +props.playerID) : true).map((unit, i) => {
                const { x, y, z } = unit.unitState.point;
                return <Token x={x} y={y} z={z} key={i}>
                  <UnitUI
                    unit={unit}
                    highlight={((props.G.currentUnit && props.G.currentUnit.id === unit.id) || (props.playerID && props.G.players[+props.playerID].currentUnit && props.G.players[+props.playerID].currentUnit.id === unit.id))}
                    markEnemy={setEnemyMarks(props, unit)}
                    fightQueue={props.G.fightQueue}
                    info={[isPopupOpen, setIsPopupOpen, infoUnit, setInfoUnit]}
                    nameInfo={[isNamePopupOpen, setIsNamePopupOpen, nameUnit, setNameUnit, nameUnitPosition, setNameUnitPosition]}
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
            {
              props.G.grid.essencePoints.map((point, i) => {
                return <Token x={point.x} y={point.y} z={point.z} key={i+20000}>
                  <EssenceGiftsUI />
                </Token>
              })
            }
          </HexGrid>
          : <></>
        }
        <BoardLogs data={props} info={[isPopupAllUnitsOpen, setIsPopupAllUnitsOpen]}></BoardLogs>
        {
          props.G.winner !== undefined ?
            <motion.div
              className="winner-popup-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="winner-popup">
                <h2>{logGameUi('congrats')} {props.G.winner === -1 ? logGameUi('its_draw') : <span style={{color: playerColors[props.G.winner.id]}}>{logPlayerName(props.G.players.find(p => p.id === props.G.winner.id).id+1)}</span>}!</h2>
                <p>{logGameUi('you_won')}</p>
                {props.isMultiplayer ?
                  <div className="btn btn-primary"><Link to={"/"}>{logGameUi('new_game')}</Link></div> :
                  <div className="btn btn-primary" onClick={() => props.reset()}>{logGameUi('new_game')}</div>
                }
              </div>
            </motion.div> :
            <div></div>
        }
        <UnitInfoPopup props={props} info={[isPopupOpen, setIsPopupOpen, infoUnit, setInfoUnit]} />
        <UnitNamePopup props={props} info={[isNamePopupOpen, setIsNamePopupOpen, nameUnit, setNameUnit, nameUnitPosition, setNameUnitPosition]} />
        <AllUnitsPopup props={props} info={[isPopupAllUnitsOpen, setIsPopupAllUnitsOpen]} />

      </div>

  )
}
