import {
  createPoint,
  getInGameUnits,
  getNearestAllies,
  getNearestEnemies,
  getNearestUnits,
  getNeighbors,
  getNeighbors2,
  getRaidEnemies,
  getRaidEnemiesAbsolute,
  getStatus,
  getUnitById,
  handleUnitDeath,
  hasKeyword,
  hasStatus,
  isNotSame,
  isSame,
  resolveUnitsInteraction
} from "../helpers/Utils";
import {USteppe} from "../units/Steppe";
import {
  DamageType,
  UnitKeywords,
  UnitSkills,
  UnitStatus,
  UnitTypes
} from "../helpers/Constants";
import {gameLog} from "../helpers/Log";

export const handleAbility = (data, skill, eventData) => {
  const abilitiesMap = {
    [UnitSkills.Surround3]: handlePolydnicaSurroundings,
    [UnitSkills.Wholeness]: handleWholeness,
    [UnitSkills.AddFreezeEffect]: handleFreezeEffectOnAttack,
    [UnitSkills.AddUnfocusedEffect]: handleUnfocusedEffectOnAttack,
    [UnitSkills.AddPoisonEffect]: handlePoisonEffectOnAttack,
    [UnitSkills.AddVengeanceEffect]: handleVengeanceEffectOnAttack,
    [UnitSkills.MaraAura]: handleMaraAura,
    [UnitSkills.Raid]: handleRaid,
    [UnitSkills.LethalGrab]: handleLethalGrab,
    [UnitSkills.Urka]: handleUrka,
    [UnitSkills.InstantKill]: handleInstantKill,
    [UnitSkills.Lesavka]: handleLesavka,
    [UnitSkills.UtilizeDeath]: handleUtilizeDeath,
    [UnitSkills.chainDamage]: handleChainDamage,
  }

  return abilitiesMap[skill](data, eventData)
}
const handlePolydnicaSurroundings = ({G, ctx, events}, {unitId}) => {
  const units = getInGameUnits(G)
  const thisUnit = getUnitById(G, unitId)
  const alliedUnits = units.filter(unit => (unit.unitState.playerId === thisUnit.unitState.playerId) && (unit.name === USteppe.polydnicaName))
  if (alliedUnits.length >= 3) {
    const enemyUnits = units.filter(unit => (unit.unitState.playerId !== thisUnit.unitState.playerId) && (unit.type !== UnitTypes.Idol))
    enemyUnits.forEach(enemy => {
      const enemiesForEnemy = getNearestEnemies(G, enemy.unitState).filter(unit => unit.name === USteppe.polydnicaName)
      if (enemiesForEnemy.length >= 3) {
        gameLog.addLog({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `Полудніці оточили слугу типу ${enemy.type} гравця ${enemy.unitState.playerId+1}`,
        })
        handleUnitDeath({G: G, ctx:ctx, events: events}, enemy)
        G.fightQueue.forEach((unitInQ, i, q) => {
          if(unitInQ.unitId === enemy.id) {
            q.splice(i, 1);
          }
        })
      }
    })
  }
}

const handleMaraAura = ({G, ctx, events}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId)

  getInGameUnits(G, unit => unit.unitState.playerId !== thisUnit.unitState.playerId).forEach(enemy => {
    const nearMaras = getNearestEnemies(G, enemy.unitState).filter(unit => unit.name === USteppe.maraName)
    const auraKeyword = UnitStatus.InitiativeDown
    const enemyStatus = getStatus(enemy, auraKeyword)

    let value = 0
    if (enemyStatus !== undefined) {
      value = value - enemyStatus.qty
    }
    if (nearMaras.length > 0) {
      value = value + nearMaras.reduce((val, mara) => val + ((mara.level >= 2) ? 2 : 1), 0)
    }
    if (value !== 0) {
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: thisUnit,
        enemy: enemy,
        updates: {
          initiative: value,
          status: [{name: auraKeyword, qty: value}]
        }
      });
    }
  })
}

/////////////////////////////////////////////////////

const handleWholeness = ({G, ctx}, {unitId, updates}) => {
  const thisUnit = getUnitById(G, unitId)

  if (updates.power !== undefined) {
    updates.power = ((thisUnit.power - updates.power) < thisUnit.unitState.baseStats.power) ?  (thisUnit.power - thisUnit.unitState.baseStats.power) : updates.power
    if (updates.status !== undefined && updates.power === 0) {
      const decreasingStatusPower = updates.status.find(status => status.name === UnitStatus.PowerDown)
      if(decreasingStatusPower !== undefined) {
        decreasingStatusPower.qty = -1
        gameLog.addLog({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `Цілісність ${thisUnit.name} заблокувала зниження сили`,
        })
      }
    }
  }
  if (updates.initiative !== undefined) {
    updates.initiative = ((thisUnit.initiative - updates.initiative) < thisUnit.unitState.baseStats.initiative) ? (thisUnit.initiative - thisUnit.unitState.baseStats.initiative) : updates.initiative
    if (updates.status !== undefined && updates.initiative === 0) {
      const decreasingStatusInit = updates.status.find(status => status.name === UnitStatus.InitiativeDown)
      if(decreasingStatusInit !== undefined) {
        decreasingStatusInit.qty = -1
        gameLog.addLog({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `Цілісність ${thisUnit.name} заблокувала зниження ініціативи`,
        })
      }
    }
  }
  return updates
}

const handleFreezeEffectOnAttack = ({G}, {unitId, updates}) => {
   if (updates.damageType === DamageType.Default) {
     if (updates.status) updates.status.push({name: UnitStatus.Freeze, qty: 1})
     else updates.status = [{name: UnitStatus.Freeze, qty: 1}]
   }
   return updates
}

const handleUnfocusedEffectOnAttack = ({G}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Default) {
    if (updates.status) updates.status.push({name: UnitStatus.Unfocused, qty: 1})
    else updates.status = [{name: UnitStatus.Unfocused, qty: 1}]
  }
  return updates
}

const handlePoisonEffectOnAttack = ({G}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Default) {
    if (updates.status) updates.status.push({name: UnitStatus.Poison, qty: 1})
    else updates.status = [{name: UnitStatus.Poison, qty: 1}]
  }
  return updates
}

const handleVengeanceEffectOnAttack = ({G}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Default) {
    if (updates.status) updates.status.push({name: UnitStatus.Vengeance, qty: 1})
    else updates.status = [{name: UnitStatus.Vengeance, qty: 1}]
  }
  return updates
}

const handleChainDamage = ({G, ctx, events}, {unitId, enemyId, updates}) => {
  const impactedUnits = []
  const processChainedEnemies = (enemy, excludePlayerId, excludedEnemyId) => {
    const newEnemies = getNearestUnits(G, enemy.unitState).filter(unit => unit.unitState.playerId !== excludePlayerId)
    newEnemies.forEach(newEnemy => {
      if (impactedUnits.find(id => id === newEnemy.id) === undefined && newEnemy.id !== excludedEnemyId) {
        impactedUnits.push(newEnemy.id)
        processChainedEnemies(newEnemy, excludePlayerId, excludedEnemyId)
      }
    })
  }
  if (updates.damageType === DamageType.Default) {
    const thisUnit = getUnitById(G, unitId)
    if (!thisUnit.unitState.isMovedLastPhase) {
      const enemy = getUnitById(G, enemyId)
      processChainedEnemies(enemy, thisUnit.unitState.playerId, enemyId)
      impactedUnits.forEach(id => {
        const currentEnemy = getUnitById(G, id)
        gameLog.addLog({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `Удар ланцюжковою реакцією по ${currentEnemy.name}`,
        })
        resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
          currentUnit: thisUnit,
          enemy: currentEnemy,
          updates: {
            damage: 1,
            damageType: DamageType.Chained,
          }
        })
        if(currentEnemy.heals <= 0) {
          handleUnitDeath({G: G, ctx: ctx, events: events}, currentEnemy, thisUnit)
          G.fightQueue.forEach((unitInQ, i, q) => {
            if(unitInQ.unitId === currentEnemy.id) {
              q.splice(i, 1);
            }
          })
        }
      })
    }
  }
  return updates
}

const handleRaid = ({G, events, ctx}, {unitId}) => {
  const endTurn = (G, ctx, events, unit) => {
    G.availablePoints = []
    G.currentUnit = null
    unit.unitState.isClickable = false
    events.endTurn()
    gameLog.addLog({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${unit.name} гравця ${+ctx.currentPlayer+1} сьогодні без рейду`,
    })
  }

  const thisUnit = getUnitById(G, unitId)
  if (getNearestEnemies(G, thisUnit.unitState).length > 0 && !hasKeyword(thisUnit, UnitKeywords.AbsoluteRaid)) {
    endTurn(G, ctx, events, thisUnit)
  } else {
    let raidEnemies

    if (hasKeyword(thisUnit, UnitKeywords.AbsoluteRaid)) {
      raidEnemies = getRaidEnemiesAbsolute(G, thisUnit.unitState)
    } else if (hasKeyword(thisUnit, UnitKeywords.RestrictedRaid)) {
      raidEnemies = getNearestAllies(G, thisUnit.unitState).length >= 2 ? [] : getRaidEnemies(G, thisUnit.unitState)
    } else {
      raidEnemies = getRaidEnemies(G, thisUnit.unitState)
    }

    const mainTargetEnemy = raidEnemies.find(enemy => enemy.abilities.keywords.find(keyword => keyword === UnitKeywords.MainTarget) !== undefined)
    if (mainTargetEnemy !== undefined) {
      raidEnemies = [mainTargetEnemy]
    }

    if (hasStatus(thisUnit, UnitStatus.Vengeance)) {
      const vengeanceTarget = getInGameUnits(G).find(unit => hasKeyword(unit, UnitKeywords.VengeanceTarget))
      if (vengeanceTarget) {
        if (raidEnemies.find(enemy => enemy.id === vengeanceTarget.id)) {
          raidEnemies = [vengeanceTarget]
          gameLog.addLog({
            id: Math.random().toString(10).slice(2),
            turn: ctx.turn,
            player: +ctx.currentPlayer,
            phase: ctx.phase,
            text: `Мстивість дозволяє атакувати тільки ${vengeanceTarget.name}`,
          })
        } else {
          raidEnemies = []
          gameLog.addLog({
            id: Math.random().toString(10).slice(2),
            turn: ctx.turn,
            player: +ctx.currentPlayer,
            phase: ctx.phase,
            text: `Об'єкт для помсти ${vengeanceTarget.name} не є в зоні ураження`,
          })
        }
      }
    }

    if (raidEnemies.length === 0) {
      endTurn(G, ctx, events, thisUnit)
    } else {
      G.availablePoints = raidEnemies.map(u => u.unitState.point)
      events.setActivePlayers({ currentPlayer: 'doRaid' });
    }
  }
}

const handleLethalGrab = ({G, ctx}, {unitId, target}) => {
  if (!unitId) return
  const thisUnit = getUnitById(G, unitId)
  if (target.type === UnitTypes.Idol) {
    thisUnit.power++
    thisUnit.heals++
    thisUnit.initiative++
  } else if (target.type === UnitTypes.Prispeshnick) {
    thisUnit.heals++
  } else if (target.type === UnitTypes.Ispolin) {
    thisUnit.power++
  } else if (target.type === UnitTypes.Vestnick) {
    thisUnit.initiative++
  }
  gameLog.addLog({
    id: Math.random().toString(10).slice(2),
    turn: ctx.turn,
    player: +ctx.currentPlayer,
    phase: ctx.phase,
    text: `Характеристики ${thisUnit.name} були збільшені`,
  })
}

const handleUrka = ({G, events, ctx}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId)
  const newPoint = thisUnit.unitState.point
  const oldPoint = G.currentUnit.unitState.point
  const vector = {x: newPoint.x - oldPoint.x, y: newPoint.y - oldPoint.y, z: newPoint.z - oldPoint.z}
  const availablePoint = createPoint(...[newPoint.x + vector.x, newPoint.y + vector.y, newPoint.z + vector.z])

  if (getInGameUnits(G, unit => isSame(unit.unitState.point)(availablePoint)).length === 0) {
    G.availablePoints = [availablePoint]
  } else {
    G.availablePoints = []
  }

  events.setActivePlayers({ currentPlayer: 'showUrkaAction' });
}

const handleInstantKill = ({G}, {unitId, enemyId, updates}) => {
  if (updates.damageType === DamageType.Default) {
    const thisUnit = getUnitById(G, unitId)
    const enemy = getUnitById(G, enemyId)
    const isAllyNearToBoth = getNearestEnemies(G, enemy.unitState)
      .filter(ally => ally.unitState.playerId === thisUnit.unitState.playerId)
      .find(ally => getNearestAllies(G, ally.unitState).find(u => u.id === unitId))
    if (isAllyNearToBoth) {
      if (enemy.type === UnitTypes.Idol) {
        updates.damage = Math.trunc(enemy.unitState.baseStats.heals / 2)
      } else {
        updates.damage = 99;
      }
    }
    return updates
  } else return {}
}

const handleLesavka = ({G, events, ctx}, {unitId, enemyId}) => {
  const thisUnit = getUnitById(G, unitId)
  const enemy = getUnitById(G, enemyId)

  const samePoints = getNeighbors(thisUnit.unitState.point).filter(point => getNeighbors(enemy.unitState.point).find(isSame(point)))
  const inGameUnits = getInGameUnits(G)
  G.availablePoints = samePoints.filter(point => inGameUnits.every(unit => isNotSame(unit.unitState.point)(point)))

  if (G.availablePoints.length > 0) {
    G.currentUnit = enemy
    events.setActivePlayers({ currentPlayer: 'hookUnitAction' });
  } else {
    thisUnit.unitState.isClickable = false
    G.availablePoints = []
    G.currentUnit = null
    G.endFightTurn = true
  }
}

const handleUtilizeDeath = ({G, ctx, events}, {point}) => {
  const thisUnit = getInGameUnits(G).find(unit => unit.abilities.onDeath.find(ability => ability.name === UnitSkills.UtilizeDeath))

  if (getNeighbors2(thisUnit.unitState.point).find(isSame(point))) {
    const action = thisUnit.abilities.allTimeActions.find(action => action.name === UnitSkills.abasuCurse)
    if (action) {
      action.qty++
    }

    gameLog.addLog({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} отримує заряд`,
    })
  }
}
