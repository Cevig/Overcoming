import {createPoint, shuffledBioms} from "../helpers/Utils";
import {playerColors} from "../helpers/Constants";
import {createUnitObject, UnitTypes} from "../units/Unit";

let unitId = 0;

const createPlayer = (id, name, bioms) => ({
  id,
  name,
  units: [
    createUnitObject(unitId++, id, bioms[0]),
    createUnitObject(unitId++, id, bioms[0], UnitTypes.Idol, 1),
    createUnitObject(unitId++, id, bioms[0], UnitTypes.Prispeshnick),
    createUnitObject(unitId++, id, bioms[0], UnitTypes.Ispolin),
    createUnitObject(unitId++, id, bioms[0], UnitTypes.Vestnick),

    createUnitObject(unitId++, id, bioms[1]),
    createUnitObject(unitId++, id, bioms[1], UnitTypes.Idol, 1),
    createUnitObject(unitId++, id, bioms[1], UnitTypes.Prispeshnick),
    createUnitObject(unitId++, id, bioms[1], UnitTypes.Ispolin),
    createUnitObject(unitId++, id, bioms[1], UnitTypes.Vestnick)
  ],
  isInGame: true
});

export const startPositions = [
  [createPoint(0, -3, 3), createPoint(0, -4, 4), createPoint(-1, -3, 4), createPoint(-1, -2, 3), createPoint(0, -2, 2), createPoint(1, -3, 2), createPoint(1, -4, 3)],
  [createPoint(0, 2, -2), createPoint(0, 3, -3), createPoint(1, 2, -3), createPoint(1, 1, -2), createPoint(0, 1, -1), createPoint(-1, 2, -1), createPoint(-1, 3, -2)],
  [createPoint(3, -2, -1), createPoint(2, -1, -1), createPoint(2, -2, 0), createPoint(3, -3, 0), createPoint(4, -3, -1), createPoint(4, -2, -2), createPoint(3, -1, -2)],
  [createPoint(-3, 1, 2), createPoint(-2, 1, 1), createPoint(-2, 0, 2), createPoint(-3, 0, 3), createPoint(-4, 1, 3), createPoint(-4, 2, 2), createPoint(-3, 2, 1)]
]

export const setup = ({ ctx }) => ({
  currentUnit: null,
  players: [...Array(ctx.numPlayers).keys()].map(num => createPlayer(num, `Player ${num+1}`, shuffledBioms[num])),
  grid: {
    levels: 4,
    colorMap: {
      [playerColors[0]]: startPositions[0],//red
      [playerColors[1]]: startPositions[1],//blue
      [playerColors[2]]: startPositions[2],//green
      [playerColors[3]]: startPositions[3]//yellow
    },
  },
  availablePoints: [],
  setupComplete: 0,
  moveOrder: 0,
  fightQueue: [],
  endFightTurn: false,
  winner: undefined
});
