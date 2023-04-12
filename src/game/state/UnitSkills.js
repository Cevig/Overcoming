import {
  getInGameUnits,
  getNearestEnemies,
  getRaidEnemies,
  getStatus,
  getUnitById,
  handleUnitDeath,
  resolveUnitsInteraction
} from "../helpers/Utils";
import {USteppe} from "../units/Steppe";
import {DamageType, UnitStatus, UnitTypes} from "../helpers/Constants";
import {gameLog} from "../helpers/Log";

export const handleAbility = (data, skill, eventData) => {
  const abilitiesMap = {
    surround3: handlePolydnicaSurroundings,
    wholeness: handleWholeness,
    addFreezeEffect: handleFreezeEffectOnAttack,
    maraAura: handleMaraAura,
    raid: handleRaid,
    lethalGrab: handleLethalGrab,
  }

  return abilitiesMap[skill](data, eventData)
}
const handlePolydnicaSurroundings = ({G, ctx}, {unitId}) => {
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
        handleUnitDeath({G: G, ctx:ctx}, enemy)
      }
    })
  }
}

const handleMaraAura = ({G, ctx}, {unitId}) => {
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
      resolveUnitsInteraction({G: G, ctx: ctx}, {
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
  const tempUnit = USteppe.getPolydnica(unitId, 10, thisUnit.level)

  if (updates.power !== undefined) {
    updates.power = ((thisUnit.power - updates.power) < tempUnit.power) ?  (thisUnit.power - tempUnit.power) : updates.power
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
    updates.initiative = ((thisUnit.initiative - updates.initiative) < tempUnit.initiative) ? (thisUnit.initiative - tempUnit.initiative) : updates.initiative
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
  return (updates.damageType === DamageType.Default) ? {status: [{name: UnitStatus.Freeze, qty: 1}]} : {}
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
      text: `${unit.name} гравця ${+ctx.currentPlayer+1} сьогодні без наліту`,
    })
  }

  const thisUnit = getUnitById(G, unitId)
  if (getNearestEnemies(G, thisUnit.unitState).length > 0) {
    endTurn(G, ctx, events, thisUnit)
  } else {
    const raidEnemies = getRaidEnemies(G, thisUnit.unitState)
    if (raidEnemies.length === 0) {
      endTurn(G, ctx, events, thisUnit)
    } else {
      G.availablePoints = raidEnemies.map(u => u.unitState.point)
      events.setActivePlayers({ currentPlayer: 'doRaid' });
    }
  }
}

const handleLethalGrab = ({G, ctx}, {unitId, target}) => {
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
