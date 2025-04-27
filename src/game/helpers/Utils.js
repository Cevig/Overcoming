import {PLAYER_NUMBER} from "../../config";
import {
  Buildings,
  createPoint,
  essencePoints,
  SortieTypes,
  UnitKeywords,
  UnitStatus,
  UnitTypes
} from "./Constants";
import {
  handleUnitStatsUpdateInAttack,
  handleUnitStatsUpdateInDefence
} from "../state/GameActions";
import {handleAbility} from "../state/UnitSkills";
import {biomComparison} from "./UnitPriority";
import {createUnitObject} from "../units/Unit";
import i18n from '../../i18n';

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
    if (!unit.unitState.isInFight && isNearEnemies && !unit.unitState.isAttackedThisPhase) {
      unit.unitState.isClickable = true
      unit.unitState.isInFight = true
    }
    if (unit.unitState.isInFight && !isNearEnemies) {
      unit.unitState.isClickable = false
      unit.unitState.isInFight = false
    }
    if (hasStatus(unit, UnitStatus.Stun) && unit.unitState.isClickable) {
      unit.unitState.isClickable = false;
    }
  });

  const skippedTurnUnits = getInGameUnits(G, (unit) => unit.unitState.isInFight && unit.unitState.isClickable && unit.unitState.skippedTurn && !hasStatus(unit, UnitStatus.Stun))
    .sort((u1, u2) => sortFightOrder(u1, u2))
    .reverse().map(unit => ({unitId: unit.id, playerId: unit.unitState.playerId}))
  const notMovedUnits = getInGameUnits(G, (unit) => unit.unitState.isInFight && unit.unitState.isClickable && !unit.unitState.skippedTurn && !hasStatus(unit, UnitStatus.Stun))
    .sort((u1, u2) => sortFightOrder(u1, u2))
    .reverse().map(unit => ({unitId: unit.id, playerId: unit.unitState.playerId}))
  G.fightQueue = notMovedUnits.concat(skippedTurnUnits)

  G.currentActionUnitId = undefined
  G.currentEnemySelectedId = undefined
  G.endFightTurn = true
}

export const cleanRound = (G, ctx, events) => {
  G.finishedRounds++;
  G.availablePoints = [];
  G.currentUnit = null;
  G.setupComplete = 0;
  G.buildingComplete = 0;
  G.battleResultComplete = 0;
  G.moveOrder = G.finishedRounds;
  G.shrinkZone = 0;
  G.fightQueue = [];
  G.endFightTurn = false;
  G.endFightPhase = false;
  G.endBattle = false;
  G.winner = undefined;
  G.currentActionUnitId = undefined;
  G.currentEnemySelectedId = undefined;
  G.grid.levels = ctx.numPlayers === 2 ? 3 : 4;
  G.grid.unstablePoints = [];
  G.grid.essencePoints = essencePoints(ctx.numPlayers);

  G.players.forEach(p => {
    if (p.isPlayerInGame) {
      p.isPlayerInBattle = false
      p.availablePoints = []
      p.currentUnit = null
      p.dealtDamage = false
      let savedUnits = []
      const sortieUnits = p.units.filter(u => u.unitState.isInSortie)
      if (sortieUnits.length > 0) {
        const savedUnit = sortieUnits[Math.floor(Math.random()*sortieUnits.length)]
        savedUnits.push(createUnitObject(Math.random().toString(10).slice(2), p.id, savedUnit.biom, savedUnit.type, savedUnit.unitState.createPosition, savedUnit.level, savedUnit.price))
      }
      p.units = savedUnits
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
            text: i18n.t('log.get_status', {unitName: logUnitName(enemy.name), status: logUnitStatus(status.name).name}),
          })
        } else {
          removeStatus(enemy, status.name)
          G.serverMsgLog.push({
            id: Math.random().toString(10).slice(2),
            turn: ctx.turn,
            player: +ctx.currentPlayer,
            phase: ctx.phase,
            text: i18n.t('log.lose_status', {unitName: logUnitName(enemy.name), status: logUnitStatus(status.name).name})
          })
        }
      } else if(status.qty > 0) {
        enemy.status.push(status)
        G.serverMsgLog.push({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: i18n.t('log.get_status', {unitName: logUnitName(enemy.name), status: logUnitStatus(status.name).name}),
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
      text: i18n.t('log.health_change', {
        unitName: logUnitName(enemy.name),
        qty: Math.abs(resultMods.damage),
        qtyLabel: resultMods.damage >= 0 ? i18n.t('game.to_damage') : i18n.t('game.to_heals'),
        source: logUnitName(currentUnit.name)
      }),
    })
  }
  if(resultMods.power !== undefined) {
    enemy.power = (enemy.power - resultMods.power)
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: i18n.t('log.power_change', {
        unitName: logUnitName(enemy.name),
        qty: Math.abs(resultMods.power),
        qtyLabel: resultMods.power >= 0 ? i18n.t('game.increased') : i18n.t('game.decreased'),
      }),
    })
  }
  if(resultMods.initiative !== undefined) {
    enemy.initiative = (enemy.initiative - resultMods.initiative)
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: i18n.t('log.initiative_change', {
        unitName: logUnitName(enemy.name),
        qty: Math.abs(resultMods.initiative),
        qtyLabel: resultMods.initiative >= 0 ? i18n.t('game.increased') : i18n.t('game.decreased'),
      }),
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

export const handleUnitDeath = (data, target, killer = null, isFallDown = false) => {
  const {G, ctx} = data

  G.serverMsgLog.push({
    id: Math.random().toString(10).slice(2),
    turn: ctx.turn,
    player: +ctx.currentPlayer,
    phase: ctx.phase,
    text: i18n.t('log.unit_killed', {unitName: logUnitName(target.name), player: G.players[target.unitState.playerId].name}),
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
    let essence = target.level ? 3+((target.level-1)*2) : 3
    if (target.type === UnitTypes.Idol) essence += 2;
    if (hasKeyword(killer, UnitKeywords.AdditionalEssence)) essence += 2;
    let killingPlayer = G.players[killer.unitState.playerId]
    killingPlayer.essence += essence;
    killingPlayer.killedUnits++;
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: i18n.t('log.receive_essence', {qty: essence, player: killingPlayer.name}),
    })
  }
  if (isFallDown) {
    let player = G.players[target.unitState.playerId]
    if (player.essence > 1) {
      player.essence -= 2
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: i18n.t('log.loose_essence', {qty: 2, player: player.name}),
      })
    }
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
    if (G.finishedRounds === 0) {
      essence = [1, 2, 3][Math.floor(Math.random() * 3)]
    } else if (inGamePlayers.length === 4) {
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
      // if (playerValue === 4) {
      //   essence = [4, 5][Math.floor(Math.random() * 2)]
      // } else if (playerValue > 2) {
      //   essence = [2, 3][Math.floor(Math.random() * 2)]
      // }
      essence = [3, 4, 5][Math.floor(Math.random() * 3)]
    }

    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: thisUnit.unitState.playerId,
      phase: ctx.phase,
      text: i18n.t('log.receive_gift', {qty: essence, player: thisPlayer.name}),
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

export const getHousePrice = (house, player) => {
  if (house.name === Buildings.VivtarPoplichnukiv.name) {
    return house.price - player.houses.filter(h => h.name === Buildings.VivtarProminkoriv.name || h.name === Buildings.VivtarVisnukiv.name).length
  } else if (house.name === Buildings.VivtarProminkoriv.name) {
    return house.price - player.houses.filter(h => h.name === Buildings.VivtarPoplichnukiv.name || h.name === Buildings.VivtarVisnukiv.name).length
  } else if (house.name === Buildings.VivtarVisnukiv.name) {
    return house.price - player.houses.filter(h => h.name === Buildings.VivtarProminkoriv.name || h.name === Buildings.VivtarPoplichnukiv.name).length
  } else if (house.name === Buildings.VivtarPoplichnukiv2.name) {
    return house.price - player.houses.filter(h => h.name === Buildings.VivtarProminkoriv2.name || h.name === Buildings.VivtarVisnukiv2.name).length
  } else if (house.name === Buildings.VivtarProminkoriv2.name) {
    return house.price - player.houses.filter(h => h.name === Buildings.VivtarPoplichnukiv2.name || h.name === Buildings.VivtarVisnukiv2.name).length
  } else if (house.name === Buildings.VivtarVisnukiv2.name) {
    return house.price - player.houses.filter(h => h.name === Buildings.VivtarProminkoriv2.name || h.name === Buildings.VivtarPoplichnukiv2.name).length
  } else if (house.name === Buildings.VivtarPoplichnukiv3.name) {
    return house.price - player.houses.filter(h => h.name === Buildings.VivtarProminkoriv3.name || h.name === Buildings.VivtarVisnukiv3.name).length*2
  } else if (house.name === Buildings.VivtarProminkoriv3.name) {
    return house.price - player.houses.filter(h => h.name === Buildings.VivtarPoplichnukiv3.name || h.name === Buildings.VivtarVisnukiv3.name).length*2
  } else if (house.name === Buildings.VivtarVisnukiv3.name) {
    return house.price - player.houses.filter(h => h.name === Buildings.VivtarProminkoriv3.name || h.name === Buildings.VivtarPoplichnukiv3.name).length*2
  } else return house.price
}

export const calculateSortie = (G, p1) => {
  const results = []
  G.players.filter(eP => eP.id !== p1.id && eP.isPlayerInGame).map(ep => {
    const pUnits = p1.sortie.filter(su => su.playerId === ep.id)
    const epUnits = ep.sortie.filter(su => su.playerId === p1.id)
    const pamyatnickEp = ep.houses.find(h => h.name === Buildings.Pamjatnuk.name)
    if (pUnits.length - epUnits.length >= 2) {
      if (pamyatnickEp) {
        results.push({player: ep, type: SortieTypes.Y})
      } else {
        results.push({player: ep, type: SortieTypes.A})
      }
    } else if (pUnits.length - epUnits.length > 0) {
      if (pamyatnickEp) {
        results.push({player: ep, type: SortieTypes.Y})
      } else {
        results.push({player: ep, type: SortieTypes.B})
      }
    } else if (pUnits.length - epUnits.length === 0) {
      results.push({player: ep, type: SortieTypes.C})
    } else if (p1.houses.find(h => h.name === Buildings.Pamjatnuk.name) !== undefined) {
      results.push({player: ep, type: SortieTypes.X})
    } else if (epUnits.length - pUnits.length >= 2) {
      results.push({player: ep, type: SortieTypes.E})
    } else if (epUnits.length - pUnits.length > 0) {
      results.push({player: ep, type: SortieTypes.D})
    }
  })
  return results
}

export const getUnstablePoints = (G, ctx) => {
  const result = []
  if (ctx.numPlayers === 3) {
    for (let i = 0; i <= G.grid.levels; i++) {
      const a = -i+0
      const b = -(G.grid.levels-i)+0
      result.push([G.grid.levels, a, b])
      result.push([G.grid.levels, b, a])
      result.push([a, G.grid.levels, b])
      result.push([b, G.grid.levels, a])
      result.push([a, b, G.grid.levels])
      result.push([b, a, G.grid.levels])
    }
    for (let i = -1; i > -G.grid.levels; i--) {
      const a = -i
      const b = G.grid.levels+i
      result.push([-G.grid.levels, a, b])
      result.push([-G.grid.levels, b, a])
      result.push([a, -G.grid.levels, b])
      result.push([b, -G.grid.levels, a])
      result.push([a, b, -G.grid.levels])
      result.push([b, a, -G.grid.levels])
    }
    for (let i = 0; i <= G.grid.levels-1; i++) {
      const a = -i+0
      const b = -(G.grid.levels-1-i)+0
      result.push([a, G.grid.levels-1, b])
      result.push([b, G.grid.levels-1, a])
      result.push([G.grid.levels-1, a, b])
      result.push([G.grid.levels-1, b, a])
    }
    for (let i = -1; i >= -G.grid.levels+1; i--) {
      const a = -i
      const b = (G.grid.levels-1)+i
      result.push([a, b, -G.grid.levels+1])
      result.push([b, a, -G.grid.levels+1])
    }

    return [...new Set(result)].filter(arr => arr[1] !== G.grid.levels)
      .filter(arr => arr[2] !== -G.grid.levels)
      .filter(arr => arr[0] !== G.grid.levels)
      .map(arr => createPoint(...arr))
  } else if(ctx.numPlayers === 2) {
    for (let i = 0; i <= G.grid.levels; i++) {
      const a = -i+0
      const b = -(G.grid.levels-i)+0
      result.push([G.grid.levels, a, b])
      result.push([G.grid.levels, b, a])
      result.push([a, G.grid.levels, b])
      result.push([b, G.grid.levels, a])
      result.push([a, b, G.grid.levels])
      result.push([b, a, G.grid.levels])
    }
    for (let i = -1; i > -G.grid.levels; i--) {
      const a = -i
      const b = G.grid.levels+i
      result.push([-G.grid.levels, a, b])
      result.push([-G.grid.levels, b, a])
      result.push([a, -G.grid.levels, b])
      result.push([b, -G.grid.levels, a])
      result.push([a, b, -G.grid.levels])
      result.push([b, a, -G.grid.levels])
    }

    return [...new Set(result)].map(arr => createPoint(...arr))
  } else {
    for (let i = 0; i <= G.grid.levels; i++) {
      const a = -i+0
      const b = -(G.grid.levels-i)+0
      result.push([G.grid.levels, a, b])
      result.push([G.grid.levels, b, a])
      result.push([a, G.grid.levels, b])
      result.push([b, G.grid.levels, a])
      result.push([a, b, G.grid.levels])
      result.push([b, a, G.grid.levels])
    }
    for (let i = -1; i > -G.grid.levels; i--) {
      const a = -i
      const b = G.grid.levels+i
      result.push([-G.grid.levels, a, b])
      result.push([-G.grid.levels, b, a])
      result.push([a, -G.grid.levels, b])
      result.push([b, -G.grid.levels, a])
      result.push([a, b, -G.grid.levels])
      result.push([b, a, -G.grid.levels])
    }
    for (let i = 0; i <= G.grid.levels-1; i++) {
      const a = -i+0
      const b = -(G.grid.levels-1-i)+0
      result.push([a, G.grid.levels-1, b])
      result.push([b, G.grid.levels-1, a])
    }
    for (let i = -1; i >= -G.grid.levels+1; i--) {
      const a = -i
      const b = (G.grid.levels-1)+i
      result.push([a, b, -G.grid.levels+1])
      result.push([b, a, -G.grid.levels+1])
    }

    return [...new Set(result)].filter(arr => arr[1] !== G.grid.levels)
      .filter(arr => arr[2] !== -G.grid.levels)
      .map(arr => createPoint(...arr))
  }
}

export const logUnitName = (name) =>
  i18n.t('unit.'+name)

export const logUnitStatus = (name) => {
  let loweredName = name.charAt(0).toLowerCase() + name.slice(1)
  return {
    name: '✶'+i18n.t('unitStatus.'+loweredName+'.name')+'✶',
    description: i18n.t('unitStatus.'+loweredName+'.description')
  }
}

export const logUnitKeyword = (name) => {
  return {
    name: '✦'+i18n.t('unitKeywords.'+name+'.name')+'✦',
    description: i18n.t('unitKeywords.'+name+'.description'),
    descriptionTooltip: i18n.t('unitKeywords.'+name+'.descriptionTooltip', { defaultValue: '' })
  }
}

export const logUnitSkill = (name) => {
  return {
    name: '✧'+i18n.t('unitSkills.'+name+'.name')+'✧',
    description: i18n.t('unitSkills.'+name+'.description'),
    descriptionTooltip: i18n.t('unitSkills.'+name+'.descriptionTooltip', { defaultValue: '' }),
    effect: i18n.t('unitSkills.'+name+'.effect', { defaultValue: '' })
  }
}

export const logBuilding = (name) => {
  return {name: i18n.t('buildings.'+name+'.name'), description: i18n.t('buildings.'+name+'.description')}
}

export const logPhase = (name) => i18n.t('phase.'+name)

export const logGameUi = (name) => i18n.t('game.'+name)
export const logPlayerName = (qty) => i18n.t('game.player', {number: qty})
