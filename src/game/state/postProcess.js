import {getInGameUnits, getNearestEnemy, isNotSame} from '../utils';
import {playerColors} from '../constants';
import {startPositions} from "./setup";
import {biomComparison} from "./unitPriority";

const setColorMap = G => {
  G.grid.colorMap = {
    [playerColors[0]]: startPositions[0],//red
    [playerColors[1]]: startPositions[1],//blue
    [playerColors[2]]: startPositions[2],//green
    [playerColors[3]]: startPositions[3]//yellow
  }
  Object.entries(G.grid.colorMap).forEach(([color, points]) => {
    G.grid.colorMap[color] = points.filter(mapPoint => G.availablePoints.every(availablePoint => isNotSame(mapPoint)(availablePoint)))
  })
  G.grid.colorMap['#dd666f'] = G.availablePoints
};

export const setGridSize = G => {
  if((G.moveOrder >= 2) && (G.moveOrder % 2 == 0)) {
    getInGameUnits(G, (unit) => {
      const point = unit.unitState.point
      const level = G.grid.levels
      return (Math.max(Math.abs(point.x), Math.abs(point.y), Math.abs(point.z)) === level) || (point.y === level-1) || (point.z === -(level-1))
    }).forEach(unit => unit.unitState.isInGame = false)
    G.players.forEach(p => {
      if (p.units.every(unit => unit.unitState.isInGame === false)) p.isInGame = false
    })
    G.grid.levels--;
  }
  return G
}

export const handleGameOver = G =>
  (G.setupComplete == G.players.length) && ([...new Set(getInGameUnits(G).map(unit => unit.unitState.playerId))].length <= 1)

export const onGameOver = G => {
  const remainPlayers = [...new Set(getInGameUnits(G).map(unit => unit.unitState.playerId))]
  G.winner = remainPlayers.length == 0 ? -1 : remainPlayers[0]
  return G
}

export const cleanFightPhase = G => {
  getInGameUnits(G).forEach(unit => {
    unit.unitState.isClickable = true
    unit.unitState.isInFight = false
  });
  G.moveOrder++;
  G.fightQueue = []
  return G
}

export const endFightPhase = G =>
  getInGameUnits(G, (unit) => unit.unitState.isClickable && unit.unitState.isInFight).length === 0

export const setInFightUnits = G => {
  getInGameUnits(G).forEach(unit => {
    if(getNearestEnemy(G, unit.unitState).length > 0) {
      unit.unitState.isInFight = true
    } else {
      unit.unitState.isInFight = false
    }
  });
  if(getInGameUnits(G, (unit) => unit.unitState.isInFight).length > 0)
    getInGameUnits(G).forEach(unit => unit.unitState.isClickable = unit.unitState.isInFight)
  return G
}

export const setFightOrder = (G, events) => {
  G.fightQueue = getInGameUnits(G, (unit) => unit.unitState.isInFight)
    .sort((u1, u2) =>
      (u1.initiative > u2.initiative) ? 1 : (u1.initiative < u2.initiative) ? -1 : biomComparison(u1.biom, u2.biom)
    ).reverse().map(unit => ({unitId: unit.id, playerId: unit.unitState.playerId}))
}

export const postProcess = (G, events) => {
  setColorMap(G)
  events.endStage()
  return G
};
