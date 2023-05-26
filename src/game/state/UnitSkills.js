import {
  getInGameUnits,
  getNearestAllies,
  getNearestEnemies,
  getNearestEnemies2,
  getNearestUnits,
  getNeighbors,
  getNeighbors2,
  getRaidEnemies,
  getStatus,
  getUnitById,
  handleUnitDeath,
  hasKeyword,
  hasStatus,
  isNotSame,
  isSame,
  onEndFightTurn,
  resolveUnitsInteraction
} from "../helpers/Utils";
import {USteppe} from "../units/Steppe";
import {
  createPoint,
  DamageType,
  DamageTypes,
  NegativeStatues,
  UnitKeywords,
  UnitSkills,
  UnitStatus,
  UnitTypes
} from "../helpers/Constants";

export const handleAbility = (data, skill, eventData) => {
  const abilitiesMap = {
    [UnitSkills.Surround3]: handlePolydnicaSurroundings,
    [UnitSkills.Wholeness]: handleWholenessOnDefence,
    [UnitSkills.BlockStatuses]: handleBlockStatusesOnDefence,
    [UnitSkills.AddFreezeEffect]: handleFreezeEffectOnAttack,
    [UnitSkills.AddUnfocusedEffect]: handleUnfocusedEffectOnAttack,
    [UnitSkills.AddPoisonEffect]: handlePoisonEffectOnAttack,
    [UnitSkills.AddPoisonEffectOnRaid]: handleAddPoisonEffectOnRaidOnAttack,
    [UnitSkills.AddVengeanceEffect]: handleVengeanceEffectOnAttack,
    [UnitSkills.AddStunEffect]: handleAddStunEffectOnAttack,
    [UnitSkills.MaraAura]: handleMaraAura,
    [UnitSkills.LowHealsAura]: handleLowHealsAura,
    [UnitSkills.Raid]: handleRaid,
    [UnitSkills.LethalGrab]: handleLethalGrab,
    [UnitSkills.LethalBlow]: handleLethalBlow,
    [UnitSkills.Urka]: handleUrka,
    [UnitSkills.InstantKill]: handleInstantKillOnAttack,
    [UnitSkills.InstantKillOnCounter]: handleInstantKillOnCounterOnAttack,
    [UnitSkills.Lesavka]: handleLesavka,
    [UnitSkills.ThrowOver]: handleThrowOver,
    [UnitSkills.UtilizeDeath]: handleUtilizeDeath,
    [UnitSkills.chainDamage]: handleChainDamageOnAttack,
    [UnitSkills.HalaAura]: handleHalaAura,
    [UnitSkills.RaidBlock]: handleRaidBlockOnDefence,
    [UnitSkills.AntiVestnick]: handleAntiVestnickOnDefence,
    [UnitSkills.ReduceDamage]: handleReduceDamageOnDefence,
    [UnitSkills.ObajifoAura]: handleObajifoAura,
    [UnitSkills.UnfocusedAura]: handleUnfocusedAura,
    [UnitSkills.HealOnAttack]: handleHealOnAttack,
    [UnitSkills.DeadlyDamage]: handleDeadlyDamageOnDefence,
    [UnitSkills.DoubleDamage]: handleDoubleDamageOnDefence,
    [UnitSkills.DoubleDamageInDefence]: handleDoubleDamageInDefenceOnDefence,
    [UnitSkills.ReturnDamage]: handleReturnDamageOnDefence,
    [UnitSkills.RoundDamage]: handleRoundDamageOnAttack,
    [UnitSkills.ThroughDamage]: handleThroughDamageOnAttack,
    [UnitSkills.BlockDamage]: handleBlockDamageOnDefence,
    [UnitSkills.InjuredDamage]: handleInjuredDamageOnDefence,
    [UnitSkills.DecreaseInitiative]: handleDecreaseInitiativeOnAttack,
    [UnitSkills.RemoveChargeAttack]: handleRemoveChargeAttackOnAttack,
  }

  return abilitiesMap[skill](data, eventData)
}
const handlePolydnicaSurroundings = ({G, ctx, events}, {unitId}) => {
  const units = getInGameUnits(G)
  const thisUnit = getUnitById(G, unitId)
  const alliedUnits = units.filter(unit => (unit.unitState.playerId === thisUnit.unitState.playerId) && (unit.abilities.onMove.find(skill => skill.name === UnitSkills.Surround3)))
  if (alliedUnits.length >= 2) {
    const enemyUnits = units.filter(unit => (unit.unitState.playerId !== thisUnit.unitState.playerId) && (unit.type !== UnitTypes.Idol))
    enemyUnits.forEach(enemy => {
      const enemiesForEnemy = getNearestEnemies(G, enemy.unitState).filter(unit => unit.abilities.onMove.find(skill => skill.name === UnitSkills.Surround3))
      if (enemiesForEnemy.length >= 2) {
        enemiesForEnemy.forEach(polydnica => {
          const thisPoint = polydnica.unitState.point
          const enemyPoint = enemy.unitState.point
          if (enemyPoint === null) return;
          const vector = {x: enemyPoint.x - thisPoint.x, y: enemyPoint.y - thisPoint.y, z: enemyPoint.z - thisPoint.z}
          const acrossPolydnicaPoint = createPoint(...[enemyPoint.x + vector.x, enemyPoint.y + vector.y, enemyPoint.z + vector.z])
          const acrossPolydnica = getInGameUnits(G, unit => thisUnit.unitState.playerId === unit.unitState.playerId)
            .find(unit => isSame(acrossPolydnicaPoint)(unit.unitState.point) && unit.name === polydnica.name && unit.abilities.onMove.find(skill => skill.name === UnitSkills.Surround3))

          if (acrossPolydnica) {
            G.serverMsgLog.push({
              id: Math.random().toString(10).slice(2),
              turn: ctx.turn,
              player: +ctx.currentPlayer,
              phase: ctx.phase,
              text: `${enemy.name} в оточенні та миттєво вмирає!`,
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
    })
  }
}

const handleMaraAura = ({G, ctx, events}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId)

  getInGameUnits(G, unit => unit.unitState.playerId !== thisUnit.unitState.playerId).forEach(enemy => {
    const nearMaras = getNearestEnemies(G, enemy.unitState).filter(unit => unit.name === USteppe.maraName)
    const auraKeyword = UnitStatus.InitiativeDownAura
    const enemyStatus = getStatus(enemy, auraKeyword)

    let value = 0
    if (enemyStatus !== undefined) {
      value = value - enemyStatus.qty
    }
    if (nearMaras.length > 0) {
      value = value + nearMaras.reduce((val, mara) => val + ((mara.level >= 1) ? 3 : 2), 0)
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

const handleLowHealsAura = ({G, ctx, events}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId)

  getInGameUnits(G, unit => unit.unitState.playerId !== thisUnit.unitState.playerId).forEach(enemy => {
    const nearLowHealsAuras = getNearestEnemies(G, enemy.unitState).filter(unit => unit.abilities.onMove.find(skill => skill.name === UnitSkills.LowHealsAura))
    const auraKeyword = UnitStatus.HealsDownAura
    const enemyStatus = getStatus(enemy, auraKeyword)

    let value = 0
    if (enemyStatus !== undefined) {
      value = value - enemyStatus.qty
    }
    if (nearLowHealsAuras.length > 0) {
      value = value + nearLowHealsAuras.reduce((val, _) => val + 1, 0)
    }
    if (value < 0 || (value > 0 && enemy.heals > 1)) {
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: thisUnit,
        enemy: enemy,
        updates: {
          damage: value,
          damageType: DamageType.ReplaceHeals,
          status: [{name: auraKeyword, qty: value}]
        }
      })
    }
  })
}

const handleObajifoAura = ({G, ctx, events}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId)

  getInGameUnits(G, unit => unit.unitState.playerId === thisUnit.unitState.playerId).forEach(ally => {
    const nearObajifos = getNearestAllies(G, ally.unitState).filter(unit => unit.abilities.onMove.find(skill => skill.name === UnitSkills.ObajifoAura))
    const auraKeyword = UnitStatus.InitiativeUpAura
    const allyStatus = getStatus(ally, auraKeyword)

    let value = 0
    if (allyStatus !== undefined) {
      value = value - allyStatus.qty
    }
    if (nearObajifos.length > 0) {
      value = value + nearObajifos.reduce((val, _) => val + 1, 0)
    }
    if (value !== 0) {
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: thisUnit,
        enemy: ally,
        updates: {
          initiative: -value,
          status: [{name: auraKeyword, qty: value}]
        }
      });
    }
  })
}

const handleHalaAura = ({G, ctx, events}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId)

  getInGameUnits(G, unit => unit.unitState.playerId === thisUnit.unitState.playerId).forEach(ally => {
    const nearHalas = getNearestAllies(G, ally.unitState).filter(unit => unit.abilities.onMove.find(skill => skill.name === UnitSkills.HalaAura))
    const allyAbility = ally.abilities.statUpdates.defence.find(skill => skill.name === UnitSkills.RaidBlock)

    if (nearHalas.length > 0 && allyAbility === undefined) {
      ally.abilities.statUpdates.defence.push({name: UnitSkills.RaidBlock, origin: false})

      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${ally.name} отримує здібність ${UnitSkills.RaidBlock}`,
      })
    }
    if (nearHalas.length === 0 && allyAbility && allyAbility.origin === false) {
      ally.abilities.statUpdates.defence = ally.abilities.statUpdates.defence.filter(skill => skill.name !== UnitSkills.RaidBlock)

      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${ally.name} втрачає здібність ${UnitSkills.RaidBlock}`,
      })
    }
  })
}

const handleUnfocusedAura = ({G, ctx, events}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId)
  const gameUnits = getInGameUnits(G, unit => unit.unitState.playerId !== thisUnit.unitState.playerId)
  gameUnits.forEach(enemy => {
    const nearUnfocusedAuras = getNearestEnemies(G, enemy.unitState).filter(unit => unit.abilities.onMove.find(skill => skill.name === UnitSkills.UnfocusedAura))
    const auraKeyword = UnitStatus.Unfocused
    const enemyStatus = getStatus(enemy, auraKeyword)

    if (nearUnfocusedAuras.length > 0 && enemyStatus === undefined) {
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: thisUnit,
        enemy: enemy,
        updates: {
          status: [{name: auraKeyword, qty: 10100}]
        }
      })

    }
    if (nearUnfocusedAuras <= 0 && enemyStatus && enemyStatus.qty > 10000) {
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: thisUnit,
        enemy: enemy,
        updates: {
          status: [{name: auraKeyword, qty: -10100}]
        }
      })
    }
  })
}

/////////////////////////////////////////////////////

const handleWholenessOnDefence = ({G, ctx}, {unitId, updates}) => {
  const thisUnit = getUnitById(G, unitId)

  if (updates.power !== undefined) {
    updates.power = ((thisUnit.power - updates.power) < thisUnit.unitState.baseStats.power) ?  (thisUnit.power - thisUnit.unitState.baseStats.power) : updates.power
    if (updates.status !== undefined && updates.power === 0) {
      const decreasingStatusPower = updates.status.find(status => status.name === UnitStatus.PowerDown)
      if(decreasingStatusPower !== undefined) {
        decreasingStatusPower.qty = -1
        G.serverMsgLog.push({
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
      const decreasingStatusInit = updates.status.find(status => status.name === UnitStatus.InitiativeDown || status.name === UnitStatus.InitiativeDownAura)
      if(decreasingStatusInit !== undefined) {
        decreasingStatusInit.qty = -1
        G.serverMsgLog.push({
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

const handleBlockStatusesOnDefence = ({G, ctx}, {unitId, updates}) => {
  const thisUnit = getUnitById(G, unitId)

  if (updates.status) {
    updates.status.forEach(status => {
      if (NegativeStatues.find(ns => ns === status.name) && status.qty > 0) {
        G.serverMsgLog.push({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `${thisUnit.name} блокує негатив і відводить статус ${status.name}`,
        })
        updates.status = updates.status.filter(us => us.name !== status.name)
        if (status.name === UnitStatus.PowerDown && updates.power && updates.power > 0) {
          updates.power = 0
        }
        if ((status.name === UnitStatus.InitiativeDown || status.name === UnitStatus.InitiativeDownAura) && updates.initiative && updates.initiative > 0) {
          updates.initiative = 0
        }
        if ((status.name === UnitStatus.HealsDownAura || status.name === UnitStatus.Fired) && updates.damage && updates.damage > 0) {
          updates.damage = 0
        }
      }
    })
  }
  return updates
}

const handleRaidBlockOnDefence = ({G, ctx}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Raid) {
    const thisUnit = getUnitById(G, unitId)
    updates.damage = 0
    if (updates.status) updates.status = []

    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} заблокував урон за допомогою здібності ${UnitSkills.RaidBlock}`,
    })
  }
  return updates
}

const handleAntiVestnickOnDefence = ({G, ctx}, {unitId, enemyId, updates}) => {
  const enemy = getUnitById(G, enemyId)
  if (enemy.type === UnitTypes.Vestnick && DamageTypes.find(type => type === updates.damageType)) {
    const thisUnit = getUnitById(G, unitId)
    updates.damage = Math.max(updates.damage - 1, 0)

    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} зменшив урон за допомогою здібності ${UnitSkills.AntiVestnick}`,
    })
  }
  return updates
}

const handleReduceDamageOnDefence = ({G, ctx}, {unitId, updates}) => {
  if (updates.damage > 1) {
    const thisUnit = getUnitById(G, unitId)
    updates.damage = updates.damage - 1

    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} зменшив урон за допомогою здібності ${UnitSkills.ReduceDamage}`,
    })
  }
  return updates
}

const handleDeadlyDamageOnDefence = ({G, ctx}, {unitId, enemyId, updates}) => {
  if (updates.damageType !== DamageType.Raid && DamageTypes.find(type => type === updates.damageType)) {
    const thisUnit = getUnitById(G, unitId)
    if (thisUnit.unitState.baseStats.heals > thisUnit.heals) {
      updates.damage = 99

      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${thisUnit.name} отримує смертельний урон через здібність ${UnitSkills.DeadlyDamage}`,
      })
    }
  }

  return updates
}

const handleDoubleDamageOnDefence = ({G, ctx}, {unitId, enemyId, updates}) => {
  if (DamageTypes.find(type => type === updates.damageType)) {
    const thisUnit = getUnitById(G, unitId)
    const enemy = getUnitById(G, enemyId)
    if (enemy.heals > thisUnit.heals) {
      updates.damage = updates.damage * 2

      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${thisUnit.name} отримує подвійний урон адже ${enemy.name} має більше життя`,
      })
    }
  }

  return updates
}

const handleDoubleDamageInDefenceOnDefence = ({G, ctx}, {unitId, enemyId, updates}) => {
  if (DamageTypes.find(type => type === updates.damageType)) {
    const thisUnit = getUnitById(G, unitId)
    const enemy = getUnitById(G, enemyId)
    if (enemy.type !== UnitTypes.Idol && enemy.unitState.initiatorFor.find(id => thisUnit.id === id)) {
      updates.damage = updates.damage * 2

      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${thisUnit.name} отримує подвійний урон адже ${enemy.name} ініціював битву`,
      })
    }
  }

  return updates
}

const handleReturnDamageOnDefence = ({G, ctx, events}, {unitId, enemyId, updates}) => {
  if (DamageTypes.find(type => type === updates.damageType)) {
    const thisUnit = getUnitById(G, unitId)
    const dmg = Math.trunc(updates.damage / 2)

    if (dmg > 0) {
      const enemy = getUnitById(G, enemyId)

      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${thisUnit.name} завдає шкоди за допомогою здібності ${UnitSkills.ReturnDamage}`,
      })
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: thisUnit,
        enemy: enemy,
        updates: {
          damage: dmg,
          damageType: DamageType.Counter,
        }
      })
    }
  }

  return updates
}

const handleBlockDamageOnDefence = ({G, ctx}, {unitId, enemyId, updates}) => {
  if (updates.damageType !== DamageType.Chained && DamageTypes.find(type => type === updates.damageType)) {
    const thisUnit = getUnitById(G, unitId)
    const enemy = getUnitById(G, enemyId)
    const skill = thisUnit.abilities.statUpdates.defence.find(skill => skill.name === UnitSkills.BlockDamage)
    if (skill.point) {
      const newPoint = createPoint(thisUnit.unitState.point.x + skill.point.x, thisUnit.unitState.point.y + skill.point.y, thisUnit.unitState.point.z + skill.point.z)
      const newPoint2 = createPoint(newPoint.x + skill.point.x, newPoint.y + skill.point.y, newPoint.z + skill.point.z)
      if (isSame(enemy.unitState.point)(newPoint) || isSame(enemy.unitState.point)(newPoint2)) {
        updates.damage = 0

        G.serverMsgLog.push({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `${thisUnit.name} блокує урон з цього боку від ${enemy.name}`,
        })
      }
    }
  }

  return updates
}

const handleInjuredDamageOnDefence = ({G, ctx, events}, {unitId, updates}) => {
  const thisUnit = getUnitById(G, unitId)
  if (updates.damage && (thisUnit.heals - updates.damage) < thisUnit.unitState.baseStats.heals) {
    thisUnit.abilities.statUpdates.defence = thisUnit.abilities.statUpdates.defence.filter(skill => skill.name !== UnitSkills.InjuredDamage)
    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: thisUnit,
      updates: {
        power: -1
      }
    })
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} підвищує силу через ${UnitSkills.InjuredDamage}`,
    })
  }

  return updates
}

const handleFreezeEffectOnAttack = ({G}, {unitId, updates}) => {
   if (updates.damageType === DamageType.Default || updates.damageType === DamageType.Chained) {
     if (updates.status) updates.status.push({name: UnitStatus.Freeze, qty: 1})
     else updates.status = [{name: UnitStatus.Freeze, qty: 1}]
   }
   return updates
}

const handleUnfocusedEffectOnAttack = ({G}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Default || updates.damageType === DamageType.Chained) {
    if (updates.status) updates.status.push({name: UnitStatus.Unfocused, qty: 99})
    else updates.status = [{name: UnitStatus.Unfocused, qty: 99}]
  }
  return updates
}

const handlePoisonEffectOnAttack = ({G}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Default || updates.damageType === DamageType.Chained) {
    if (updates.status) updates.status.push({name: UnitStatus.Poison, qty: 99})
    else updates.status = [{name: UnitStatus.Poison, qty: 99}]
  }
  return updates
}

const handleAddPoisonEffectOnRaidOnAttack = ({G}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Raid) {
    if (updates.status) updates.status.push({name: UnitStatus.Poison, qty: 99})
    else updates.status = [{name: UnitStatus.Poison, qty: 99}]
  }
  return updates
}

const handleVengeanceEffectOnAttack = ({G, ctx, events}, {unitId, enemyId, updates}) => {
  if (updates.damageType === DamageType.Default || updates.damageType === DamageType.Chained || updates.damageType === DamageType.Raid) {
    if (updates.status) updates.status.push({name: UnitStatus.Vengeance, qty: 99, enemyId: unitId})
    else updates.status = [{name: UnitStatus.Vengeance, qty: 99, enemyId: unitId}]
    const thisUnit = getUnitById(G, unitId)
    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: thisUnit,
      updates: {
        status: [{name: UnitStatus.VengeanceTarget, qty: 99}]
      }
    })
  }
  return updates
}

const handleAddStunEffectOnAttack = ({G, ctx, events}, {unitId, enemyId, updates}) => {
  if (updates.damageType === DamageType.Default || updates.damageType === DamageType.Chained) {
    if (updates.status) updates.status.push({name: UnitStatus.Stun, qty: 1})
    else updates.status = [{name: UnitStatus.Stun, qty: 1}]
  }
  return updates
}

const handleDecreaseInitiativeOnAttack = ({G, ctx}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Default || updates.damageType === DamageType.Chained || updates.damageType === DamageType.Raid) {
    updates.initiative = 1
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `Додатковий ефект удару - зниження ініціативи!`,
    })
  }
  return updates
}
const handleRemoveChargeAttackOnAttack = ({G, ctx, events}, {unitId, updates}) => {
  const thisUnit = getUnitById(G, unitId)
  if (DamageTypes.find(type => type === updates.damageType) && hasStatus(thisUnit, UnitStatus.PowerUpCharge)) {
    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: thisUnit,
      updates: {
        power: 2,
        status: [{name: UnitStatus.PowerUpCharge, qty: -1}]
      }
    })
    thisUnit.abilities.statUpdates.attack = thisUnit.abilities.statUpdates.attack.filter(skill => skill.name !== UnitSkills.RemoveChargeAttack)
  }
  return updates
}

const handleRoundDamageOnAttack = ({G, ctx, events}, {unitId, enemyId, updates}) => {
  if (updates.damageType === DamageType.Default) {
    const thisUnit = getUnitById(G, unitId)
    const enemy = getUnitById(G, enemyId)

    const getNearEnemiesToBoth = getNearestUnits(G, enemy.unitState)
      .filter(ally => ally.unitState.playerId !== thisUnit.unitState.playerId)
      .filter(ally => getNearestEnemies(G, ally.unitState).find(u => u.id === unitId))
    if (getNearEnemiesToBoth.length > 0) {
      getNearEnemiesToBoth.forEach(enemyAlly => {
        G.serverMsgLog.push({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `Удар по конусу по ${enemyAlly.name}`,
        })
        resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
          currentUnit: thisUnit,
          enemy: enemyAlly,
          updates: {
            damage: hasKeyword(thisUnit, UnitKeywords.RestrictedRoundDamage) ? 1 : updates.damage,
            damageType: DamageType.Chained,
          }
        })
        if(enemyAlly.heals <= 0) {
          handleUnitDeath({G: G, ctx: ctx, events: events}, enemyAlly, thisUnit)
          G.fightQueue.forEach((unitInQ, i, q) => {
            if(unitInQ.unitId === enemyAlly.id) {
              q.splice(i, 1);
            }
          })
        }
      })
    }
  }
  return updates
}

const handleThroughDamageOnAttack = ({G, ctx, events}, {unitId, enemyId, updates}) => {
  if (updates.damageType === DamageType.Default || updates.damageType === DamageType.Counter || updates.damageType === DamageType.Chained) {
    const thisUnit = getUnitById(G, unitId)
    const enemy = getUnitById(G, enemyId)
    const thisPoint = thisUnit.unitState.point
    const enemyPoint = enemy.unitState.point
    const vector = {x: enemyPoint.x - thisPoint.x, y: enemyPoint.y - thisPoint.y, z: enemyPoint.z - thisPoint.z}
    const newEnemyPoint = createPoint(...[enemyPoint.x + vector.x, enemyPoint.y + vector.y, enemyPoint.z + vector.z])
    const newEnemy = getInGameUnits(G, unit => thisUnit.unitState.playerId !== unit.unitState.playerId)
      .find(unit => isSame(newEnemyPoint)(unit.unitState.point))

    if (newEnemy) {
      const skill = newEnemy.abilities.statUpdates.defence.find(skill => skill.name === UnitSkills.BlockDamage)
      if (skill && skill.point) {
        const newEnemyBlockPoint = createPoint(newEnemy.unitState.point.x + skill.point.x, newEnemy.unitState.point.y + skill.point.y, newEnemy.unitState.point.z + skill.point.z)
        if (isSame(enemy.unitState.point)(newEnemyBlockPoint)) {
          G.serverMsgLog.push({
            id: Math.random().toString(10).slice(2),
            turn: ctx.turn,
            player: +ctx.currentPlayer,
            phase: ctx.phase,
            text: `Произуючий удар по ${newEnemy.name} заблоковано`,
          })
        }
      } else {
        G.serverMsgLog.push({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `Произуючий удар по ${newEnemy.name}`,
        })
        resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
          currentUnit: thisUnit,
          enemy: newEnemy,
          updates: {
            damage: updates.damage,
            damageType: DamageType.Chained,
          }
        })
        if(newEnemy.heals <= 0) {
          handleUnitDeath({G: G, ctx: ctx, events: events}, newEnemy, thisUnit)
          G.fightQueue.forEach((unitInQ, i, q) => {
            if(unitInQ.unitId === newEnemy.id) {
              q.splice(i, 1);
            }
          })
        }
      }
    }
  }
  return updates
}

const handleHealOnAttack = ({G, ctx, events}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Default) {
    const thisUnit = getUnitById(G, unitId)
    const healValue = Math.max(thisUnit.unitState.baseStats.heals - thisUnit.heals, 0)
    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: thisUnit,
      updates: {
        damage: -(healValue > 1 ? 1 : healValue),
        damageType: DamageType.Heal,
      }
    })
  }
  return updates
}

const handleChainDamageOnAttack = ({G, ctx, events}, {unitId, enemyId, updates}) => {
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
        G.serverMsgLog.push({
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
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${unit.name} сьогодні без рейду`,
    })
  }

  const thisUnit = getUnitById(G, unitId)
  if (getNearestEnemies(G, thisUnit.unitState).length > 0 && !hasKeyword(thisUnit, UnitKeywords.AbsoluteRaid)) {
    endTurn(G, ctx, events, thisUnit)
  } else {
    let raidEnemies

    if (hasKeyword(thisUnit, UnitKeywords.AbsoluteRaid)) {
      raidEnemies = getNearestEnemies2(G, thisUnit.unitState)
    } else if (hasKeyword(thisUnit, UnitKeywords.RestrictedRaid)) {
      raidEnemies = getNearestAllies(G, thisUnit.unitState).length >= 2 ? [] : getRaidEnemies(G, thisUnit.unitState)
    } else if (hasKeyword(thisUnit, UnitKeywords.NoObstaclesRaid)) {
      raidEnemies = getNearestEnemies(G, thisUnit.unitState).length > 0 ? [] : getNearestEnemies2(G, thisUnit.unitState)
    } else {
      raidEnemies = getRaidEnemies(G, thisUnit.unitState)
    }

    const mainTargetEnemies = raidEnemies.filter(enemy => enemy.abilities.keywords.find(keyword => keyword === UnitKeywords.MainTarget) !== undefined)
    if (mainTargetEnemies.length > 0) {
      raidEnemies = mainTargetEnemies
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `Спрацювала здібність "Головна Ціль" у ${mainTargetEnemies.length > 0 ? 'декількох істот' : mainTargetEnemies[0].name}!`,
      })
    }

    const vengeanceStatus = getStatus(thisUnit, UnitStatus.Vengeance)
    if (hasStatus(thisUnit, UnitStatus.Vengeance)) {
      const vengeanceTarget = getInGameUnits(G).find(unit => hasStatus(unit, UnitStatus.VengeanceTarget) && vengeanceStatus.enemyId === unit.id)
      if (vengeanceTarget) {
        if (raidEnemies.find(enemy => enemy.id === vengeanceTarget.id)) {
          raidEnemies = [vengeanceTarget]
          G.serverMsgLog.push({
            id: Math.random().toString(10).slice(2),
            turn: ctx.turn,
            player: +ctx.currentPlayer,
            phase: ctx.phase,
            text: `Мстивість дозволяє атакувати тільки ${vengeanceTarget.name}`,
          })
        } else {
          raidEnemies = []
          G.serverMsgLog.push({
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

const handleLethalGrab = ({G, ctx}, {killerId, target, thisUnit}) => {
  if (thisUnit.id !== killerId) return;

  if (target.type === UnitTypes.Idol) {
    thisUnit.power = thisUnit.level > 2 ? thisUnit.power + 2 : thisUnit.power + 1
    thisUnit.heals = thisUnit.level > 2 ? thisUnit.heals + 2 : thisUnit.heals + 1
    thisUnit.initiative = thisUnit.level > 2 ? thisUnit.initiative + 2 : thisUnit.initiative + 1
  } else if (target.type === UnitTypes.Prispeshnick) {
    thisUnit.heals = thisUnit.level > 2 ? thisUnit.heals + 2 : thisUnit.heals + 1
  } else if (target.type === UnitTypes.Prominkor) {
    thisUnit.power = thisUnit.level > 2 ? thisUnit.power + 2 : thisUnit.power + 1
  } else if (target.type === UnitTypes.Vestnick) {
    thisUnit.initiative = thisUnit.level > 2 ? thisUnit.initiative + 2 : thisUnit.initiative + 1
  }
  G.serverMsgLog.push({
    id: Math.random().toString(10).slice(2),
    turn: ctx.turn,
    player: +ctx.currentPlayer,
    phase: ctx.phase,
    text: `Характеристики ${thisUnit.name} були збільшені`,
  })
}

const handleLethalBlow = ({G, ctx, events}, {thisUnit, target}) => {
  if (thisUnit.id !== target.id) return

  const nearEnemies = getNearestEnemies(G, thisUnit.unitState)
  if (nearEnemies.length > 0) {
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} лакає всіх поблизу!`,
    })
    nearEnemies.forEach(enemy => {
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: thisUnit,
        enemy: enemy,
        updates: {
          status: [{name: UnitStatus.Unarmed, qty: 1}]
        }
      })
    })
  }
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
  G.currentUnit = thisUnit
  events.setActivePlayers({ currentPlayer: 'showUrkaAction' });
}

const handleInstantKillOnAttack = ({G}, {unitId, enemyId, updates}) => {
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

const handleInstantKillOnCounterOnAttack = ({G, ctx, events}, {unitId, enemyId, updates}) => {
  if (updates.damageType === DamageType.Counter) {
    const thisUnit = getUnitById(G, unitId)
    const enemy = getUnitById(G, enemyId)
    if (enemy.type !== UnitTypes.Idol) {
      updates.damage = 99;
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${thisUnit.name} смертельно вражає відповіддю`,
      })
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
    onEndFightTurn(G, ctx)
  }
}

const handleThrowOver = ({G, events, ctx}, {unitId, enemyId}) => {
  const thisUnit = getUnitById(G, unitId)
  const enemy = getUnitById(G, enemyId)

  const thisUnitPoint = thisUnit.unitState.point
  const enemyPoint = enemy.unitState.point
  const vector = {x: thisUnitPoint.x - enemyPoint.x, y: thisUnitPoint.y - enemyPoint.y, z: thisUnitPoint.z - enemyPoint.z}
  const newEnemyPoint = createPoint(...[thisUnitPoint.x + vector.x, thisUnitPoint.y + vector.y, thisUnitPoint.z + vector.z])

  getInGameUnits(G).find(unit => isSame(unit.unitState.point)(newEnemyPoint)) === undefined ? G.availablePoints = [newEnemyPoint] : G.availablePoints = []

  if (G.availablePoints.length > 0) {
    G.currentUnit = enemy
    events.setActivePlayers({ currentPlayer: 'throwOverAction' });
  } else {
    thisUnit.unitState.isClickable = false
    G.currentUnit = null
    onEndFightTurn(G, ctx)
  }
}

const handleUtilizeDeath = ({G, ctx, events}, {thisUnit, target}) => {
  if (getNeighbors2(thisUnit.unitState.point).find(isSame(target.unitState.point))) {
    const action = thisUnit.abilities.allTimeActions.find(action => action.name === UnitSkills.abasuCurse)
    if (action) {
      action.qty++

      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${thisUnit.name} отримує заряд`,
      })
    }
  }
}
