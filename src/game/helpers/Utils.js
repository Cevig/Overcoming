import {PLAYER_NUMBER} from "../../config";
import {
  Biom,
  Buildings,
  createPoint,
  essencePoints,
  SortieTypes,
  UnitKeywords,
  UnitTypes
} from "./Constants";
import {
  handleUnitStatsUpdateInAttack,
  handleUnitStatsUpdateInDefence
} from "../state/GameActions";
import {handleAbility} from "../state/UnitSkills";
import {biomComparison} from "./UnitPriority";
import {createUnitObject} from "../units/Unit";

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
    if (G.fightQueue.length === 0) {
      return {next: ctx.currentPlayer}
    }
    return {next: (G.fightQueue[0].playerId).toString()}
  } else return false
}

export const onEndFightTurnAfter = (G, ctx) => {
  G.endFightTurn = false
  G.endFightPhase = G.fightQueue.length === 0
  return G;
}

export const onEndFightTurn = (G, ctx) => {

  getInGameUnits(G).forEach(unit => {
    const isNearEnemies = getNearestEnemies(G, unit.unitState).length > 0;
    if (!unit.unitState.isInFight && isNearEnemies) {
      unit.unitState.isClickable = true
      unit.unitState.isInFight = true
    }
    if (unit.unitState.isInFight && !isNearEnemies) {
      unit.unitState.isClickable = false
      unit.unitState.isInFight = false
    }
  });

  const skippedTurnUnits = getInGameUnits(G, (unit) => unit.unitState.isInFight && unit.unitState.isClickable && unit.unitState.skippedTurn)
    .sort((u1, u2) => sortFightOrder(u1, u2))
    .reverse().map(unit => ({unitId: unit.id, playerId: unit.unitState.playerId}))
  const notMovedUnits = getInGameUnits(G, (unit) => unit.unitState.isInFight && unit.unitState.isClickable && !unit.unitState.skippedTurn)
    .sort((u1, u2) => sortFightOrder(u1, u2))
    .reverse().map(unit => ({unitId: unit.id, playerId: unit.unitState.playerId}))
  G.fightQueue = notMovedUnits.concat(skippedTurnUnits)

  G.currentActionUnitId = undefined
  G.currentEnemySelectedId = undefined
  G.endFightTurn = true
}

export const cleanRound = (G, ctx, events) => {
  G.availablePoints = [];
  G.currentUnit = null;
  G.setupComplete = 0;
  G.buildingComplete = 0;
  G.battleResultComplete = 0;
  G.moveOrder = 0;
  G.fightQueue = [];
  G.endFightTurn = false;
  G.endFightPhase = false;
  G.endBattle = false;
  G.winner = undefined;
  G.currentActionUnitId = undefined;
  G.currentEnemySelectedId = undefined;
  G.grid.levels = 4;
  G.grid.unstablePoints = [];
  G.grid.essencePoints = essencePoints;

  G.players.forEach(p => {
    if (p.isPlayerInGame) {
      p.isPlayerInBattle = false
      p.availablePoints = []
      p.currentUnit = null
      p.dealtDamage = false
      const sortieUnits = p.units.filter(u => u.unitState.isInSortie)
      if (sortieUnits.length > 0) {
        const savedUnit = sortieUnits[Math.floor(Math.random()*sortieUnits.length)]
        savedUnit.unitState.isInSortie = false
      }
      p.units = p.units.filter(u => u.heals > 0 && !u.unitState.isInSortie).map(u =>
        createUnitObject(Math.random().toString(10).slice(2), p.id, u.biom, u.type, u.unitState.createPosition, u.level, u.price)
      )
      p.sortie = []
    }
  })
  return G
}

export const sortFightOrder = (u1, u2) => {
  if (u1.initiative > u2.initiative) return 1;
  if (u1.initiative < u2.initiative) return -1;
  if (u1.unitState.initiatorFor.find(id => u2.id === id)) return -1;
  if (u2.unitState.initiatorFor.find(id => u1.id === id)) return 1;
  return biomComparison(u1.biom, u2.biom)
}

export const resolveUnitsInteraction = (data, fightData) => {
  const {currentUnit, enemy, updates} = fightData
  const {G, ctx} = data
  const onAttackMods = handleUnitStatsUpdateInAttack(data, {
    unitId: currentUnit.id,
    enemyId: enemy.id,
    updates: updates
  })
  const resultMods = handleUnitStatsUpdateInDefence(data, {
    unitId: enemy.id,
    enemyId: currentUnit.id,
    updates: onAttackMods
  })

  if (resultMods.status !== undefined) {
    resultMods.status.forEach(status => {
      const enemyStatus = getStatus(enemy, status.name)
      if (enemyStatus !== undefined) {
        if ((enemyStatus.qty + status.qty) > 0) {
          enemyStatus.qty = enemyStatus.qty + status.qty
          G.serverMsgLog.push({
            id: Math.random().toString(10).slice(2),
            turn: ctx.turn,
            player: +ctx.currentPlayer,
            phase: ctx.phase,
            text: `${enemy.name} отримує статус ${status.name}`,
          })
        } else {
          removeStatus(enemy, status.name)
          G.serverMsgLog.push({
            id: Math.random().toString(10).slice(2),
            turn: ctx.turn,
            player: +ctx.currentPlayer,
            phase: ctx.phase,
            text: `${enemy.name} втрачає статус ${status.name}`,
          })
        }
      } else if(status.qty > 0) {
        enemy.status.push(status)
        G.serverMsgLog.push({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `${enemy.name} отримує статус ${status.name}`,
        })
      }
    })
  }
  if(resultMods.damage !== undefined) {
    enemy.heals = (enemy.heals - resultMods.damage)
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${enemy.name} отримує ${Math.abs(resultMods.damage)} ${resultMods.damage >= 0 ? `урону` : `до життя`} від ${currentUnit.name}`,
    })
  }
  if(resultMods.power !== undefined) {
    enemy.power = (enemy.power - resultMods.power)
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `Силу ${enemy.name} ${resultMods.power >= 0 ? 'знижено' : 'підвищено'} на ${Math.abs(resultMods.power)}`,
    })
  }
  if(resultMods.initiative !== undefined) {
    enemy.initiative = (enemy.initiative - resultMods.initiative)
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `Ініціативу ${enemy.name} ${resultMods.initiative >= 0 ? 'знижено' : 'підвищено'} на ${Math.abs(resultMods.initiative)}`,
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

  G.serverMsgLog.push({
    id: Math.random().toString(10).slice(2),
    turn: ctx.turn,
    player: +ctx.currentPlayer,
    phase: ctx.phase,
    text: `Було вбито ${target.name} Гравця ${target.unitState.playerId+1}`,
  })

  const unitsWithOnDeath = getInGameUnits(G, unit => unit.abilities.onDeath.length)
  unitsWithOnDeath.forEach(unit => {
    unit.abilities.onDeath.forEach(skill => {
      handleAbility(data, skill.name, {killerId: killer ? killer.id : null, target: target, thisUnit: unit})
    })
  })
  target.unitState.isInGame = false
  target.unitState.point = createPoint(100, 100, 100)
  target.abilities.onMove.forEach(skill => {
    handleAbility(data, skill.name, {unitId: target.id})
  })
  target.unitState.point = null
  if (target.heals > 0) target.heals = 0;
  if (killer) {
    let essence = hasKeyword(killer, UnitKeywords.AdditionalEssence) ? 4 : 2
    if (target.type === UnitTypes.Idol) essence += 2;
    G.players[killer.unitState.playerId].essence += essence;
    G.players[killer.unitState.playerId].killedUnits++;
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${G.players[killer.unitState.playerId].name} отримує ${essence}✾`,
    })
  }
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

  if (G.grid.essencePoints.find(isSame(thisUnit.unitState.point))) {
    const thisPlayer = G.players[thisUnit.unitState.playerId]
    const inGamePlayers = [...G.players.filter(p => p.isPlayerInGame)]
    const playersEssenceOrder = [...inGamePlayers].sort((p1, p2) => sortPlayersEssenceOrder(p1, p2)).reverse()
    const playersPowerOrder = [...inGamePlayers].sort((p1, p2) => sortPlayersPowerOrder(p1, p2)).reverse()

    const essenceIndex = playersEssenceOrder.findIndex(p => p.id === thisPlayer.id) +1
    const powerIndex = playersPowerOrder.findIndex(p => p.id === thisPlayer.id) +1
    const playerValue = essenceIndex+powerIndex

    let essence = 1;
    if (inGamePlayers.length === 4) {
      if (playerValue >= 7) {
        essence = 5
      } else if (playerValue >= 6) {
        essence = 4
      } else if (playerValue >= 4) {
        essence = 3
      } else if (playerValue >= 3) {
        essence = 2
      }
    } else if (inGamePlayers.length === 3) {
      essence = playerValue - 1
    } else if (inGamePlayers.length === 2) {
      if (playerValue === 4) {
        essence = 5
      } else if (playerValue > 2) {
        essence = 3
      }
    }

    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: thisUnit.unitState.playerId,
      phase: ctx.phase,
      text: `${thisPlayer.name} отримує дар богів: +${essence}✾`,
    })
    thisPlayer.essence += essence;
    G.grid.essencePoints = G.grid.essencePoints.filter(isNotSame(thisUnit.unitState.point))
  }
}

export const sortPlayersPowerOrder = (p1, p2) => {
  if (p1.units.filter(u => u.type !== UnitTypes.Idol).reduce((val, unit) => val + unit.level, 0) >
    p2.units.filter(u => u.type !== UnitTypes.Idol).reduce((val, unit) => val + unit.level, 0)) return 1;
  if (p1.units.filter(u => u.type !== UnitTypes.Idol).reduce((val, unit) => val + unit.level, 0) <
    p2.units.filter(u => u.type !== UnitTypes.Idol).reduce((val, unit) => val + unit.level, 0)) return -1;
  if (p1.houses.length > p2.houses.length) return 1;
  if (p1.houses.length < p2.houses.length) return -1;
  if (p1.essence > p2.essence) return 1;
  if (p1.essence < p2.essence) return -1;
  return Math.random() - 0.5
}

export const sortPlayersEssenceOrder = (p1, p2) => {
  if ((p1.killedUnits + p1.wins*3) > (p2.killedUnits + p2.wins*3)) return 1;
  if ((p1.killedUnits + p1.wins*3) < (p2.killedUnits + p2.wins*3)) return -1;
  if (p1.heals > p2.heals) return 1;
  if (p1.heals < p2.heals) return -1;
  if (p1.essence > p2.essence) return 1;
  if (p1.essence < p2.essence) return -1;
  return Math.random() - 0.5
}

export const cleanPlayer = (player) => {
  player.isPlayerInBattle = false
  player.isPlayerInGame = false
  player.availablePoints = []
  player.currentUnit = null
  player.heals = 0
  player.essence = 0
  player.houses = []
  player.sortie = []
  player.units = []
}

export const calculateSortie = (G, p1) => {
  const results = []
  G.players.filter(eP => eP.id !== p1.id && eP.isPlayerInGame).map(ep => {
    const pUnits = p1.sortie.filter(su => su.playerId === ep.id)
    const epUnits = ep.sortie.filter(su => su.playerId === p1.id)
    const pamyatnickEp = ep.houses.find(h => h.name === Buildings.Pamjatnuk.name)
    if (pUnits.length - epUnits.length >= 2) {
      if (pamyatnickEp) {
        results.push({playerId: ep.id, type: SortieTypes.Y})
      } else {
        results.push({playerId: ep.id, type: SortieTypes.A})
      }
    } else if (pUnits.length - epUnits.length > 0) {
      if (pamyatnickEp) {
        results.push({playerId: ep.id, type: SortieTypes.Y})
      } else {
        results.push({playerId: ep.id, type: SortieTypes.B})
      }
    } else if (pUnits.length - epUnits.length === 0) {
      results.push({playerId: ep.id, type: SortieTypes.C})
    } else if (p1.houses.find(h => h.name === Buildings.Pamjatnuk.name) !== undefined) {
      results.push({playerId: ep.id, type: SortieTypes.X})
    } else if (epUnits.length - pUnits.length >= 2) {
      results.push({playerId: ep.id, type: SortieTypes.E})
    } else if (epUnits.length - pUnits.length > 0) {
      results.push({playerId: ep.id, type: SortieTypes.D})
    }
  })
  return results
}
