import {createPoint} from "../utils";
import {Biom, playerColors} from "../constants";
import {Idol, UnitState, UnitTypes} from "../Creatures/Unit";

let insectId = 0;
let unitId = 0;
const createInsect = type => ({
  type,
  id: insectId++,
  isClickable: true,
})
const createInsects = () => [
  createInsect('ant'),
  createInsect('ant'),
  createInsect('ant'),
  createInsect('spider'),
  createInsect('spider'),
  createInsect('spider'),
  createInsect('queen'),
  createInsect('grasshopper'),
  createInsect('grasshopper'),
  createInsect('grasshopper'),
];

const createPlayer = id => ({
  id,
  insects: createInsects(),
  units: [
    JSON.parse(JSON.stringify(new Idol(UnitTypes.Idol, UnitTypes.Idol, Biom.Step, unitId, 3, 7, 4, new UnitState(unitId++, id)))),
    // new Creature(UnitTypes.Prispeshnick, UnitTypes.Prispeshnick, Biom.Step, unitId, 2, 4, 5, new UnitState(unitId++, id)),
    // new Creature(UnitTypes.Prispeshnick, UnitTypes.Prispeshnick, Biom.Step, unitId, 2, 4, 5, new UnitState(unitId++, id)),
    // new Creature(UnitTypes.Prispeshnick, UnitTypes.Prispeshnick, Biom.Step, unitId, 2, 4, 5, new UnitState(unitId++, id)),
  ],
  moveCount: 0,
});

export const startPositions = [
  [createPoint(0, -4, 4), createPoint(-1, -3, 4), createPoint(-1, -2, 3), createPoint(0, -2, 2), createPoint(1, -3, 2), createPoint(1, -4, 3), createPoint(0, -3, 3)],
  [createPoint(0, 3, -3), createPoint(1, 2, -3), createPoint(1, 1, -2), createPoint(0, 1, -1), createPoint(-1, 2, -1), createPoint(-1, 3, -2), createPoint(0, 2, -2)],
  [createPoint(2, -1, -1), createPoint(2, -2, 0), createPoint(3, -3, 0), createPoint(4, -3, -1), createPoint(4, -2, -2), createPoint(3, -1, -2), createPoint(3, -2, -1)],
  [createPoint(-2, 1, 1), createPoint(-2, 0, 2), createPoint(-3, 0, 3), createPoint(-4, 1, 3), createPoint(-4, 2, 2), createPoint(-3, 2, 1), createPoint(-3, 1, 2)]
]

export const setup = () => ({
  currentInsect: null,
  currentUnit: null,
  players: [
    createPlayer(0),
    createPlayer(1),
    // createPlayer('2'),
    // createPlayer('3')
  ],
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
  insects: [],
  moveCount: 0,
  setupComplete: 0,
  gameover: null,
});
