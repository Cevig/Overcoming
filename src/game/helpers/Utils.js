import {PLAYER_NUMBER} from "../../config";
import {Biom} from "./Constants";
import {
  handleUnitStatsUpdateInAttack,
  handleUnitStatsUpdateInDefence
} from "../state/GameActions";
import {handleAbility} from "../state/UnitSkills";

export const createPoint = (...pos) => {
  const [x, y, z] = pos;
  return { x, y, z, coord: `${x},${y},${z}` };
}

export const isSame = p1 => p2 => p1.coord === p2.coord;

export const isNotSame = p1 => p2 => p1.coord !== p2.coord;

export const getNeighbors = ({ x, y, z }) => {
  return [
    [0, -1, 1],
    [1, -1, 0],
    [1, 0, -1],
    [0, 1, -1],
    [-1, 1, 0],
    [-1, 0, 1],
  ]
    .map(([dx, dy, dz]) => [x + dx, y + dy, z + dz])
    .map(p => createPoint(...p));
}

export const getInGameUnits = (G, filter = () => true) =>
  G.players.flatMap(p => p.units.filter(unit => (unit.unitState.isInGame === true) && filter(unit)));

export const getUnitById = (G, id) =>
  G.players.flatMap(p => p.units).find(unit => unit.id === id)

export const skipTurnIfNotActive = (G, ctx, events) => {
  if(getInGameUnits(G, (unit) => (unit.unitState.playerId === +ctx.currentPlayer) && unit.unitState.isClickable).length === 0)
    events.endTurn()
  return G
}

export const getNearestEnemies = (G, unitState) => {
  const surroundings = getNeighbors(unitState.point)
  return getInGameUnits(G, (unit) => unit.unitState.playerId !== unitState.playerId)
    .filter(unit => surroundings.find(isSame(unit.unitState.point)))
}

export const getPlayersNumber = () =>
  PLAYER_NUMBER.find(qty => qty.isActive).num

export const setPlayerNumber = (num) => {
  PLAYER_NUMBER.find(qty => qty.isActive).isActive = false
  PLAYER_NUMBER.find(qty => qty.num === num).isActive = true
}

export const getRandomFromObject = (obj, excluded) => {
  const keys = Object.keys(Biom).filter(key => !excluded.some(rmv => obj[key] === rmv))
  return Biom[keys[keys.length * Math.random() << 0]]
}
const getPlayersBioms = () => {
  const shuffledList = shuffleArray(Object.values(Biom));
  return [...Array(getPlayersNumber()).keys()].map(() => [shuffledList.pop(), shuffledList.pop()])
}
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
export const shuffledBioms = getPlayersBioms()

export const endFightTurnCondition = (G, ctx) => {
  if (ctx.numMoves >= 2) {
    const unit = getUnitById(G, G.fightQueue[0].unitId)
    if ((G.fightQueue.length > 1) && (unit !== undefined) && (unit.unitState.isClickable === false)) {
      return {next: (G.fightQueue[1].playerId).toString()}
    } else {
      return {next: (G.fightQueue[0].playerId).toString()}
    }
  } else return false
}

export const onEndFightTurn = G => {
  if(G.fightQueue.length && getUnitById(G, G.fightQueue[0].unitId).unitState.isClickable === false)
    G.fightQueue.shift();
  return G
}

export const resolveUnitsInteraction = (data, fightData) => {
  const {currentUnit, enemy, updates} = fightData
  const onAttackMods = handleUnitStatsUpdateInAttack(data, {
    unitId: currentUnit.id,
    updates: updates
  })
  const resultMods = handleUnitStatsUpdateInDefence(data, {
    unitId: enemy.id,
    updates: onAttackMods
  })

  enemy.heals = resultMods.damage !== undefined ? (enemy.heals - resultMods.damage) : enemy.heals
  enemy.power = resultMods.power !== undefined ? (enemy.power - resultMods.power) : enemy.power;
  enemy.initiative = resultMods.initiative !== undefined ? (enemy.initiative - resultMods.initiative) : enemy.initiative;
  if (resultMods.status !== undefined) {
    resultMods.status.forEach(status => {
      if(status.qty < 0) {
        removeStatus(enemy, status.name)
      } else {
        [...Array(status.qty)].forEach(i => enemy.status.push(status.name))
      }
    })
  }
}

export const hasStatus = (unit, keyword) =>
  unit.status.find(status => status === keyword) !== undefined

export const removeStatus = (unit, keyword) => {
  unit.status = unit.status.filter(status => status !== keyword)
}

export const checkAndAddStatus = (unit, keyword) => {
  if(unit.status.find(status => status === keyword) === undefined) unit.status.push(keyword)
}

export const hasKeyword = (unit, keyword) =>
  unit.abilities.keywords.find(key => key === keyword) !== undefined

export const handleUnitDeath = (data, unit) => {
  unit.unitState.isInGame = false
  unit.unitState.point = createPoint(100, 100, 100)
  unit.abilities.onMove.game.forEach(skill => {
    handleAbility(data, skill.name, {unitId: skill.unitId})
  })
  unit.unitState.point = null
}
