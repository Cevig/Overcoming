import {PLAYER_NUMBER} from "../../config";
import {Biom} from "./Constants";
import {
  handleUnitStatsUpdateInAttack,
  handleUnitStatsUpdateInDefence
} from "../state/GameActions";
import {handleAbility} from "../state/UnitSkills";
import {gameLog} from "./Log";

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

export const getNeighbors2 = ({ x, y, z }) => {
  return [
    [0, -1, 1],
    [1, -1, 0],
    [1, 0, -1],
    [0, 1, -1],
    [-1, 1, 0],
    [-1, 0, 1],
    [0, 2, -2],
    [-1, 2, -1],
    [-2, 2, 0],
    [-2, 1, 1],
    [-2, 0, 2],
    [-1, -1, 2],
    [0, -2, 2],
    [1, -2, 1],
    [2, -2, 0],
    [2, -1, -1],
    [2, 0, -2],
    [1, 1, -2]
  ]
    .map(([dx, dy, dz]) => [x + dx, y + dy, z + dz])
    .map(p => createPoint(...p));
}

export const getRaidPoints = ({ x, y, z }) => {
  return [
    {main: [0, 2, -2], obstacles: [[0, 1, -1]]},
    {main: [-1, 2, -1], obstacles: [[-1, 1, 0], [0, 1, -1]]},
    {main: [-2, 2, 0], obstacles: [[-1, 1, 0]]},
    {main: [-2, 1, 1], obstacles: [[-1, 1, 0], [-1, 0, 1]]},
    {main: [-2, 0, 2], obstacles: [[-1, 0, 1]]},
    {main: [-1, -1, 2], obstacles: [[-1, 0, 1], [0, -1, 1]]},
    {main: [0, -2, 2], obstacles: [[0, -1, 1]]},
    {main: [1, -2, 1], obstacles: [[0, -1, 1], [1, -1, 0]]},
    {main: [2, -2, 0], obstacles: [[1, -1, 0]]},
    {main: [2, -1, -1], obstacles: [[1, 0, -1], [1, -1, 0]]},
    {main: [2, 0, -2], obstacles: [[1, 0, -1]]},
    {main: [1, 1, -2], obstacles: [[0, 1, -1], [1, 0, -1]]}
  ]
    .map(pointData => {
      const [dx, dy, dz] = pointData.main
      pointData.main = createPoint(...[x + dx, y + dy, z + dz])
      pointData.obstacles = pointData.obstacles.map(oPoint => {
        const [odx, ody, odz] = oPoint
        return createPoint(...[x + odx, y + ody, z + odz])
      })
      return pointData
    })
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

export const getNearestUnits = (G, unitState) => {
  const surroundings = getNeighbors(unitState.point)
  return getInGameUnits(G)
    .filter(unit => surroundings.find(isSame(unit.unitState.point)))
}
export const getNearestEnemies = (G, unitState) => {
  const surroundings = getNeighbors(unitState.point)
  return getInGameUnits(G, (unit) => unit.unitState.playerId !== unitState.playerId)
    .filter(unit => surroundings.find(isSame(unit.unitState.point)))
}

export const getNearestAllies = (G, unitState) => {
  const surroundings = getNeighbors(unitState.point)
  return getInGameUnits(G, (unit) => unit.unitState.playerId === unitState.playerId)
    .filter(unit => surroundings.find(isSame(unit.unitState.point)))
}

export const getRaidEnemies = (G, unitState) => {
  const surroundings = getRaidPoints(unitState.point)
  const allies = getInGameUnits(G, unit => unit.unitState.playerId === unitState.playerId)
  return getInGameUnits(G, (unit) => unit.unitState.playerId !== unitState.playerId)
    .filter(unit =>
      surroundings.find(dataPoint => isSame(dataPoint.main)(unit.unitState.point) &&
        !dataPoint.obstacles.every(obs => allies.find(ally => isSame(ally.unitState.point)(obs)) !== undefined)))
}

export const getNearestEnemies2 = (G, unitState) => {
  const surroundings = getNeighbors2(unitState.point)
  return getInGameUnits(G, (unit) => unit.unitState.playerId !== unitState.playerId)
    .filter(unit => surroundings.find(point => isSame(point)(unit.unitState.point)))
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
export const shuffleArray = (array) => {
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
  if (G.endFightTurn) {
    const unit = getUnitById(G, G.fightQueue[0].unitId)
    if ((G.fightQueue.length > 1) && (unit !== undefined) && (unit.unitState.isClickable === false)) {
      return {next: (G.fightQueue[1].playerId).toString()}
    } else {
      return {next: (G.fightQueue[0].playerId).toString()}
    }
  } else return false
}

export const onEndFightTurn = (G, ctx) => {
  if(G.fightQueue.length && getUnitById(G, G.fightQueue[0].unitId).unitState.isClickable === false)
    G.fightQueue.shift();
  G.endFightTurn = false
  G.currentActionUnitId = undefined
  return G
}

export const resolveUnitsInteraction = (data, fightData) => {
  const {currentUnit, enemy, updates} = fightData
  const {ctx} = data
  const onAttackMods = handleUnitStatsUpdateInAttack(data, {
    unitId: currentUnit.id,
    enemyId: enemy.id,
    updates: updates
  })
  const resultMods = handleUnitStatsUpdateInDefence(data, {
    unitId: enemy.id,
    updates: onAttackMods
  })

  if(resultMods.damage !== undefined) {
    enemy.heals = (enemy.heals - resultMods.damage)
    gameLog.addLog({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${enemy.name} отримує ${Math.abs(resultMods.damage)} ${resultMods.damage >= 0 ? `урону` : `до життя`} від ${currentUnit.name}`,
    })
  }
  if(resultMods.power !== undefined) {
    enemy.power = (enemy.power - resultMods.power)
    gameLog.addLog({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `Силу ${enemy.name} ${resultMods.power >= 0 ? 'знижено' : 'підвищено'} на ${Math.abs(resultMods.power)}`,
    })
  }
  if(resultMods.initiative !== undefined) {
    enemy.initiative = (enemy.initiative - resultMods.initiative)
    gameLog.addLog({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `Ініціативу ${enemy.name} ${resultMods.initiative >= 0 ? 'знижено' : 'підвищено'} на ${Math.abs(resultMods.initiative)}`,
    })
  }
  if (resultMods.status !== undefined) {
    resultMods.status.forEach(status => {
      const enemyStatus = getStatus(enemy, status.name)
      if (enemyStatus !== undefined) {
        if ((enemyStatus.qty + status.qty) > 0) {
          enemyStatus.qty = enemyStatus.qty + status.qty
          gameLog.addLog({
            id: Math.random().toString(10).slice(2),
            turn: ctx.turn,
            player: +ctx.currentPlayer,
            phase: ctx.phase,
            text: `${enemy.name} отримує статус ${status.name}`,
          })
        } else {
          removeStatus(enemy, status.name)
          gameLog.addLog({
            id: Math.random().toString(10).slice(2),
            turn: ctx.turn,
            player: +ctx.currentPlayer,
            phase: ctx.phase,
            text: `${enemy.name} втрачає статус ${status.name}`,
          })
        }
      } else if(status.qty > 0) {
        enemy.status.push(status)
        gameLog.addLog({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `${enemy.name} отримує статус ${status.name}`,
        })
      }
    })
  }
}

export const hasStatus = (unit, keyword) =>
  unit.status.find(status => status.name === keyword) !== undefined

export const getStatus = (unit, keyword) =>
  unit.status.find(status => status.name === keyword)

export const removeStatus = (unit, keyword) => {
  unit.status = unit.status.filter(status => status.name !== keyword)
}

export const hasKeyword = (unit, keyword) =>
  unit.abilities.keywords.find(key => key === keyword) !== undefined

export const handleUnitDeath = (data, target, killer = null) => {
  const {G, ctx} = data
  const point = {...target.unitState.point}
  target.unitState.isInGame = false
  gameLog.addLog({
    id: Math.random().toString(10).slice(2),
    turn: ctx.turn,
    player: +ctx.currentPlayer,
    phase: ctx.phase,
    text: `Було вбито ${target.name} гравця ${target.unitState.playerId+1}`,
  })
  target.unitState.point = createPoint(100, 100, 100)
  target.abilities.onMove.forEach(skill => {
    handleAbility(data, skill.name, {unitId: target.id})
  })
  target.unitState.point = null
  const unitsWithOnDeath = getInGameUnits(G, unit => unit.abilities.onDeath.length)
  unitsWithOnDeath.forEach(unit => {
    unit.abilities.onDeath.forEach(skill => {
      handleAbility(data, skill.name, {unitId: killer ? killer.id : null, target: unit, point: point})
    })
  })
}

export const setEnemyMarks = (props, unit) =>
  ((props.G.availablePoints.length > 0) && (props.G.availablePoints.find(isSame(unit.unitState.point)) !== undefined))

export const handleUnitMove = (G, ctx, unitId, point) => {
  const thisUnit = getUnitById(G, unitId)
  const oldEnemies = getNearestEnemies(G, thisUnit.unitState)
  thisUnit.unitState.point = point
  const newEnemies = getNearestEnemies(G, thisUnit.unitState)

  const initiatorFor = newEnemies.filter(enemy => oldEnemies.find(oldEnemy => oldEnemy.id === enemy.id) === undefined)
    .map(enemy => enemy.id)

  if (ctx.phase === 'Positioning') thisUnit.unitState.isMovedLastPhase = true
  thisUnit.unitState.initiatorFor = initiatorFor
}
