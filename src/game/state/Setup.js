import {
  Buildings,
  createPoint,
  essencePoints,
  playerColors
} from "../helpers/Constants";

const createPlayer = (id, name, allPlayersNum) => ({
  id,
  name,
  units: [],
  bioms: [],
  isPlayerInBattle: false,
  isPlayerInGame: true,
  availablePoints: [],
  currentUnit: null,
  grid: {
    colorMap: getColorMap(allPlayersNum)
  },
  heals: 10,
  essence: 10,
  essenceFreeze: 16,
  killedUnits: 0,
  wins: 0,
  dealtDamage: false,
  isUsedSacrifice: false,
  isUsedReinforce: false,
  houses: [{...Buildings.Kapitoliy}, {...Buildings.Svjatulushe, qty: 1 }],
  sortie: []
});

export const startPositions = (allPlayersNum) => {
  if (allPlayersNum === 3) {
    return [
      [createPoint(1, -3, 2), createPoint(0, -2, 2), createPoint(0, -3, 3), createPoint(1, -4, 3), createPoint(2, -4, 2), createPoint(2, -3, 1), createPoint(1, -2, 1)],
      [createPoint(-3, 1, 2), createPoint(-4, 2, 2), createPoint(-4, 1, 3), createPoint(-3, 0, 3), createPoint(-2, 0, 2), createPoint(-2, 1, 1), createPoint(-3, 2, 1)],
      [createPoint(1, 1, -2), createPoint(0, 2, -2), createPoint(0, 1, -1), createPoint(1, 0, -1), createPoint(2, 0, -2), createPoint(2, 1, -3), createPoint(1, 2, -3)],
    ]
  } else if (allPlayersNum === 2) {
    return [
      [createPoint(2, -1, -1), createPoint(1, 0, -1), createPoint(1, -1, 0), createPoint(2, -2, 0), createPoint(3, -2, -1), createPoint(3, -1, -2), createPoint(2, 0, -2)],
      [createPoint(-2, 1, 1), createPoint(-3, 2, 1), createPoint(-3, 1, 2), createPoint(-1, 0, 1), createPoint(-1, 1, 0), createPoint(-2, 2, 0), createPoint(-2, 0, 2)]
    ]
  } else {
    return [
      [createPoint(0, -3, 3), createPoint(0, -4, 4), createPoint(-1, -3, 4), createPoint(-1, -2, 3), createPoint(0, -2, 2), createPoint(1, -3, 2), createPoint(1, -4, 3)],
      [createPoint(0, 2, -2), createPoint(0, 3, -3), createPoint(1, 2, -3), createPoint(1, 1, -2), createPoint(0, 1, -1), createPoint(-1, 2, -1), createPoint(-1, 3, -2)],
      [createPoint(3, -2, -1), createPoint(2, -1, -1), createPoint(2, -2, 0), createPoint(3, -3, 0), createPoint(4, -3, -1), createPoint(4, -2, -2), createPoint(3, -1, -2)],
      [createPoint(-3, 1, 2), createPoint(-2, 1, 1), createPoint(-2, 0, 2), createPoint(-3, 0, 3), createPoint(-4, 1, 3), createPoint(-4, 2, 2), createPoint(-3, 2, 1)]
    ]
  }
}

export const getColorMap = (allPlayersNum) => {
  const result = {};
  [...Array(allPlayersNum).keys()].map(num => result[playerColors[num]] = startPositions(allPlayersNum)[num])
  return result
}

export const setup = ({ ctx }) => ({
  currentUnit: null,
  players: [...Array(ctx.numPlayers).keys()].map(num => createPlayer(num, `Гравець ${num+1}`, ctx.numPlayers)),
  grid: {
    levels: ctx.numPlayers === 2 ? 3 : 4,
    colorMap: getColorMap(ctx.numPlayers),
    unstablePoints: [],
    essencePoints: essencePoints(ctx.numPlayers)
  },
  availablePoints: [],
  setupComplete: 0,
  buildingComplete: 0,
  battleResultComplete: 0,
  moveOrder: 0,
  finishedRounds: 0,
  shrinkZone: 0,
  fightQueue: [],
  endFightTurn: false,
  endFightPhase: false,
  endBattle: false,
  winner: undefined,
  currentActionUnitId: undefined,
  currentEnemySelectedId: undefined,
  serverMsgLog: []
});
