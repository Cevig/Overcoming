import {
  cleanPlayer,
  getHousePrice,
  getInGameUnits,
  getNearestAllies,
  getNearestEnemies,
  getNearestEnemies2,
  getNeighbors,
  getStatus,
  getUnitById,
  handleUnitDeath,
  handleUnitMove,
  hasKeyword,
  hasStatus,
  isNotSame,
  isSame,
  onEndFightTurn,
  removeStatus,
  resolveUnitsInteraction
} from '../helpers/Utils';
import {startPositions} from "./Setup";
import {
  Buildings,
  createPoint,
  DamageType,
  UnitKeywords,
  UnitSkills,
  UnitStatus,
  UnitTypes
} from "../helpers/Constants";
import {handleAbility} from "./UnitSkills";

export const moves = {

  summonUnit: ({G, ctx, events, playerID}, currentUnit, price) => {
    currentUnit.price = price
    G.players[+playerID].units.push(currentUnit)
    G.players[+playerID].essence = G.players[+playerID].essence - price
  },

  sellUnitMove: ({G, ctx, events, playerID}, currentUnit) => {
    G.players[+playerID].units = G.players[+playerID].units.filter(u => u.id !== currentUnit.id)
    G.players[+playerID].essence = G.players[+playerID].essence + currentUnit.price
  },

  selectNewUnit: ({G, ctx, events, playerID}, currentUnit) => {
    const player = G.players[+playerID]
    if (currentUnit.unitState.isInSortie) {
      player.availablePoints = []
    } else {
      if (currentUnit.type === UnitTypes.Idol)
        player.availablePoints = [startPositions(ctx.numPlayers)[+playerID][0]]
      else
        player.availablePoints = startPositions(ctx.numPlayers)[+playerID].slice(1, startPositions(ctx.numPlayers)[+playerID].length)
    }
    player.currentUnit = currentUnit
    events.endStage();

  },
  selectOldUnit: ({ G, ctx, events, playerID }, currentUnit) => {
    const player = G.players[+playerID]
    if (currentUnit.type === UnitTypes.Idol)
      player.availablePoints = [startPositions(ctx.numPlayers)[+playerID][0]]
    else
      player.availablePoints = startPositions(ctx.numPlayers)[+playerID].slice(1, startPositions(ctx.numPlayers)[+playerID].length)
    player.currentUnit = currentUnit
    events.endStage();
  },

  chooseBlockSideActionMove: ({ G, ctx, events, playerID }) => {
    G.players[+playerID].availablePoints = getNeighbors(G.players[+playerID].currentUnit.unitState.point)
    events.setStage('chooseBlockSideActionStage');
  },

  doSetBlockSide: ({ G, ctx, events, playerID }, point) => {
    const thisUnit = getUnitById(G, G.players[+playerID].currentUnit.id)
    const skill = thisUnit.abilities.statUpdates.defence.find(skill => skill.name === UnitSkills.BlockDamage)
    const currentPoint = thisUnit.unitState.point
    skill.point = createPoint(point.x - currentPoint.x, point.y - currentPoint.y, point.z - currentPoint.z)

    G.players[+playerID].currentUnit = null
    G.players[+playerID].availablePoints = []
    events.setStage('pickUnit');
  },

  selectUnitOnBoard: ({ G, ctx, events }, currentUnit) => {
    const enemies = getNearestEnemies(G, currentUnit.unitState)
    const gameUnits = getInGameUnits(G)
    if (hasStatus(currentUnit, UnitStatus.Freeze)) {
      G.availablePoints = []
    } else {
      let availablePoints = getNeighbors(currentUnit.unitState.point)
        .filter(point => gameUnits.every(unit => isNotSame(unit.unitState.point)(point)))
        .filter(point => {
          if (enemies.length > 0 && !hasKeyword(currentUnit, UnitKeywords.AbsoluteMove)) {
            const surroundings = getNeighbors(point)
            return enemies.every(enemy => surroundings.find(isSame(enemy.unitState.point)) !== undefined)
          } else return true
        })
      if (hasKeyword(currentUnit, UnitKeywords.ExtendedMove) || hasKeyword(currentUnit, UnitKeywords.AbsoluteMove)) {
        availablePoints = availablePoints.flatMap(mainPoint => {
          const newEnemies = getNearestEnemies(G, {point: mainPoint, playerId: currentUnit.unitState.playerId})
          const extendedPoints = getNeighbors(mainPoint)
            .filter(point => gameUnits.every(unit => isNotSame(unit.unitState.point)(point)))
            .filter(point => {
              if (newEnemies.length > 0 && !hasKeyword(currentUnit, UnitKeywords.AbsoluteMove)) {
                const surroundings = getNeighbors(point)
                return newEnemies.every(enemy => surroundings.find(isSame(enemy.unitState.point)) !== undefined)
              } else return true
            })
          extendedPoints.push(mainPoint)
          return extendedPoints
        })
      }
      G.availablePoints = availablePoints
    }
    G.currentUnit = currentUnit
    events.endStage();
  },

  doActionToEnemy: ({ G, ctx, events }) => {
    const thisUnit = getUnitById(G, G.currentActionUnitId)
    const surroundings = getNeighbors(thisUnit.unitState.point)

    G.availablePoints = getInGameUnits(G, (unit) => unit.unitState.playerId !== thisUnit.unitState.playerId)
      .filter(unit => surroundings.find(point => isSame(point)(unit.unitState.point)))
      .filter(unit => unit.unitState.isClickable)
      .map(u => u.unitState.point)

    if (G.availablePoints.length === 0) {
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `Немає доступних цілей для пересування!`,
      })
    }
    events.endStage();
  },

  selectEnemy: ({ G, ctx, events }, currentUnit) => {
    if (hasStatus(currentUnit, UnitStatus.Freeze)) {
      G.availablePoints = []
    } else {
      G.availablePoints = getNeighbors(currentUnit.unitState.point)
        .filter(point => getInGameUnits(G).every(unit => isNotSame(unit.unitState.point)(point)))
    }
    G.currentUnit = currentUnit
    events.endStage();
  },

  selectUnitForAttack: ({ G, ctx, events }, currentUnit) => {
    let enemies = getNearestEnemies(G, currentUnit.unitState)
    if (hasStatus(currentUnit, UnitStatus.Unarmed)) {
      enemies = []
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${currentUnit.name} щось не може атакувати через статус "${UnitStatus.Unarmed}"`,
      })
    } else {
      const mainTargetEnemies = enemies.filter(enemy => enemy.abilities.keywords.find(keyword => keyword === UnitKeywords.MainTarget) !== undefined)
      if (mainTargetEnemies.length > 0) {
        enemies = mainTargetEnemies
        G.serverMsgLog.push({
          id: Math.random().toString(10).slice(2),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: `Спрацювала здібність "Головна Ціль" у ${mainTargetEnemies.length > 0 ? 'декількох істот' : mainTargetEnemies[0].name}!`,
        })
      }
      const vengeanceStatus = getStatus(currentUnit, UnitStatus.Vengeance)
      if (vengeanceStatus) {
        const vengeanceTarget = getInGameUnits(G).find(unit => hasStatus(unit, UnitStatus.VengeanceTarget) && vengeanceStatus.enemyId === unit.id)
        if (vengeanceTarget) {
          if (enemies.find(enemy => enemy.id === vengeanceTarget.id)) {
            enemies = [vengeanceTarget]
            G.serverMsgLog.push({
              id: Math.random().toString(10).slice(2),
              turn: ctx.turn,
              player: +ctx.currentPlayer,
              phase: ctx.phase,
              text: `Мстивість дозволяє атакувати тільки ${vengeanceTarget.name}`,
            })
          } else {
            enemies = []
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
    }

    G.availablePoints = enemies.map(unit => unit.unitState.point)
    G.currentUnit = currentUnit
    events.endStage();
  },

  moveUnit: ({G, ctx, events, playerID}, point) => {
    const player = G.players[+playerID]
    const unit = player.units.find(unit => unit.id === player.currentUnit.id)
    const unitToReplace = getInGameUnits(G).find(unit => isSame(point)(unit.unitState.point))
    if (unitToReplace !== undefined) {
      if (unit.unitState.point !== null) {
        unitToReplace.unitState.point = unit.unitState.point
      } else {
        unitToReplace.unitState.point = null
        unitToReplace.unitState.isInGame = false
      }
    }
    unit.unitState.point = point
    unit.unitState.isInGame = true
    player.currentUnit = null
    player.availablePoints = []
    events.endStage();
  },

  removeUnit: ({G, ctx, events, playerID}) => {
    const player = G.players[+playerID]
    const unit = player.units.find(unit => unit.id === player.currentUnit.id)
    unit.unitState.point = null
    unit.unitState.isInGame = false
    unit.unitState.isInSortie = false
    player.sortie = player.sortie.filter(su => su.unitId !== unit.id)
    player.availablePoints = []
    player.currentUnit = null
    events.endStage();
  },

  moveUnitOnBoard: ({G, ctx, events}, point) => {
    const unit = getInGameUnits(G).find(unit => unit.id === G.currentUnit.id)
    handleUnitMove(G, ctx, unit.id, point)
    const activeAbilities = G.currentUnit.abilities.actions.filter(action => action.qty > 0)
    if (activeAbilities.length > 0) {
      activeAbilities.forEach(action => {
        G.currentActionUnitId = unit.id
        handleAbility({ G, ctx, events }, action.name, {unitId: G.currentUnit.id})
      })
    } else {
      unit.unitState.isClickable = false
      G.availablePoints = []
      events.endTurn()
    }
  },

  moveEnemy: ({G, ctx, events}, point) => {
    const unit = getInGameUnits(G).find(unit => unit.id === G.currentUnit.id)
    handleUnitMove(G, ctx, unit.id, point)
    unit.unitState.isClickable = false
    let actionQty = 0;
    const thisUnit = getUnitById(G, G.currentActionUnitId)
    thisUnit.abilities.actions.forEach(action => {
      if (action.name === UnitSkills.Urka) {
        action.qty--;
        actionQty = action.qty
      }
    })
    thisUnit.unitState.isClickable = false
    G.currentActionUnitId = undefined
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} викорстовує здібність та пересуває істоту. Залишилось ${actionQty} заряди`,
    })
    G.availablePoints = []
    events.endTurn()
  },

  hookUnit: ({G, ctx, events}, point) => {
    const unit = getInGameUnits(G).find(unit => unit.id === G.currentUnit.id)
    handleUnitMove(G, ctx, unit.id, point)
    const thisUnit = getUnitById(G, G.currentActionUnitId)
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} викорстовує здібність та пересуває істоту`,
    })
    thisUnit.unitState.isClickable = false
    G.availablePoints = []
    G.currentUnit = null
    onEndFightTurn(G, ctx)
  },

  throwOverActionMove: ({G, ctx, events}, point) => {
    const unit = getInGameUnits(G).find(unit => unit.id === G.currentUnit.id)
    handleUnitMove(G, ctx, unit.id, point)
    const thisUnit = getUnitById(G, G.currentActionUnitId)
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} викорстовує здібність та перекидує істоту`,
    })
    thisUnit.unitState.isClickable = false
    G.availablePoints = []
    G.currentUnit = null
    onEndFightTurn(G, ctx)
  },

  moveAgain: ({G, ctx, events}, point) => {
    const unit = getInGameUnits(G).find(unit => unit.id === G.currentUnit.id)
    unit.unitState.isClickable = false
    handleUnitMove(G, ctx, unit.id, point)
    G.currentUnit = null
    G.currentActionUnitId = undefined
    G.availablePoints = []
    let actionQty = 0;
    unit.abilities.actions.forEach(action => {
      if (action.name === UnitSkills.Urka) {
        action.qty--;
        actionQty = action.qty
      }
    })
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${unit.name} викорстовує здібність та робить додатковий хід. Залишилось ${actionQty} заряди`,
    })
    events.endTurn();
  },

  attackTarget: ({G, ctx, events}, point) => {
    const enemy = getInGameUnits(G).find((unit) => isSame(unit.unitState.point)(point))
    const unit = getUnitById(G, G.currentUnit.id)

    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: unit,
      enemy: enemy,
      updates: {
        damage: unit.power > 0 ? unit.power : 0,
        damageType: DamageType.Default,
      }
    })

    if (hasKeyword(enemy, UnitKeywords.AlwaysCounterDamage) || (enemy.heals > 0 && !hasKeyword(unit, UnitKeywords.Sneaky) && !hasKeyword(enemy, UnitKeywords.Unfocused) &&
      !hasStatus(enemy, UnitKeywords.Unfocused) && !hasStatus(enemy, UnitStatus.Unarmed) && enemy.unitState.isCounterAttacked === false)) {
      enemy.unitState.isCounterAttacked = true
      let dmgPower = enemy.power === 1 ? 1 : Math.trunc(enemy.power / 2)
      dmgPower = hasKeyword(enemy, UnitKeywords.FullDeathDamage) ? enemy.power : dmgPower
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: enemy,
        enemy: unit,
        updates: {
          damage: Math.max(dmgPower, 0),
          damageType: DamageType.Counter,
        }
      })
    }

    if(enemy.heals <= 0) {
      handleUnitDeath({G: G, ctx: ctx, events: events}, enemy, unit)
      G.fightQueue.forEach((unitInQ, i, q) => {
        if(unitInQ.unitId === enemy.id) {
          q.splice(i, 1);
        }
      })
    }
    if(unit.heals <= 0) {
      handleUnitDeath({G: G, ctx: ctx, events: events}, unit, enemy)
      G.fightQueue.forEach((unitInQ, i, q) => {
        if(unitInQ.unitId === unit.id) {
          q.splice(i, 1);
        }
      })
    }

    const activeAbilities = unit.abilities.afterHitActions.filter(action => action.qty > 0)
    if (enemy.unitState.isInGame && unit.unitState.isInGame && activeAbilities.length > 0) {
      activeAbilities.forEach(action => {
        G.currentActionUnitId = unit.id
        handleAbility({ G, ctx, events }, action.name, {unitId: unit.id, enemyId: enemy.id})
      })
    } else {
      unit.unitState.isClickable = false
      G.currentUnit = null
      G.availablePoints = []
      onEndFightTurn(G, ctx)
    }
  },

  raidAttack: ({G, events, ctx}, point) => {
    const enemy = getInGameUnits(G).find((unit) => isSame(unit.unitState.point)(point))
    const thisUnit = getUnitById(G, G.currentUnit.id)
    let raidDmg = G.currentUnit.power > 0 ? Math.max(Math.trunc(G.currentUnit.power / 2), 1) : 0
    if (hasKeyword(thisUnit, UnitKeywords.AdditionalSacrificeRaid)) raidDmg = raidDmg + 1;

    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: enemy,
      updates: {
        damage: raidDmg,
        damageType: DamageType.Raid,
      }
    })
    if(enemy.heals <= 0) {
      handleUnitDeath({G: G, ctx: ctx, events: events}, enemy, thisUnit)
    }

    if (hasKeyword(thisUnit, UnitKeywords.AdditionalSacrificeRaid)) {
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: thisUnit,
        enemy: thisUnit,
        updates: {
          damage: 1,
          damageType: DamageType.ReplaceHeals,
        }
      })
      if(thisUnit.heals <= 0) {
        handleUnitDeath({G: G, ctx: ctx, events: events}, thisUnit)
      }
    }

    G.players.filter(p => p.isPlayerInGame).forEach(p => {
      if (p.units.every(unit => unit.unitState.isInGame === false)) p.isPlayerInBattle = false
    })
    if (G.players.filter(p => p.isPlayerInBattle).length <= 1) {
      events.endPhase()
    }

    const nearAllies = enemy.unitState.point ? getNearestAllies(G, enemy.unitState) : []
    if (enemy.heals > 0 && thisUnit.heals > 0 && nearAllies.length > 0 && hasKeyword(thisUnit, UnitKeywords.ReplaceHealsRaid)) {
      G.availablePoints = nearAllies.map(u => u.unitState.point)
      G.currentActionUnitId = thisUnit.id
      G.currentEnemySelectedId = enemy.id
    } else {
      G.availablePoints = []
      G.currentUnit = null
      thisUnit.unitState.isClickable = false
      events.endTurn()
    }
  },

  replaceHeals: ({G, events, ctx}, point) => {
    const thisUnit = getUnitById(G, G.currentActionUnitId)
    const enemy = getUnitById(G, G.currentEnemySelectedId)
    const newEnemy = getInGameUnits(G).find(unit => isSame(unit.unitState.point)(point))

    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} викорстовує особливість та преливає життя`,
    })

    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: enemy,
      updates: {
        damage: 1,
        damageType: DamageType.ReplaceHeals,
      }
    })
    if (enemy.heals <= 0) {
      handleUnitDeath({G: G, ctx: ctx, events: events}, enemy, thisUnit)
    }
    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: newEnemy,
      updates: {
        damage: -1,
        damageType: DamageType.ReplaceHeals,
      }
    })

    G.availablePoints = []
    thisUnit.unitState.isClickable = false
    events.endTurn()
  },

  skipRaidTurn: ({ G, events, ctx }) => {
    const thisUnit = getUnitById(G, G.currentUnit.id)
    thisUnit.unitState.isClickable = false
    G.availablePoints = []
    G.currentUnit = null
    events.endTurn()
  },

  skipUrkaAction: ({ G, events, ctx }) => {
    const thisUnit = getUnitById(G, G.currentUnit.id)
    G.availablePoints = []
    thisUnit.unitState.isClickable = false
    events.endTurn()
  },

  completeBuilding: ({G, ctx, events, playerID}) => {
    const player = G.players.find(p => p.id === +playerID);
    if (player.units.filter(u => u.type === UnitTypes.Idol).length > 0 && player.units.filter(u => u.type !== UnitTypes.Idol).length > 0) {
      G.buildingComplete++
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +playerID,
        phase: ctx.phase,
        text: `Гравець ${+playerID+1} завершив будування`,
      })
      events.setStage('finishBuildingStage')
    } else {
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +playerID,
        phase: ctx.phase,
        text: `Гравцю ${+playerID+1} необхідно викликати Ідола та хоч одну істоту`,
      })
    }
  },

  sacrificeHeals: ({G, ctx, events, playerID}) => {
    const player = G.players.find(p => p.id === +playerID);
    player.heals -= 2;
    player.isUsedSacrifice = true
    player.essence += 10;
  },

  complete: ({G, ctx, events, playerID}) => {
    const player = G.players.find(p => p.id === +playerID);
    if (player.units.filter(u => u.type === UnitTypes.Idol && u.unitState.isInGame).length > 0 &&
      player.units.filter(u => u.type !== UnitTypes.Idol && u.unitState.isInGame).length > 0) {
      G.setupComplete++
      G.players[+playerID].availablePoints = []
      G.players[+playerID].isPlayerInBattle = true
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +playerID,
        phase: ctx.phase,
        text: `Гравець ${+playerID+1} завершив розташування`,
      })
      events.setStage('finishSetupStage')
    } else {
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +playerID,
        phase: ctx.phase,
        text: `Гравцю ${+playerID+1} необхідно розмістити Ідола та хоч одну істоту на полі`,
      })
    }
  },

  nextRoundMove: ({G, ctx, events, playerID}) => {
    G.battleResultComplete++
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +playerID,
      phase: ctx.phase,
      text: `Гравець ${+playerID+1} готов перйти до наступного раунду`,
    })
    events.setStage('finishBattleResultStage')
  },

  skipTurn: ({ G, events, ctx }) => {
    const unit = getUnitById(G, G.currentUnit.id)
    removeStatus(unit, UnitStatus.Freeze)
    G.availablePoints = []

    if (G.currentUnit.abilities.actions.find(action => action.name === UnitSkills.Raid) !== undefined) {
      handleAbility({ G, ctx, events }, UnitSkills.Raid, {unitId: G.currentUnit.id})
    } else {
      unit.unitState.isClickable = false
      G.currentUnit = null
      events.endTurn()
    }
  },

  skipFightTurn: ({ G, ctx }) => {
    const unit = getUnitById(G, G.currentUnit.id)
    if (unit.unitState.skippedTurn) {
      unit.unitState.isClickable = false
    } else {
      G.fightQueue.forEach((unitInQ, i, q) => {
        if(unitInQ.unitId === G.currentUnit.id) {
          q.push(q.splice(i, 1)[0]);
        }
      })
      unit.unitState.skippedTurn = true
    }
    G.currentUnit = null
    G.availablePoints = []
    onEndFightTurn(G, ctx)
  },

  skipHook: ({ G, ctx }) => {
    const unit = getUnitById(G, G.currentActionUnitId)
    unit.unitState.isClickable = false
    G.availablePoints = []
    G.currentUnit = null
    onEndFightTurn(G, ctx)
  },

  healAllyActionMove: ({ G, ctx, events }) => {
    G.availablePoints = getInGameUnits(G, unit => unit.unitState.playerId === G.currentUnit.unitState.playerId)
      .filter(unit => unit.type !== UnitTypes.Idol)
      .filter(unit => unit.id !== G.currentUnit.id)
      .map(unit => unit.unitState.point)
    if (G.availablePoints.length === 0) {
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${G.currentUnit.name} не має доступних цілей для вибору`,
      })
    }

    events.setActivePlayers({ currentPlayer: 'healAllyActionStage' });
  },

  doHealAlly: ({ G, ctx, events }, point) => {
    const unit = getInGameUnits(G).find(unit => unit.id === G.currentUnit.id)
    const ally = getInGameUnits(G).find(unit => isSame(unit.unitState.point)(point))

    const healValue = Math.min(ally.unitState.baseStats.heals, ally.heals + 2) - ally.heals

    let actionQty = 0
    unit.abilities.allTimeActions.forEach(action => {
      if (action.name === UnitSkills.healAlly) {
        action.qty--;
        actionQty = action.qty
      }
    })
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${unit.name} викорстовує здібність та зцілює істоту. Залишилось ${actionQty} заряди`,
    })

    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: unit,
      enemy: ally,
      updates: {
        damage: -healValue,
        damageType: DamageType.Heal,
      }
    })

    G.currentUnit = null
    unit.unitState.isClickable = false
    G.availablePoints = []
    ctx.phase === 'Positioning' ? events.endTurn() : onEndFightTurn(G, ctx)
  },

  curseActionMove:  ({ G, ctx, events }) => {
    G.availablePoints = getInGameUnits(G, unit => unit.unitState.playerId !== G.currentUnit.unitState.playerId)
      .filter(unit => unit.type !== UnitTypes.Idol)
      .filter(unit => !hasStatus(unit, UnitStatus.Cursed))
      .map(unit => unit.unitState.point)
    G.availablePoints.push(G.currentUnit.unitState.point)
    G.currentActionUnitId = G.currentUnit.id

    events.setActivePlayers({ currentPlayer: 'curseAbasyActionStage' });
  },

  curseOrRecover: ({ G, ctx, events }, currentUnit) => {
    const unit = getInGameUnits(G).find(unit => unit.id === G.currentActionUnitId)

    let actionQty = 0
    unit.abilities.allTimeActions.forEach(action => {
      if (action.name === UnitSkills.abasuCurse) {
        action.qty--;
        actionQty = action.qty
      }
    })

    if (currentUnit.id === G.currentActionUnitId) {
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${unit.name} викорстовує здібність та відновлює життя. Залишилось ${actionQty} заряди`,
      })
      const healValue = Math.min(unit.unitState.baseStats.heals, unit.heals + 2) - unit.heals
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: unit,
        enemy: unit,
        updates: {
          damage: -healValue,
          damageType: DamageType.Heal,
        }
      })
    } else {
      const enemy = getUnitById(G, currentUnit.id)
      resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
        currentUnit: unit,
        enemy: enemy,
        updates: {
          initiative: 1,
          power: 1,
          status: [{name: UnitStatus.InitiativeDown, qty: 1}, {name: UnitStatus.PowerDown, qty: 1}, {name: UnitStatus.Cursed, qty: 99}]
        }
      });
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${unit.name} викорстовує здібність та насилає прокляття. Залишилось ${actionQty} заряди`,
      })
      G.availablePoints = G.availablePoints.filter(isNotSame(enemy.unitState.point))
    }

    if (actionQty <= 0) {
      moves.backFromAction({ G, ctx, events })
    }
  },

  backFromAction: ({ G, ctx, events }) => {
    G.currentUnit = null
    G.availablePoints = []
    G.currentActionUnitId = undefined
    if (ctx.phase === 'Positioning') {
      events.setActivePlayers({ currentPlayer: 'pickUnitOnBoard' });
    } else {
      events.setActivePlayers({ currentPlayer: 'pickUnitForAttack' });
    }
  },

  throwWeaponActionMove: ({ G, ctx, events }) => {
    G.availablePoints = getNearestEnemies2(G, G.currentUnit.unitState).map(u => u.unitState.point)
    if (G.availablePoints.length === 0) {
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${G.currentUnit.name} не має доступних цілей для вибору`,
      })
    }
    G.currentActionUnitId = G.currentUnit.id
    events.setActivePlayers({ currentPlayer: 'throwWeaponActionStage' });
  },

  setElokoCurseActionMove: ({ G, ctx, events }) => {
    G.availablePoints = getInGameUnits(G, unit => G.currentUnit.unitState.playerId !== unit.unitState.playerId)
      .filter(unit => unit.type !== UnitTypes.Idol)
      .map(u => u.unitState.point)
    if (G.availablePoints.length === 0) {
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${G.currentUnit.name} не має доступних цілей для вибору`,
      })
    }
    G.currentActionUnitId = G.currentUnit.id
    events.setActivePlayers({ currentPlayer: 'setElokoCurseActionStage' });
  },

  setItOnFireActionMove: ({ G, ctx, events }) => {
    G.availablePoints = getInGameUnits(G, unit => G.currentUnit.unitState.playerId !== unit.unitState.playerId)
      .filter(unit => !hasStatus(unit, UnitStatus.Fired))
      .map(u => u.unitState.point)
    if (G.availablePoints.length === 0) {
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${G.currentUnit.name} не має доступних цілей для вибору`,
      })
    }
    G.currentActionUnitId = G.currentUnit.id
    events.setActivePlayers({ currentPlayer: 'setItOnFireActionStage' });
  },

  doThrowWeapon: ({ G, ctx, events }, point) => {
    const thisUnit = getUnitById(G, G.currentActionUnitId)
    const enemy = getInGameUnits(G).find(unit => isSame(unit.unitState.point)(point))

    let actionQty = 0
    thisUnit.abilities.allTimeActions.forEach(action => {
      if (action.name === UnitSkills.throwWeapon) {
        action.qty--;
        actionQty = action.qty
      }
    })
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} викорстовує здібність та завдає пошкоджень. Залишилось ${actionQty} заряди`,
    })

    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: enemy,
      updates: {
        damage: thisUnit.power > 0 ? thisUnit.power : 0,
        damageType: DamageType.Default,
      }
    })

    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: thisUnit,
      updates: {
        status: [{name: UnitStatus.Unarmed, qty: 2}]
      }
    })

    if (enemy.heals <= 0) {
      handleUnitDeath({G: G, ctx: ctx, events: events}, enemy, thisUnit)
    }

    moves.backFromAction({ G, ctx, events })
  },

  doSetElokoCurse: ({ G, ctx, events }, point) => {
    const thisUnit = getUnitById(G, G.currentActionUnitId)
    const enemy = getInGameUnits(G).find(unit => isSame(unit.unitState.point)(point))

    let actionQty = 0
    thisUnit.abilities.allTimeActions.forEach(action => {
      if (action.name === UnitSkills.SetElokoCurse) {
        action.qty--;
        actionQty = action.qty
      }
    })
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} викорстовує здібність та зачаровує ціль. Залишилось ${actionQty} заряди`,
    })

    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: enemy,
      updates: {
        initiative: 3,
        status: [{name: UnitStatus.Vengeance, qty: 99, enemyId: thisUnit.id}, {name: UnitStatus.InitiativeDown, qty: 3}]
      }
    })

    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: thisUnit,
      updates: {
        status: [{name: UnitStatus.VengeanceTarget, qty: 99}]
      }
    })

    moves.backFromAction({ G, ctx, events })
  },

  doSetItOnFire: ({ G, ctx, events }, point) => {
    const thisUnit = getUnitById(G, G.currentActionUnitId)
    const enemy = getInGameUnits(G).find(unit => isSame(unit.unitState.point)(point))

    let actionQty = 0
    thisUnit.abilities.allTimeActions.forEach(action => {
      if (action.name === UnitSkills.SetItOnFire) {
        action.qty--;
        actionQty = action.qty
      }
    })
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} викорстовує здібність та випалює ціль. Залишилось ${actionQty} заряди`,
    })

    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: enemy,
      updates: {
        power: 1,
        damage: 1,
        damageType: DamageType.Poison,
        status: [{name: UnitStatus.Fired, qty: 99}, {name: UnitStatus.PowerDown, qty: 1}]
      }
    })

    if (enemy.heals <= 0) {
      handleUnitDeath({G: G, ctx: ctx, events: events}, enemy, thisUnit)
    }

    G.currentUnit = null
    thisUnit.unitState.isClickable = false
    G.availablePoints = []
    ctx.phase === 'Positioning' ? events.endTurn() : onEndFightTurn(G, ctx)
  },

  replaceUnitsActionMove: ({ G, ctx, events }) => {
    G.availablePoints = getInGameUnits(G, unit => G.currentUnit.unitState.playerId !== unit.unitState.playerId)
      .filter(unit => unit.type !== UnitTypes.Idol)
      .map(unit => unit.unitState.point)

    if (G.availablePoints.length === 0) {
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${G.currentUnit.name} не має доступних цілей для вибору`,
      })
    }
    G.currentActionUnitId = G.currentUnit.id
    events.setActivePlayers({ currentPlayer: 'replaceUnitsActionStage' });
  },

  doReplaceUnitsActionFirst: ({ G, ctx, events }, point) => {
    const thisUnit = getUnitById(G, G.currentActionUnitId)
    const enemy = getInGameUnits(G).find(unit => isSame(unit.unitState.point)(point))
    G.availablePoints = getNearestEnemies(G, enemy.unitState)
      .filter(unit => unit.unitState.playerId === thisUnit.unitState.playerId)
      .filter(unit => unit.type !== UnitTypes.Idol)
      .map(unit => unit.unitState.point)
    G.currentEnemySelectedId = enemy.id
  },

  doReplaceUnitsAction: ({ G, ctx, events }, point) => {
    const thisUnit = getUnitById(G, G.currentActionUnitId)
    const enemy = getUnitById(G, G.currentEnemySelectedId)
    const ally = getInGameUnits(G).find(unit => isSame(unit.unitState.point)(point))

    let actionQty = 0
    thisUnit.abilities.allTimeActions.forEach(action => {
      if (action.name === UnitSkills.replaceUnits) {
        action.qty--;
        actionQty = action.qty
      }
    })
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} викорстовує здібність та міняє місцями істот. Залишилось ${actionQty} заряди`,
    })

    handleUnitMove(G, ctx, ally.id, enemy.unitState.point)
    handleUnitMove(G, ctx, enemy.id, point)

    G.currentUnit = null
    thisUnit.unitState.isClickable = false
    G.availablePoints = []
    ctx.phase === 'Positioning' ? events.endTurn() : onEndFightTurn(G, ctx)
  },

  pauseToRecoverActionMove: ({ G, ctx, events }) => {
    const thisUnit = getUnitById(G, G.currentUnit.id)

    let actionQty = 0
    thisUnit.abilities.allTimeActions.forEach(action => {
      if (action.name === UnitSkills.pauseToRecover) {
        action.qty--;
        actionQty = action.qty
      }
    })
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} викорстовує здібність та відновлює життя. Залишилось ${actionQty} заряди`,
    })
    const unitStatus = hasStatus(thisUnit, UnitStatus.Unfocused)
    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: thisUnit,
      updates: {
        damage: -(Math.max((thisUnit.unitState.baseStats.heals - thisUnit.heals), 0)),
        damageType: DamageType.Heal,
        status: [{name: UnitStatus.Unfocused, qty: ctx.phase === 'Positioning' ? 1 : unitStatus ? 1 : 2}]
      }
    })

    moves.backFromAction({ G, ctx, events })
  },

  notMovedRecoverActionMove: ({ G, ctx, events }) => {
    const thisUnit = getUnitById(G, G.currentUnit.id)

    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} викорстовує здібність та відновлює життя`,
    })

    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: thisUnit,
      updates: {
        damage: -(Math.max((thisUnit.unitState.baseStats.heals - thisUnit.heals), 0)),
        damageType: DamageType.Heal
      }
    })

    G.currentUnit = null
    thisUnit.unitState.isClickable = false
    G.availablePoints = []
    events.endTurn()
  },

  chargeAttackActionMove: ({ G, ctx, events }) => {
    const thisUnit = getUnitById(G, G.currentUnit.id)

    let actionQty = 0
    thisUnit.abilities.allTimeActions.forEach(action => {
      if (action.name === UnitSkills.ChargeAttack) {
        action.qty--;
        actionQty = action.qty
      }
    })
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisUnit.name} викорстовує здібність та заряджає наступну атаку. Залишилось ${actionQty} заряди`,
    })

    resolveUnitsInteraction({G: G, ctx: ctx, events: events}, {
      currentUnit: thisUnit,
      enemy: thisUnit,
      updates: {
        power: -2,
        status: [{name: UnitStatus.PowerUpCharge, qty: 1}]
      }
    })
    thisUnit.abilities.statUpdates.attack.push(UnitSkills.RemoveChargeAttack)

    G.currentUnit = null
    thisUnit.unitState.isClickable = false
    G.availablePoints = []
    events.endTurn()
  },

  unitToSortie: ({ G, ctx, events, playerID }, pId) => {
    const player = G.players[+playerID]
    const unit = player.units.find(unit => unit.id === player.currentUnit.id)
    const unitInSortie = player.sortie.find(su => unit.id === su.unitId)
    if (!unitInSortie) {
      player.sortie.push({unitId: unit.id, unitName: unit.name, playerId: pId})
      unit.unitState.isInSortie = true
    } else {
      if (unitInSortie.playerId !== pId) {
        unitInSortie.playerId = pId
      }
    }
    player.currentUnit = null
    player.availablePoints = []
    events.endStage();
  },

  ///////////////////////////////////////////////////////////

  buyHouseMove: ({ G, ctx, events, playerID }, house) => {
    const player = G.players.find(p => p.id === +playerID);
    player.essence = player.essence - getHousePrice(house, player)
    const playerHouse = player.houses.find(h => h.name === house.name)
    if (playerHouse) playerHouse.qty++;
    else player.houses.push({...house, turn: ctx.turn })
  },

  sellHouseMove: ({ G, ctx, events, playerID }, house) => {
    const player = G.players.find(p => p.id === +playerID);
    player.essence = player.essence + getHousePrice(house, player)
    player.houses = player.houses.filter(h => h.name !== house.name)
  },

  leaveGame: ({ G, ctx, events, playerID }) => {
    const player = G.players.find(p => p.id === +playerID);
    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${player.name} не подолав цей виклик та покинув гру`,
    })

    cleanPlayer(player)
  },

  damagePlayerMove: ({ G, ctx, events, playerID }, pId) => {
    const enemyPlayer = G.players.find(p => p.id === pId);
    const thisPlayer = G.players.find(p => p.id === +playerID);

    let dmg = thisPlayer.units.filter(u => u.unitState.isInGame).reduce((val, unit) => val + unit.power, 0)
    if(thisPlayer.houses.find(h => h.name === Buildings.Veja.name)) dmg *=2;
    enemyPlayer.heals -= dmg
    thisPlayer.dealtDamage = true

    G.serverMsgLog.push({
      id: Math.random().toString(10).slice(2),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: `${thisPlayer.name} завдає ${dmg} урону по Гравцю ${enemyPlayer.id+1}`,
    })

    if (enemyPlayer.houses.find(h => h.name === Buildings.Zmicnenja.name)) {
      thisPlayer.units.filter(u => u.unitState.isInGame).forEach(u => {
        u.heals -= 2;
        if (u.heals <= 0) {
          handleUnitDeath({G: G, ctx: ctx, events: events}, u)
        }
      })
    }

    if (enemyPlayer.heals <= 0) {
      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: `${enemyPlayer.name} не подолав цей виклик та був знищений`,
      })

      cleanPlayer(enemyPlayer)
    }
  }
};
