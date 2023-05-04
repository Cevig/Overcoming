import {
  Buildings,
  createPoint,
  essencePoints,
  playerColors
} from "../helpers/Constants";

const createPlayer = (id, name) => ({
  id,
  name,
  units: [],
  bioms: [],
  isPlayerInBattle: false,
  isPlayerInGame: true,
  availablePoints: [],
  currentUnit: null,
  grid: {
    colorMap: {
      [playerColors[0]]: startPositions[0],//red
      [playerColors[1]]: startPositions[1],//blue
      [playerColors[2]]: startPositions[2],//green
      [playerColors[3]]: startPositions[3]//yellow
    }
  },
  heals: 10,
  essence: 16,
  killedUnits: 0,
  wins: 0,
  dealtDamage: false,
  houses: [{...Buildings.Kapitoliy}, {...Buildings.Svjatulushe, qty: 1 }],
  sortie: []
});

export const startPositions = [
  [createPoint(0, -3, 3), createPoint(0, -4, 4), createPoint(-1, -3, 4), createPoint(-1, -2, 3), createPoint(0, -2, 2), createPoint(1, -3, 2), createPoint(1, -4, 3)],
  [createPoint(0, 2, -2), createPoint(0, 3, -3), createPoint(1, 2, -3), createPoint(1, 1, -2), createPoint(0, 1, -1), createPoint(-1, 2, -1), createPoint(-1, 3, -2)],
  [createPoint(3, -2, -1), createPoint(2, -1, -1), createPoint(2, -2, 0), createPoint(3, -3, 0), createPoint(4, -3, -1), createPoint(4, -2, -2), createPoint(3, -1, -2)],
  [createPoint(-3, 1, 2), createPoint(-2, 1, 1), createPoint(-2, 0, 2), createPoint(-3, 0, 3), createPoint(-4, 1, 3), createPoint(-4, 2, 2), createPoint(-3, 2, 1)]
]

export const setup = ({ ctx }) => ({
  currentUnit: null,
  players: [...Array(ctx.numPlayers).keys()].map(num => createPlayer(num, `Гравець ${num+1}`)),
  grid: {
    levels: 4,
    colorMap: {
      [playerColors[0]]: startPositions[0],//red
      [playerColors[1]]: startPositions[1],//blue
      [playerColors[2]]: startPositions[2],//green
      [playerColors[3]]: startPositions[3]//yellow
    },
    unstablePoints: [],
    essencePoints: essencePoints
  },
  availablePoints: [],
  setupComplete: 0,
  buildingComplete: 0,
  battleResultComplete: 0,
  moveOrder: 0,
  fightQueue: [],
  endFightTurn: false,
  endFightPhase: false,
  endBattle: false,
  winner: undefined,
  currentActionUnitId: undefined,
  currentEnemySelectedId: undefined,
  serverMsgLog: []
});
