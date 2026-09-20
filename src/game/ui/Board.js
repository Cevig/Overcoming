import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {HexGrid, Token} from './HexGrid';
import {
  getInGameUnits,
  isSame,
  logGameUi,
  setEnemyMarks
} from '../helpers/Utils';
import {motion} from 'framer-motion';
import {Link} from "react-router-dom";
import BoardUser from "./BoardUser";
import BoardLogs from "./BoardLogs";
import UnitInfoPopup from "./UnitInfoPopup";
import BoardBuildings from "./BoardBuildings";
import BattleResults from "./BattleResults";
import {createPoint, playerColors} from "../helpers/Constants";
import {EssenceGiftsUI} from "./EssenceGiftsUI";
import AllUnitsPopup from "./AllUnitsPopup";
import UnitUI from "./UnitUI";
import UnitNamePopup from "./UnitNamePopup";
import './Hex.css';
import './Board.css'; // Create this file for the styles defined below

// Extracted the action handler to make it more maintainable
const useActionHandlers = (G, ctx, moves, playerID) => {
  // Generic function to handle unit clicks
  const handleUnitClick = useCallback((point, unitPredicate, moveFunction) => {
    const found = getInGameUnits(G).find((unit) => isSame(point)(unit.unitState.point));
    if (found && unitPredicate(found)) {
      moveFunction(found);
    }
  }, [G]);

  // Generic function to handle point clicks - optimized with early return
  const handlePointClick = useCallback((point, pointsToCheck, moveFunction, conditionalFunc = null) => {
    if (!pointsToCheck || pointsToCheck.length === 0) return;

    const found = pointsToCheck.find(isSame(point));
    if (found === undefined) return;

    if (conditionalFunc) {
      conditionalFunc(found);
    } else if (moveFunction) {
      moveFunction(found);
    }
  }, []);

  // Handle setup phase moves
  const handleSetupMoves = useCallback((point) => {
    const stage = ctx.activePlayers[+playerID];
    if (!stage) return;

    switch (stage) {
      case 'pickUnit':
        handleUnitClick(
          point,
          (unit) => unit.unitState.playerId === +playerID && unit.unitState.isClickable === true,
          moves.selectOldUnit
        );
        break;
      case 'placeUnit':
      case 'chooseBlockSideActionStage':
        handlePointClick(
          point,
          G.players[+playerID].availablePoints,
          stage === 'placeUnit' ? moves.moveUnit : moves.setBlockSide
        );
        break;
      default:
        break;
    }
  }, [ctx.activePlayers, playerID, G.players, handleUnitClick, handlePointClick, moves]);

  // Handle positioning phase moves
  const handlePositioningMoves = useCallback((point) => {
    const stage = ctx.activePlayers[+ctx.currentPlayer];
    if (!stage) return;

    const currentPlayer = +ctx.currentPlayer;

    switch (stage) {
      case 'pickUnitOnBoard':
        handleUnitClick(
          point,
          (unit) => unit.unitState.playerId === currentPlayer && unit.unitState.isClickable === true,
          moves.selectUnitOnBoard
        );
        break;
      case 'placeUnitOnBoard':
        handlePointClick(point, G.availablePoints, moves.moveUnitOnBoard);
        break;
      case 'doRaid':
        handlePointClick(
          point,
          G.availablePoints,
          null,
          (found) => G.currentEnemySelectedId ? moves.replaceHeals(found) : moves.attackTarget(found)
        );
        break;
      case 'showUrkaAction':
        handlePointClick(point, G.availablePoints, moves.moveAgain);
        break;
      case 'selectEnemyByUrka':
      case 'curseAbasyActionStage':
        const found = getInGameUnits(G).find((unit) => isSame(point)(unit.unitState.point));
        const isAvailable = G.availablePoints.find(isSame(point));
        if (found && isAvailable) {
          stage === 'selectEnemyByUrka' ? moves.selectEnemy(found) : moves.curseOrRecover(found);
        }
        break;
      case 'placeEnemyByUrka':
        handlePointClick(point, G.availablePoints, moves.moveEnemy);
        break;
      case 'healAllyActionStage':
        handlePointClick(point, G.availablePoints, moves.healAlly);
        break;
      case 'throwWeaponActionStage':
        handlePointClick(point, G.availablePoints, moves.throwWeapon);
        break;
      case 'replaceUnitsActionStage':
        handlePointClick(
          point,
          G.availablePoints,
          null,
          (found) => G.currentEnemySelectedId ? moves.replaceUnits(found) : moves.replaceUnitsFirst(found)
        );
        break;
      case 'setElokoCurseActionStage':
        handlePointClick(point, G.availablePoints, moves.setElokoCurse);
        break;
      case 'setItOnFireActionStage':
        handlePointClick(point, G.availablePoints, moves.setItOnFire);
        break;
      default:
        break;
    }
  }, [ctx.activePlayers, ctx.currentPlayer, G.availablePoints, G.currentEnemySelectedId, handleUnitClick, handlePointClick, moves, G]);

  // Handle fight phase moves
  const handleFightMoves = useCallback((point) => {
    const stage = ctx.activePlayers[+ctx.currentPlayer];
    if (!stage) return;

    switch (stage) {
      case 'pickUnitForAttack':
        const unit = getInGameUnits(G).find((unit) => isSame(point)(unit.unitState.point));
        if (unit && G.fightQueue[0].unitId === unit.unitState.unitId) {
          moves.selectUnitForAttack(unit);
        }
        break;
      case 'makeDamage':
        handlePointClick(point, G.availablePoints, moves.attackTarget);
        break;
      case 'hookUnitAction':
        handlePointClick(point, G.availablePoints, moves.hookUnit);
        break;
      case 'healAllyActionStage':
        handlePointClick(point, G.availablePoints, moves.healAlly);
        break;
      case 'curseAbasyActionStage':
        const found = getInGameUnits(G).find((unit) => isSame(point)(unit.unitState.point));
        const isAvailable = G.availablePoints.find(isSame(point));
        if (found && isAvailable) {
          moves.curseOrRecover(found);
        }
        break;
      case 'replaceUnitsActionStage':
        handlePointClick(
          point,
          G.availablePoints,
          null,
          (found) => G.currentEnemySelectedId ? moves.replaceUnits(found) : moves.replaceUnitsFirst(found)
        );
        break;
      case 'throwOverAction':
        handlePointClick(point, G.availablePoints, moves.throwOver);
        break;
      case 'setItOnFireActionStage':
        handlePointClick(point, G.availablePoints, moves.setItOnFire);
        break;
      default:
        break;
    }
  }, [ctx.activePlayers, ctx.currentPlayer, G.availablePoints, G.currentEnemySelectedId, G.fightQueue, handlePointClick, moves, G]);

  // Cell click handler
  const cellClicked = useCallback(({ x, y, z }) => {
    const phase = ctx.phase;
    const point = createPoint(x, y, z);

    switch (phase) {
      case 'Setup':
        handleSetupMoves(point);
        break;
      case 'Positioning':
        handlePositioningMoves(point);
        break;
      case 'Fight':
        handleFightMoves(point);
        break;
      default:
        break;
    }
  }, [ctx.phase, handleSetupMoves, handlePositioningMoves, handleFightMoves]);

  return { cellClicked };
};

// Extract popup state management to a custom hook
const usePopupState = () => {
  const [isPopupAllUnitsOpen, setIsPopupAllUnitsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isNamePopupOpen, setIsNamePopupOpen] = useState(false);
  const [nameUnit, setNameUnit] = useState(null);
  const [nameUnitPosition, setNameUnitPosition] = useState(null);
  const [infoUnit, setInfoUnit] = useState(null);

  return {
    allUnits: [isPopupAllUnitsOpen, setIsPopupAllUnitsOpen],
    info: [isPopupOpen, setIsPopupOpen, infoUnit, setInfoUnit],
    name: [isNamePopupOpen, setIsNamePopupOpen, nameUnit, setNameUnit, nameUnitPosition, setNameUnitPosition]
  };
};

// Main Board component
export function Board(props) {
  const { G, ctx, playerID, moves, matchData, isMultiplayer, reset } = props;
  const popupStates = usePopupState();
  const { cellClicked } = useActionHandlers(G, ctx, moves, playerID);

  // Sync player name effect
  useEffect(() => {
    if (!G.players[+playerID].isNameSet && matchData) {
      moves.syncPlayerName(matchData);
    }
  }, [G.players, playerID, matchData, moves]);

  // Compute color map
  const colorMapSecret = useMemo(() => {
    let colorMap = {};

    if (ctx.phase === "Setup") {
      colorMap = G.players[+playerID].grid.colorMap;
    } else {
      colorMap = {...G.grid.colorMap};
      if (G.grid.unstablePoints.length > 0) {
        colorMap['url(#rootedTile)'] = G.grid.unstablePoints;
      }
    }

    return colorMap;
  }, [G.grid, G.players, playerID, ctx.phase]);

  // Determine if a unit should be highlighted
  const isUnitHighlighted = useCallback((unitId) => {
    return (
      (G.currentUnit && G.currentUnit.id === unitId) ||
      (playerID && G.players[+playerID].currentUnit && G.players[+playerID].currentUnit.id === unitId)
    );
  }, [G.currentUnit, G.players, playerID]);

  // Filter units based on phase
  const filteredUnits = useMemo(() => {
    return getInGameUnits(
      G,
      (unit) => ctx.phase === "Setup"
        ? playerID && (unit.unitState.playerId === +playerID)
        : true
    );
  }, [G, ctx.phase, playerID]);

  // Winner popup component
  const WinnerPopup = useMemo(() => {
    if (!G.winner) return null;

    const winnerText = G.winner === -1
      ? logGameUi('its_draw')
      : <span style={{color: playerColors[G.winner.id]}}>
          {G.players.find(p => p.id === G.winner.id).name}
        </span>;

    const newGameButton = isMultiplayer
      ? <Link to="/" className="btn btn-primary">{logGameUi('new_game')}</Link>
      : <button className="btn btn-primary" onClick={reset}>{logGameUi('new_game')}</button>;

    return (
      <motion.div
        className="winner-popup-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="winner-popup">
          <h2>{logGameUi('congrats')} {winnerText}!</h2>
          <p>{logGameUi('you_won')}</p>
          {newGameButton}
        </div>
      </motion.div>
    );
  }, [G.winner, G.players, isMultiplayer, reset]);

  // Render game board based on phase
  const renderGameBoard = () => {
    const { phase } = ctx;
    const hexContainerStyle = {
      display: 'flex',
      flexGrow: 1,
      flexBasis: '58%',
      maxWidth: 1085
    };

    if (phase === 'Building') {
      return <BoardBuildings style={hexContainerStyle} props={props} />;
    }

    if (phase === 'FinishBattle' || phase === null) {
      return <BattleResults
        style={hexContainerStyle}
        props={props}
        info={[popupStates.info[1], popupStates.info[3], popupStates.name[1]]}
      />;
    }

    if (phase === 'Setup' || phase === 'Positioning' || phase === 'Fight') {
      return (
        <HexGrid
          levels={G.grid.levels}
          players={ctx.numPlayers}
          style={hexContainerStyle}
          colorMap={colorMapSecret}
          onClick={cellClicked}
        >
          {filteredUnits.map((unit) => {
            const { x, y, z } = unit.unitState.point;
            return (
              <Token x={x} y={y} z={z} key={unit.id} id={unit.id}>
                <UnitUI
                  unit={unit}
                  highlight={isUnitHighlighted(unit.id)}
                  markEnemy={setEnemyMarks(props, unit)}
                  fightQueue={G.fightQueue}
                  info={popupStates.info}
                  nameInfo={popupStates.name}
                />
              </Token>
            );
          })}

          {G.grid.essencePoints.map((point, i) => (
            <Token x={point.x} y={point.y} z={point.z} key={`essence-${i}`} id={i+20000}>
              <EssenceGiftsUI id={i+20000} />
            </Token>
          ))}
        </HexGrid>
      );
    }

    return null;
  };

  return (
    <div className="board-container">
      <BoardUser props={props} info={popupStates.info} />

      {renderGameBoard()}

      <BoardLogs data={props} info={popupStates.allUnits} />

      {WinnerPopup}

      <UnitInfoPopup props={props} info={popupStates.info} />
      <UnitNamePopup props={props} info={popupStates.name} />
      <AllUnitsPopup props={props} info={popupStates.allUnits} />
    </div>
  );
}
