import {areAllConnected, getNeighbors, isNotSame, isSame} from '../utils';
import {playerColors} from '../constants';
import {setUtilsFactory} from '../setUtils';
import {startPositions} from "./setup";

const { subtract } = setUtilsFactory(isSame);

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
  // playerColors.forEach((playerColor, idx) => G.grid.colorMap[playerColor] = G.insects.filter(insect => idx === +insect.player).map(insect => insect.point))
  G.grid.colorMap['#8d767f'] = (G.currentInsect && G.currentInsect.point) ? [G.currentInsect.point] : []
};

const setGridSize = G => {
  G.grid.levels = G.insects.reduce((levels, { point: { x, y, z } }) => Math.max(levels, x, y, z), G.grid.levels - 2) + 2;
}

const setMoveableAndClickable = G => {
  const insectPoints = G.insects.map(({ point }) => point);
  const playersHavePlacedQueen = G.players.map(({ insects }) => insects.find(({ type }) => type === 'queen') === undefined);
  return {
    ...G,
    insects: G.insects.map(insect => ({
      ...insect,
      isMovable: playersHavePlacedQueen[insect.player] && areAllConnected(insectPoints.filter(i => i !== insect.point)),
    })),
    players: G.players.map(player => ({
      ...player,
      insects: player.insects.map(insect => ({
        ...insect,
        isClickable: playersHavePlacedQueen[player.id] || player.moveCount !== 3 || insect.type === 'queen',
      })),
    })),
  }
}

const handleGameover = G => {
  const insectPoints = G.insects.map(({ point }) => point);
  const losers = G.insects
    .filter(({ type }) => type === 'queen')
    .map(({ point, player }) => ({ player, neighbors: getNeighbors(point) }))
    .filter(({ neighbors }) => subtract(neighbors, insectPoints).length === 0)
    .map(({ player }) => player);
  G.gameover = losers.length > 0 ? {
    losers,
  } : null;
}

export const postProcess = (G, events) => {
  setColorMap(G)
  // setGridSize(G)
  // setMoveableAndClickable(G)
  handleGameover(G)
  events.endStage()
  return G
};
