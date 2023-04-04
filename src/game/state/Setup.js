import {createPoint, getPlayersNumber, shuffledBioms} from "../helpers/Utils";
import {playerColors} from "../helpers/Constants";
import {getCreature, getIdol, getUnitState, UnitTypes} from "../units/Unit";

let unitId = 0;

const createPlayer = (id, name, bioms) => ({
  id,
  name,
  units: [
    getIdol(UnitTypes.Idol, UnitTypes.Idol, bioms[0], unitId, 3, 7, 4, getUnitState(unitId++, id)),
    getIdol(UnitTypes.Idol, UnitTypes.Idol, bioms[0], unitId, 3, 7, 4, getUnitState(unitId++, id)),
    getCreature(UnitTypes.Prispeshnick, UnitTypes.Prispeshnick, bioms[0], unitId, 2, 4, 3, 1, getUnitState(unitId++, id)),
    getCreature(UnitTypes.Ispolin, UnitTypes.Ispolin, bioms[0], unitId, 2, 3, 5, 1, getUnitState(unitId++, id)),
    getCreature(UnitTypes.Vestnick, UnitTypes.Vestnick, bioms[0], unitId, 3, 2, 4, 1, getUnitState(unitId++, id)),
    getIdol(UnitTypes.Idol, UnitTypes.Idol, bioms[1], unitId, 3, 7, 4, getUnitState(unitId++, id)),
    getIdol(UnitTypes.Idol, UnitTypes.Idol, bioms[1], unitId, 3, 7, 4, getUnitState(unitId++, id)),
    getCreature(UnitTypes.Prispeshnick, UnitTypes.Prispeshnick, bioms[1], unitId, 2, 4, 3, 1, getUnitState(unitId++, id)),
    getCreature(UnitTypes.Ispolin, UnitTypes.Ispolin, bioms[1], unitId, 2, 3, 5, 1, getUnitState(unitId++, id)),
    getCreature(UnitTypes.Vestnick, UnitTypes.Vestnick, bioms[1], unitId, 3, 2, 4, 1, getUnitState(unitId++, id))
  ],
  isInGame: true
});

export const startPositions = [
  [createPoint(0, -4, 4), createPoint(-1, -3, 4), createPoint(-1, -2, 3), createPoint(0, -2, 2), createPoint(1, -3, 2), createPoint(1, -4, 3), createPoint(0, -3, 3)],
  [createPoint(0, 3, -3), createPoint(1, 2, -3), createPoint(1, 1, -2), createPoint(0, 1, -1), createPoint(-1, 2, -1), createPoint(-1, 3, -2), createPoint(0, 2, -2)],
  [createPoint(2, -1, -1), createPoint(2, -2, 0), createPoint(3, -3, 0), createPoint(4, -3, -1), createPoint(4, -2, -2), createPoint(3, -1, -2), createPoint(3, -2, -1)],
  [createPoint(-2, 1, 1), createPoint(-2, 0, 2), createPoint(-3, 0, 3), createPoint(-4, 1, 3), createPoint(-4, 2, 2), createPoint(-3, 2, 1), createPoint(-3, 1, 2)]
]

export const setup = () => ({
  currentUnit: null,
  players: [...Array(getPlayersNumber()).keys()].map(num => createPlayer(num, `Player ${num+1}`, shuffledBioms[num])),
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
  winner: undefined
});
