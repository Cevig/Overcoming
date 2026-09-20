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
  logUnitKeyword,
  logUnitName,
  logUnitSkill,
  logUnitStatus,
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
import i18n from "i18next";

/**
 * Generate a random ID string
 * @returns {string} Random ID
 */
const generateRandomId = () => Math.random().toString(10).slice(2);

/**
 * Create a log message entry
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @param {string} textKey - i18n key for the message text
 * @param {Object} textParams - Parameters for the i18n text
 * @returns {Object} Log message object
 */
const createLogMessage = (G, ctx, textKey, textParams = {}) => ({
  id: generateRandomId(),
  turn: ctx.turn,
  player: +ctx.currentPlayer,
  phase: ctx.phase,
  text: i18n.t(textKey, textParams),
});

/**
 * Calculate a new point based on a starting point and a vector
 * @param {Object} point - The starting point
 * @param {Object} vector - The vector to apply
 * @returns {Object} The new point
 */
const calculateNewPoint = (point, vector) => {
  return createPoint(
    point.x + vector.x,
    point.y + vector.y,
    point.z + vector.z
  );
};

/**
 * Check if a damage type is valid
 * @param {string} damageType - The damage type to check
 * @returns {boolean} True if the damage type is valid
 */
const isValidDamageType = (damageType) => DamageTypes.includes(damageType);

/**
 * Add a status effect to updates
 * @param {Object} updates - The updates object
 * @param {string} statusName - The name of the status to add
 * @param {number} qty - The quantity of the status
 * @param {Object} additionalProps - Additional properties for the status
 * @returns {Object} The updated updates object
 */
const addStatusEffect = (updates, statusName, qty, additionalProps = {}) => {
  const statusEffect = { name: statusName, qty, ...additionalProps };

  if (updates.status) {
    updates.status.push(statusEffect);
  } else {
    updates.status = [statusEffect];
  }

  return updates;
};

/**
 * Remove a unit from the fight queue
 * @param {Object} G - Game state
 * @param {string} unitId - The ID of the unit to remove
 */
const removeFromFightQueue = (G, unitId) => {
  const index = G.fightQueue.findIndex(unitInQ => unitInQ.unitId === unitId);
  if (index !== -1) {
    G.fightQueue.splice(index, 1);
  }
};

/**
 * Handle unit abilities based on skill type
 * @param {Object} data - Game data
 * @param {string} skill - Skill to handle
 * @param {Object} eventData - Event data
 * @returns {Object} Result of the ability handler
 */
export const handleAbility = (data, skill, eventData) => {
  const abilitiesMap = {
    // Surroundings and area effects
    [UnitSkills.Surround3]: handlePolydnicaSurroundings,
    [UnitSkills.RoundDamage]: handleRoundDamageOnAttack,
    [UnitSkills.ThroughDamage]: handleThroughDamageOnAttack,
    [UnitSkills.ChainDamage]: handleChainDamageOnAttack,

    // Defensive abilities
    [UnitSkills.Wholeness]: handleWholenessOnDefence,
    [UnitSkills.BlockStatuses]: handleBlockStatusesOnDefence,
    [UnitSkills.RaidBlock]: handleRaidBlockOnDefence,
    [UnitSkills.AntiVestnick]: handleAntiVestnickOnDefence,
    [UnitSkills.ReduceDamage]: handleReduceDamageOnDefence,
    [UnitSkills.DeadlyDamage]: handleDeadlyDamageOnDefence,
    [UnitSkills.DoubleDamage]: handleDoubleDamageOnDefence,
    [UnitSkills.DoubleDamageInDefence]: handleDoubleDamageInDefenceOnDefence,
    [UnitSkills.ReturnDamage]: handleReturnDamageOnDefence,
    [UnitSkills.BlockDamage]: handleBlockDamageOnDefence,
    [UnitSkills.InjuredDamage]: handleInjuredDamageOnDefence,

    // Status effect abilities
    [UnitSkills.AddFreezeEffect]: handleFreezeEffectOnAttack,
    [UnitSkills.AddUnfocusedEffect]: handleUnfocusedEffectOnAttack,
    [UnitSkills.AddPoisonEffect]: handlePoisonEffectOnAttack,
    [UnitSkills.AddPoisonEffectOnRaid]: handleAddPoisonEffectOnRaidOnAttack,
    [UnitSkills.AddVengeanceEffect]: handleVengeanceEffectOnAttack,
    [UnitSkills.AddStunEffect]: handleAddStunEffectOnAttack,
    [UnitSkills.DecreaseInitiative]: handleDecreaseInitiativeOnAttack,

    // Aura abilities
    [UnitSkills.MaraAura]: handleMaraAura,
    [UnitSkills.LowHealsAura]: handleLowHealsAura,
    [UnitSkills.HalaAura]: handleHalaAura,
    [UnitSkills.ObajifoAura]: handleObajifoAura,
    [UnitSkills.UnfocusedAura]: handleUnfocusedAura,

    // Special movement and positioning abilities
    [UnitSkills.Raid]: handleRaid,
    [UnitSkills.Urka]: handleUrka,
    [UnitSkills.Lesavka]: handleLesavka,
    [UnitSkills.ThrowOver]: handleThrowOver,

    // Combat and damage abilities
    [UnitSkills.LethalGrab]: handleLethalGrab,
    [UnitSkills.LethalBlow]: handleLethalBlow,
    [UnitSkills.InstantKill]: handleInstantKillOnAttack,
    [UnitSkills.InstantKillOnCounter]: handleInstantKillOnCounterOnAttack,
    [UnitSkills.HealOnAttack]: handleHealOnAttack,
    [UnitSkills.RemoveChargeAttack]: handleRemoveChargeAttackOnAttack,

    // Miscellaneous abilities
    [UnitSkills.UtilizeDeath]: handleUtilizeDeath,
  };

  // Return the result of the appropriate handler function
  return abilitiesMap[skill](data, eventData);
}
/**
 * Handle the Polydnica surrounding ability
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 */
const handlePolydnicaSurroundings = ({G, ctx, events}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId);
  if (!thisUnit) return;

  // Find allied units with Surround3 ability
  const alliedUnits = getInGameUnits(G).filter(unit =>
    unit.unitState.playerId === thisUnit.unitState.playerId &&
    unit.abilities.onMove.some(skill => skill.name === UnitSkills.Surround3)
  );

  // Only proceed if there are at least 2 allied units with Surround3
  if (alliedUnits.length < 2) return;

  // Find enemy units that are not Idols
  const enemyUnits = getInGameUnits(G).filter(unit =>
    unit.unitState.playerId !== thisUnit.unitState.playerId &&
    unit.type !== UnitTypes.Idol
  );

  // Process each enemy unit
  enemyUnits.forEach(enemy => {
    // Find enemies with Surround3 ability that are near this enemy
    const enemiesForEnemy = getNearestEnemies(G, enemy.unitState)
      .filter(unit => unit.abilities.onMove.some(skill => skill.name === UnitSkills.Surround3));

    // Only proceed if there are at least 2 enemies with Surround3 near this enemy
    if (enemiesForEnemy.length < 2) return;

    // Check each Polydnica unit
    enemiesForEnemy.forEach(polydnica => {
      const thisPoint = polydnica.unitState.point;
      const enemyPoint = enemy.unitState.point;

      // Skip if enemy point is null
      if (!enemyPoint) return;

      // Calculate vector from Polydnica to enemy
      const vector = {
        x: enemyPoint.x - thisPoint.x,
        y: enemyPoint.y - thisPoint.y,
        z: enemyPoint.z - thisPoint.z
      };

      // Calculate point across from enemy (opposite to Polydnica)
      const acrossPolydnicaPoint = createPoint(
        enemyPoint.x + vector.x,
        enemyPoint.y + vector.y,
        enemyPoint.z + vector.z
      );

      // Find another Polydnica unit at the opposite point
      const acrossPolydnica = getInGameUnits(G, unit =>
        thisUnit.unitState.playerId === unit.unitState.playerId
      ).find(unit =>
        isSame(acrossPolydnicaPoint)(unit.unitState.point) &&
        unit.name === polydnica.name &&
        unit.abilities.onMove.some(skill => skill.name === UnitSkills.Surround3)
      );

      // If there's a Polydnica at the opposite point, handle the surrounding effect
      if (acrossPolydnica) {
        // Log the surrounding effect
        G.serverMsgLog.push({
          id: generateRandomId(),
          turn: ctx.turn,
          player: +ctx.currentPlayer,
          phase: ctx.phase,
          text: i18n.t('log.skills.surrounding', {unitName: logUnitName(enemy.name)}),
        });

        // Handle enemy death
        handleUnitDeath({G, ctx, events}, enemy, thisUnit);

        // Remove enemy from fight queue if present
        const enemyQueueIndex = G.fightQueue.findIndex(unitInQ => unitInQ.unitId === enemy.id);
        if (enemyQueueIndex !== -1) {
          G.fightQueue.splice(enemyQueueIndex, 1);
        }
      }
    });
  });
}

/**
 * Handle the Mara aura ability which reduces enemy initiative
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 */
const handleMaraAura = ({G, ctx, events}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId);
  if (!thisUnit) return;

  // Get all enemy units
  const enemyUnits = getInGameUnits(G, unit => unit.unitState.playerId !== thisUnit.unitState.playerId);

  // Process each enemy unit
  enemyUnits.forEach(enemy => {
    // Find Mara units near this enemy
    const nearMaras = getNearestEnemies(G, enemy.unitState)
      .filter(unit => unit.name === USteppe.maraName);

    const auraKeyword = UnitStatus.InitiativeDownAura;
    const enemyStatus = getStatus(enemy, auraKeyword);

    // Calculate initiative adjustment value
    let value = 0;

    // Remove existing aura effect
    if (enemyStatus) {
      value -= enemyStatus.qty;
    }

    // Add new aura effect based on nearby Maras
    if (nearMaras.length > 0) {
      // Higher level Maras provide stronger aura
      value += nearMaras.reduce((val, mara) =>
        val + (mara.level > 1 ? 3 : 2), 0);
    }

    // Apply initiative adjustment if non-zero
    if (value !== 0) {
      resolveUnitsInteraction({G, ctx, events}, {
        currentUnit: thisUnit,
        enemy: enemy,
        updates: {
          initiative: value,
          status: [{name: auraKeyword, qty: value}]
        }
      });
    }
  });
}

/**
 * Handle the Low Heals aura ability which reduces enemy health
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 */
const handleLowHealsAura = ({G, ctx, events}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId);
  if (!thisUnit) return;

  // Get all enemy units
  const enemyUnits = getInGameUnits(G, unit => unit.unitState.playerId !== thisUnit.unitState.playerId);

  // Process each enemy unit
  enemyUnits.forEach(enemy => {
    // Find units with LowHealsAura near this enemy
    const nearLowHealsAuras = getNearestEnemies(G, enemy.unitState)
      .filter(unit => unit.abilities.onMove.some(skill => skill.name === UnitSkills.LowHealsAura));

    const auraKeyword = UnitStatus.HealsDownAura;
    const enemyStatus = getStatus(enemy, auraKeyword);

    // Calculate health adjustment value
    let value = 0;

    // Remove existing aura effect
    if (enemyStatus) {
      value -= enemyStatus.qty;
    }

    // Add new aura effect based on nearby units with LowHealsAura
    if (nearLowHealsAuras.length > 0) {
      // Each unit with LowHealsAura reduces health by 1
      value += nearLowHealsAuras.length;
    }

    // Apply health adjustment if negative or if positive and enemy has more than 1 health
    if (value < 0 || (value > 0 && enemy.heals > 1)) {
      resolveUnitsInteraction({G, ctx, events}, {
        currentUnit: thisUnit,
        enemy: enemy,
        updates: {
          damage: value,
          damageType: DamageType.ReplaceHeals,
          status: [{name: auraKeyword, qty: value}]
        }
      });
    }
  });
}

/**
 * Handle the Obajifos aura ability which increases ally initiative
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 */
const handleObajifoAura = ({G, ctx, events}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId);
  if (!thisUnit) return;

  // Get all allied units
  const alliedUnits = getInGameUnits(G, unit => unit.unitState.playerId === thisUnit.unitState.playerId);

  // Process each allied unit
  alliedUnits.forEach(ally => {
    // Find units with ObajifoAura near this ally
    const nearObajifos = getNearestAllies(G, ally.unitState)
      .filter(unit => unit.abilities.onMove.some(skill => skill.name === UnitSkills.ObajifoAura));

    const auraKeyword = UnitStatus.InitiativeUpAura;
    const allyStatus = getStatus(ally, auraKeyword);

    // Calculate initiative adjustment value
    let value = 0;

    // Remove existing aura effect
    if (allyStatus) {
      value -= allyStatus.qty;
    }

    // Add new aura effect based on nearby Obajifos
    if (nearObajifos.length > 0) {
      // Each Obajifos increases initiative by 1
      value += nearObajifos.length;
    }

    // Apply initiative adjustment if non-zero
    if (value !== 0) {
      resolveUnitsInteraction({G, ctx, events}, {
        currentUnit: thisUnit,
        enemy: ally,
        updates: {
          initiative: -value, // Negative because we're increasing initiative
          status: [{name: auraKeyword, qty: value}]
        }
      });
    }
  });
}

/**
 * Handle the Hala aura ability which grants RaidBlock to nearby allies
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 */
const handleHalaAura = ({G, ctx, events}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId);
  if (!thisUnit) return;

  // Get all allied units
  const alliedUnits = getInGameUnits(G, unit => unit.unitState.playerId === thisUnit.unitState.playerId);

  // Process each allied unit
  alliedUnits.forEach(ally => {
    // Find units with HalaAura near this ally
    const nearHalas = getNearestAllies(G, ally.unitState)
      .filter(unit => unit.abilities.onMove.some(skill => skill.name === UnitSkills.HalaAura));

    // Check if ally already has RaidBlock ability
    const allyAbility = ally.abilities.statUpdates.defence.find(skill => skill.name === UnitSkills.RaidBlock);

    // Add RaidBlock ability if near Halas and ally doesn't have it yet
    if (nearHalas.length > 0 && !allyAbility) {
      // Add RaidBlock ability with origin=false to indicate it's from an aura
      ally.abilities.statUpdates.defence.push({name: UnitSkills.RaidBlock, origin: false});

      // Log the addition of RaidBlock
      G.serverMsgLog.push({
        id: generateRandomId(),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: i18n.t('log.skills.raidBlock_up', {
          unitName: logUnitName(ally.name),
          skill: logUnitSkill('raidBlock').name
        }),
      });
    }

    // Remove RaidBlock ability if not near Halas anymore and it was added by aura
    if (nearHalas.length === 0 && allyAbility && allyAbility.origin === false) {
      // Filter out the RaidBlock ability
      ally.abilities.statUpdates.defence = ally.abilities.statUpdates.defence
        .filter(skill => skill.name !== UnitSkills.RaidBlock);

      // Log the removal of RaidBlock
      G.serverMsgLog.push({
        id: generateRandomId(),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: i18n.t('log.skills.raidBlock_down', {
          unitName: logUnitName(ally.name),
          skill: logUnitSkill('raidBlock').name
        })
      });
    }
  });
}

/**
 * Handle the Unfocused aura ability which applies Unfocused status to nearby enemies
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 */
const handleUnfocusedAura = ({G, ctx, events}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId);
  if (!thisUnit) return;

  // Get all enemy units
  const enemyUnits = getInGameUnits(G, unit => unit.unitState.playerId !== thisUnit.unitState.playerId);

  // Process each enemy unit
  enemyUnits.forEach(enemy => {
    // Find units with UnfocusedAura near this enemy
    const nearUnfocusedAuras = getNearestEnemies(G, enemy.unitState)
      .filter(unit => unit.abilities.onMove.some(skill => skill.name === UnitSkills.UnfocusedAura));

    const auraKeyword = UnitStatus.Unfocused;
    const enemyStatus = getStatus(enemy, auraKeyword);

    // Special value for aura-based Unfocused status (> 10000)
    const AURA_STATUS_VALUE = 10100;

    // Apply Unfocused status if near auras and not already affected
    if (nearUnfocusedAuras.length > 0 && !enemyStatus) {
      resolveUnitsInteraction({G, ctx, events}, {
        currentUnit: thisUnit,
        enemy: enemy,
        updates: {
          status: [{name: auraKeyword, qty: AURA_STATUS_VALUE}]
        }
      });
    }

    // Remove Unfocused status if not near auras anymore and it was applied by aura
    if (nearUnfocusedAuras.length === 0 && enemyStatus && enemyStatus.qty > 10000) {
      resolveUnitsInteraction({G, ctx, events}, {
        currentUnit: thisUnit,
        enemy: enemy,
        updates: {
          status: [{name: auraKeyword, qty: -AURA_STATUS_VALUE}]
        }
      });
    }
  });
}

/////////////////////////////////////////////////////

/**
 * Handle the Wholeness ability which prevents stats from going below base values
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleWholenessOnDefence = ({G, ctx}, {unitId, updates}) => {
  const thisUnit = getUnitById(G, unitId);
  if (!thisUnit || !updates) return updates;

  // Handle power updates
  if (updates.power !== undefined) {
    // Calculate how much power can be reduced without going below base stats
    const potentialNewPower = thisUnit.power - updates.power;
    const baseStatsPower = thisUnit.unitState.baseStats.power;

    // If potential new power would be below base stats, limit the reduction
    if (potentialNewPower < baseStatsPower) {
      updates.power = thisUnit.power - baseStatsPower;

      // If power reduction is completely prevented and there's a status update
      if (updates.status && updates.power === 0) {
        const decreasingStatusPower = updates.status.find(status => status.name === UnitStatus.PowerDown);

        // Remove the power down status if it exists
        if (decreasingStatusPower) {
          decreasingStatusPower.qty = -1;

          // Log the wholeness effect
          G.serverMsgLog.push({
            id: generateRandomId(),
            turn: ctx.turn,
            player: +ctx.currentPlayer,
            phase: ctx.phase,
            text: i18n.t('log.skills.wholeness_on_power', {
              unitName: logUnitName(thisUnit.name),
              skill: logUnitSkill('wholeness').name
            }),
          });
        }
      }
    }
  }

  // Handle initiative updates
  if (updates.initiative !== undefined) {
    // Calculate how much initiative can be reduced without going below base stats
    const potentialNewInitiative = thisUnit.initiative - updates.initiative;
    const baseStatsInitiative = thisUnit.unitState.baseStats.initiative;

    // If potential new initiative would be below base stats, limit the reduction
    if (potentialNewInitiative < baseStatsInitiative) {
      updates.initiative = thisUnit.initiative - baseStatsInitiative;

      // If initiative reduction is completely prevented and there's a status update
      if (updates.status && updates.initiative === 0) {
        const decreasingStatusInit = updates.status.find(status =>
          status.name === UnitStatus.InitiativeDown ||
          status.name === UnitStatus.InitiativeDownAura
        );

        // Remove the initiative down status if it exists
        if (decreasingStatusInit) {
          decreasingStatusInit.qty = -1;

          // Log the wholeness effect
          G.serverMsgLog.push({
            id: generateRandomId(),
            turn: ctx.turn,
            player: +ctx.currentPlayer,
            phase: ctx.phase,
            text: i18n.t('log.skills.wholeness_on_ini', {
              unitName: logUnitName(thisUnit.name),
              skill: logUnitSkill('wholeness').name
            }),
          });
        }
      }
    }
  }

  return updates;
}

/**
 * Handle the BlockStatuses ability which prevents negative statuses
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleBlockStatusesOnDefence = ({G, ctx}, {unitId, updates}) => {
  const thisUnit = getUnitById(G, unitId);
  if (!thisUnit || !updates || !updates.status) return updates;

  // Create a copy of the status updates to avoid modifying while iterating
  const statusesToProcess = [...updates.status];

  // Process each status update
  statusesToProcess.forEach(status => {
    // Check if this is a negative status being applied (not removed)
    const isNegativeStatus = NegativeStatues.includes(status.name);
    const isBeingApplied = status.qty > 0;

    if (isNegativeStatus && isBeingApplied) {
      // Log the status block
      G.serverMsgLog.push({
        id: generateRandomId(),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: i18n.t('log.skills.status_block', {
          unitName: logUnitName(thisUnit.name),
          status: logUnitStatus(status.name).name
        }),
      });

      // Remove this status from updates
      updates.status = updates.status.filter(us => us.name !== status.name);

      // Also block related stat changes
      if (status.name === UnitStatus.PowerDown && updates.power && updates.power > 0) {
        updates.power = 0;
      }

      if ((status.name === UnitStatus.InitiativeDown ||
           status.name === UnitStatus.InitiativeDownAura) &&
          updates.initiative && updates.initiative > 0) {
        updates.initiative = 0;
      }

      if ((status.name === UnitStatus.HealsDownAura ||
           status.name === UnitStatus.Fired) &&
          updates.damage && updates.damage > 0) {
        updates.damage = 0;
      }
    }
  });

  return updates;
}

/**
 * Handle the RaidBlock ability which blocks raid damage
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleRaidBlockOnDefence = ({G, ctx}, {unitId, updates}) => {
  // Only apply if the damage type is Raid
  if (!updates || updates.damageType !== DamageType.Raid) {
    return updates;
  }

  const thisUnit = getUnitById(G, unitId);
  if (!thisUnit) return updates;

  // Block all damage and status effects
  updates.damage = 0;
  if (updates.status) updates.status = [];

  // Log the raid block
  G.serverMsgLog.push({
    id: generateRandomId(),
    turn: ctx.turn,
    player: +ctx.currentPlayer,
    phase: ctx.phase,
    text: i18n.t('log.skills.block_dmg', {
      unitName: logUnitName(thisUnit.name),
      skill: logUnitSkill('raidBlock').name
    }),
  });

  return updates;
}

/**
 * Handle the AntiVestnick ability which reduces damage from Vestnick units
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {string} param1.enemyId - Enemy unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleAntiVestnickOnDefence = ({G, ctx}, {unitId, enemyId, updates}) => {
  if (!updates || !enemyId) return updates;

  const enemy = getUnitById(G, enemyId);
  if (!enemy) return updates;

  // Check if enemy is a Vestnick and damage type is valid
  const isVestnick = enemy.type === UnitTypes.Vestnick;
  const isValidDamageType = DamageTypes.includes(updates.damageType);

  if (isVestnick && isValidDamageType) {
    const thisUnit = getUnitById(G, unitId);
    if (!thisUnit) return updates;

    // Reduce damage by 1, but not below 0
    updates.damage = Math.max(updates.damage - 1, 0);

    // Log the damage reduction
    G.serverMsgLog.push({
      id: generateRandomId(),
      turn: ctx.turn,
      player: +ctx.currentPlayer,
      phase: ctx.phase,
      text: i18n.t('log.skills.block_reduce', {
        unitName: logUnitName(thisUnit.name),
        skill: logUnitSkill('antiVestnick').name
      }),
    });
  }

  return updates;
}

/**
 * Handle the ReduceDamage ability which reduces incoming damage by 1
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleReduceDamageOnDefence = ({G, ctx}, {unitId, updates}) => {
  // Only reduce damage if it's greater than 1
  if (!updates || !updates.damage || updates.damage <= 1) {
    return updates;
  }

  const thisUnit = getUnitById(G, unitId);
  if (!thisUnit) return updates;

  // Reduce damage by 1
  updates.damage = updates.damage - 1;

  // Log the damage reduction
  G.serverMsgLog.push({
    id: generateRandomId(),
    turn: ctx.turn,
    player: +ctx.currentPlayer,
    phase: ctx.phase,
    text: i18n.t('log.skills.block_reduce', {
      unitName: logUnitName(thisUnit.name),
      skill: logUnitSkill('reduceDamage').name
    }),
  });

  return updates;
}

/**
 * Handle the DeadlyDamage ability which deals massive damage when unit is injured
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {string} param1.enemyId - Enemy unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleDeadlyDamageOnDefence = ({G, ctx}, {unitId, enemyId, updates}) => {
  if (!updates) return updates;

  // Check if damage type is valid (not Raid but in DamageTypes)
  const isNotRaid = updates.damageType !== DamageType.Raid;
  const isValidDamageType = DamageTypes.includes(updates.damageType);

  if (isNotRaid && isValidDamageType) {
    const thisUnit = getUnitById(G, unitId);
    if (!thisUnit) return updates;

    // Check if unit is injured (current health less than base health)
    const isInjured = thisUnit.unitState.baseStats.heals > thisUnit.heals;

    if (isInjured) {
      // Set damage to a very high value (effectively deadly)
      updates.damage = 99;

      // Log the deadly damage effect
      G.serverMsgLog.push({
        id: generateRandomId(),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: i18n.t('log.skills.deadly_dmg', {
          unitName: logUnitName(thisUnit.name),
          skill: logUnitSkill('deadlyDamage').name
        }),
      });
    }
  }

  return updates;
}

/**
 * Handle the DoubleDamage ability which doubles damage when enemy has more health
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {string} param1.enemyId - Enemy unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleDoubleDamageOnDefence = ({G, ctx}, {unitId, enemyId, updates}) => {
  if (isValidDamageType(updates.damageType)) {
    const thisUnit = getUnitById(G, unitId);
    const enemy = getUnitById(G, enemyId);
    if (enemy.heals > thisUnit.heals) {
      updates.damage = updates.damage * 2;

      G.serverMsgLog.push(
        createLogMessage(G, ctx, 'log.skills.double_dmg_low_hp', {
          unitName: logUnitName(thisUnit.name),
          enemy: logUnitName(enemy.name)
        })
      );
    }
  }

  return updates;
}

/**
 * Handle the DoubleDamageInDefence ability which doubles damage when enemy initiated combat
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {string} param1.enemyId - Enemy unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleDoubleDamageInDefenceOnDefence = ({G, ctx}, {unitId, enemyId, updates}) => {
  if (isValidDamageType(updates.damageType)) {
    const thisUnit = getUnitById(G, unitId);
    const enemy = getUnitById(G, enemyId);
    if (enemy.type !== UnitTypes.Idol && enemy.unitState.initiatorFor.find(id => thisUnit.id === id)) {
      updates.damage = updates.damage * 2;

      G.serverMsgLog.push(
        createLogMessage(G, ctx, 'log.skills.double_dmg', {
          unitName: logUnitName(thisUnit.name),
          enemy: logUnitName(enemy.name)
        })
      );
    }
  }

  return updates;
}

/**
 * Handle the ReturnDamage ability which returns a portion of received damage
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {string} param1.enemyId - Enemy unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleReturnDamageOnDefence = ({G, ctx, events}, {unitId, enemyId, updates}) => {
  if (isValidDamageType(updates.damageType)) {
    const thisUnit = getUnitById(G, unitId);
    const dmg = Math.trunc(updates.damage / 2);

    if (dmg > 0) {
      const enemy = getUnitById(G, enemyId);

      G.serverMsgLog.push(
        createLogMessage(G, ctx, 'log.skills.skill_dmg', {
          unitName: logUnitName(thisUnit.name),
          skill: logUnitSkill('returnDamage').name
        })
      );

      resolveUnitsInteraction({G, ctx, events}, {
        currentUnit: thisUnit,
        enemy: enemy,
        updates: {
          damage: dmg,
          damageType: DamageType.Counter,
        }
      });
    }
  }

  return updates;
}

/**
 * Handle the BlockDamage ability which blocks damage from specific directions
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {string} param1.enemyId - Enemy unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleBlockDamageOnDefence = ({G, ctx}, {unitId, enemyId, updates}) => {
  if (updates.damageType !== DamageType.Chained && isValidDamageType(updates.damageType)) {
    const thisUnit = getUnitById(G, unitId);
    const enemy = getUnitById(G, enemyId);
    const skill = thisUnit.abilities.statUpdates.defence.find(skill => skill.name === UnitSkills.BlockDamage);

    if (skill.point) {
      const newPoint = calculateNewPoint(thisUnit.unitState.point, skill.point);
      const newPoint2 = calculateNewPoint(newPoint, skill.point);

      if (isSame(enemy.unitState.point)(newPoint) || isSame(enemy.unitState.point)(newPoint2)) {
        updates.damage = 0;

        G.serverMsgLog.push(
          createLogMessage(G, ctx, 'log.skills.block_side', {
            unitName: logUnitName(thisUnit.name),
            enemy: logUnitName(enemy.name)
          })
        );
      }
    }
  }

  return updates;
}

/**
 * Handle the InjuredDamage ability which reduces power when unit is injured
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleInjuredDamageOnDefence = ({G, ctx, events}, {unitId, updates}) => {
  const thisUnit = getUnitById(G, unitId);
  if (updates.damage && (thisUnit.heals - updates.damage) < thisUnit.unitState.baseStats.heals) {
    // Remove the InjuredDamage ability after it's triggered
    thisUnit.abilities.statUpdates.defence = thisUnit.abilities.statUpdates.defence
      .filter(skill => skill.name !== UnitSkills.InjuredDamage);

    // Apply power reduction
    resolveUnitsInteraction({G, ctx, events}, {
      currentUnit: thisUnit,
      enemy: thisUnit,
      updates: {
        power: -1
      }
    });

    // Log the power reduction
    G.serverMsgLog.push(
      createLogMessage(G, ctx, 'log.skills.injured_power', {
        unitName: logUnitName(thisUnit.name),
        skill: logUnitSkill('injuredDamage').name
      })
    );
  }

  return updates;
}

/**
 * Handle the AddFreezeEffect ability which applies Freeze status on attack
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleFreezeEffectOnAttack = ({G}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Default || updates.damageType === DamageType.Chained) {
    addStatusEffect(updates, UnitStatus.Freeze, 1);
  }
  return updates;
}

/**
 * Handle the AddUnfocusedEffect ability which applies Unfocused status on attack
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleUnfocusedEffectOnAttack = ({G}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Default || updates.damageType === DamageType.Chained) {
    addStatusEffect(updates, UnitStatus.Unfocused, 99);
  }
  return updates;
}

/**
 * Handle the AddPoisonEffect ability which applies Poison status on attack
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handlePoisonEffectOnAttack = ({G}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Default || updates.damageType === DamageType.Chained) {
    addStatusEffect(updates, UnitStatus.Poison, 99);
  }
  return updates;
}

/**
 * Handle the AddPoisonEffectOnRaid ability which applies Poison status on raid
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleAddPoisonEffectOnRaidOnAttack = ({G}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Raid) {
    addStatusEffect(updates, UnitStatus.Poison, 99);
  }
  return updates;
}

/**
 * Handle the AddVengeanceEffect ability which applies Vengeance status on attack
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {string} param1.enemyId - Enemy unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleVengeanceEffectOnAttack = ({G, ctx, events}, {unitId, enemyId, updates}) => {
  if (updates.damageType === DamageType.Default || updates.damageType === DamageType.Chained || updates.damageType === DamageType.Raid) {
    // Add Vengeance status to the enemy with a reference to this unit
    addStatusEffect(updates, UnitStatus.Vengeance, 99, { enemyId: unitId });

    // Mark this unit as a vengeance target
    const thisUnit = getUnitById(G, unitId);
    resolveUnitsInteraction({G, ctx, events}, {
      currentUnit: thisUnit,
      enemy: thisUnit,
      updates: {
        status: [{name: UnitStatus.VengeanceTarget, qty: 99}]
      }
    });
  }
  return updates;
}

/**
 * Handle the AddStunEffect ability which applies Stun status on attack
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {string} param1.enemyId - Enemy unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleAddStunEffectOnAttack = ({G, ctx, events}, {unitId, enemyId, updates}) => {
  if (updates.damageType === DamageType.Default || updates.damageType === DamageType.Chained) {
    addStatusEffect(updates, UnitStatus.Stun, 1);
  }
  return updates;
}

/**
 * Handle the DecreaseInitiative ability which reduces enemy initiative on attack
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleDecreaseInitiativeOnAttack = ({G, ctx}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Default || updates.damageType === DamageType.Chained || updates.damageType === DamageType.Raid) {
    updates.initiative = 1;
    G.serverMsgLog.push(
      createLogMessage(G, ctx, 'log.skills.addition')
    );
  }
  return updates;
}
/**
 * Handle the RemoveChargeAttack ability which removes charge and increases power
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleRemoveChargeAttackOnAttack = ({G, ctx, events}, {unitId, updates}) => {
  const thisUnit = getUnitById(G, unitId);
  if (isValidDamageType(updates.damageType) && hasStatus(thisUnit, UnitStatus.PowerUpCharge)) {
    // Remove charge and increase power
    resolveUnitsInteraction({G, ctx, events}, {
      currentUnit: thisUnit,
      enemy: thisUnit,
      updates: {
        power: 2,
        status: [{name: UnitStatus.PowerUpCharge, qty: -1}]
      }
    });

    // Remove the ability after it's used
    thisUnit.abilities.statUpdates.attack = thisUnit.abilities.statUpdates.attack
      .filter(skill => skill.name !== UnitSkills.RemoveChargeAttack);
  }
  return updates;
}

/**
 * Handle the RoundDamage ability which damages nearby enemies
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {string} param1.enemyId - Enemy unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleRoundDamageOnAttack = ({G, ctx, events}, {unitId, enemyId, updates}) => {
  if (updates.damageType === DamageType.Default) {
    const thisUnit = getUnitById(G, unitId);
    const enemy = getUnitById(G, enemyId);

    // Find enemies that are near both the target enemy and this unit
    const getNearEnemiesToBoth = getNearestUnits(G, enemy.unitState)
      .filter(ally => ally.unitState.playerId !== thisUnit.unitState.playerId)
      .filter(ally => getNearestEnemies(G, ally.unitState).find(u => u.id === unitId));

    if (getNearEnemiesToBoth.length > 0) {
      getNearEnemiesToBoth.forEach(enemyAlly => {
        // Log the round damage
        G.serverMsgLog.push(
          createLogMessage(G, ctx, 'log.skills.round_dmg', {
            unitName: logUnitName(thisUnit.name),
            enemy: logUnitName(enemyAlly.name)
          })
        );

        // Apply damage to the nearby enemy
        resolveUnitsInteraction({G, ctx, events}, {
          currentUnit: thisUnit,
          enemy: enemyAlly,
          updates: {
            damage: hasKeyword(thisUnit, UnitKeywords.RestrictedRoundDamage) ? 1 : updates.damage,
            damageType: DamageType.Chained,
          }
        });

        // Handle enemy death if needed
        if(enemyAlly.heals <= 0) {
          handleUnitDeath({G, ctx, events}, enemyAlly, thisUnit);
          removeFromFightQueue(G, enemyAlly.id);
        }
      });
    }
  }
  return updates;
}

/**
 * Handle the ThroughDamage ability which damages enemies in a line
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {string} param1.enemyId - Enemy unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleThroughDamageOnAttack = ({G, ctx, events}, {unitId, enemyId, updates}) => {
  if (updates.damageType === DamageType.Default || updates.damageType === DamageType.Counter) {
    const thisUnit = getUnitById(G, unitId);
    const enemy = getUnitById(G, enemyId);

    // Calculate the vector from this unit to the enemy
    const thisPoint = thisUnit.unitState.point;
    const enemyPoint = enemy.unitState.point;
    const vector = {
      x: enemyPoint.x - thisPoint.x,
      y: enemyPoint.y - thisPoint.y,
      z: enemyPoint.z - thisPoint.z
    };

    // Calculate the point beyond the enemy in the same direction
    const newEnemyPoint = calculateNewPoint(enemyPoint, vector);

    // Find if there's an enemy at the new point
    const newEnemy = getInGameUnits(G, unit => thisUnit.unitState.playerId !== unit.unitState.playerId)
      .find(unit => isSame(newEnemyPoint)(unit.unitState.point));

    if (newEnemy) {
      // Check if the new enemy has BlockDamage ability
      const skill = newEnemy.abilities.statUpdates.defence.find(skill => skill.name === UnitSkills.BlockDamage);
      if (skill && skill.point) {
        // Calculate the block point
        const newEnemyBlockPoint = calculateNewPoint(newEnemy.unitState.point, skill.point);

        // If the block point is the same as the original enemy's point, the damage is blocked
        if (isSame(enemy.unitState.point)(newEnemyBlockPoint)) {
          G.serverMsgLog.push(
            createLogMessage(G, ctx, 'log.skills.block_piercing', {
              enemy: logUnitName(newEnemy.name)
            })
          );
        }
      } else {
        // Log the piercing damage
        G.serverMsgLog.push(
          createLogMessage(G, ctx, 'log.skills.piercing', {
            enemy: logUnitName(newEnemy.name)
          })
        );

        // Apply damage to the new enemy
        resolveUnitsInteraction({G, ctx, events}, {
          currentUnit: thisUnit,
          enemy: newEnemy,
          updates: {
            damage: updates.damage,
            damageType: DamageType.Chained,
          }
        });

        // Handle enemy death if needed
        if(newEnemy.heals <= 0) {
          handleUnitDeath({G, ctx, events}, newEnemy, thisUnit);
          removeFromFightQueue(G, newEnemy.id);
        }
      }
    }
  }
  return updates;
}

/**
 * Handle the HealOnAttack ability which heals the unit when attacking
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleHealOnAttack = ({G, ctx, events}, {unitId, updates}) => {
  if (updates.damageType === DamageType.Default) {
    const thisUnit = getUnitById(G, unitId);

    // Calculate how much healing is needed (up to max health)
    const healValue = Math.max(thisUnit.unitState.baseStats.heals - thisUnit.heals, 0);

    // Apply healing (negative damage)
    resolveUnitsInteraction({G, ctx, events}, {
      currentUnit: thisUnit,
      enemy: thisUnit,
      updates: {
        damage: -(healValue > 1 ? 1 : healValue), // Heal 1 or the exact amount needed if less
        damageType: DamageType.Heal,
      }
    });
  }
  return updates;
}

/**
 * Handle the ChainDamage ability which damages chains of connected enemies
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {string} param1.enemyId - Enemy unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleChainDamageOnAttack = ({G, ctx, events}, {unitId, enemyId, updates}) => {
  // Only apply if this is a default attack and the unit hasn't moved
  if (updates.damageType === DamageType.Default) {
    const thisUnit = getUnitById(G, unitId);
    if (!thisUnit.unitState.isMovedLastPhase) {
      const enemy = getUnitById(G, enemyId);
      const excludePlayerId = thisUnit.unitState.playerId;

      // Use a breadth-first search approach to find connected enemies
      const impactedUnits = new Set(); // Use a Set for O(1) lookups
      const queue = [enemy]; // Start with the initial enemy

      while (queue.length > 0) {
        const currentEnemy = queue.shift();

        // Get all nearby enemies that haven't been processed yet
        const nearbyEnemies = getNearestUnits(G, currentEnemy.unitState)
          .filter(unit =>
            unit.unitState.playerId !== excludePlayerId && // Not an ally
            unit.id !== enemyId && // Not the original target
            !impactedUnits.has(unit.id) // Not already processed
          );

        // Add these enemies to the impacted list and queue
        nearbyEnemies.forEach(newEnemy => {
          impactedUnits.add(newEnemy.id);
          queue.push(newEnemy);
        });
      }

      // Process all impacted units
      impactedUnits.forEach(id => {
        const currentEnemy = getUnitById(G, id);

        // Log the chain damage
        G.serverMsgLog.push(
          createLogMessage(G, ctx, 'log.skills.chained', {
            enemy: logUnitName(currentEnemy.name)
          })
        );

        // Apply damage to the chained enemy
        resolveUnitsInteraction({G, ctx, events}, {
          currentUnit: thisUnit,
          enemy: currentEnemy,
          updates: {
            damage: 1,
            damageType: DamageType.Chained,
          }
        });

        // Handle enemy death if needed
        if(currentEnemy.heals <= 0) {
          handleUnitDeath({G, ctx, events}, currentEnemy, thisUnit);
          removeFromFightQueue(G, currentEnemy.id);
        }
      });
    }
  }
  return updates;
}

/**
 * Helper function to end a unit's turn and log a no-raid message
 * @param {Object} G - Game state
 * @param {Object} ctx - Game context
 * @param {Object} events - Game events
 * @param {Object} unit - The unit whose turn is ending
 */
const endRaidTurn = (G, ctx, events, unit) => {
  G.availablePoints = [];
  G.currentUnit = null;
  unit.unitState.isClickable = false;
  events.endTurn();
  G.serverMsgLog.push(
    createLogMessage(G, ctx, 'log.skills.no_raid', {
      unitName: logUnitName(unit.name)
    })
  );
};

/**
 * Handle the Raid ability which allows units to attack distant enemies
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 */
const handleRaid = ({G, events, ctx}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId);

  // Check if raid is blocked by nearby enemies or unit is unarmed
  if ((getNearestEnemies(G, thisUnit.unitState).length > 0 && !hasKeyword(thisUnit, UnitKeywords.AbsoluteRaid)) ||
      hasStatus(thisUnit, UnitStatus.Unarmed)) {
    endRaidTurn(G, ctx, events, thisUnit);
    return;
  }

  // Determine raid targets based on unit keywords
  let raidEnemies;
  if (hasKeyword(thisUnit, UnitKeywords.AbsoluteRaid)) {
    // Can raid regardless of obstacles
    raidEnemies = getNearestEnemies2(G, thisUnit.unitState);
  } else if (hasKeyword(thisUnit, UnitKeywords.RestrictedRaid)) {
    // Can only raid if not near too many allies
    raidEnemies = getNearestAllies(G, thisUnit.unitState).length >= 2
      ? []
      : getRaidEnemies(G, thisUnit.unitState);
  } else if (hasKeyword(thisUnit, UnitKeywords.NoObstaclesRaid)) {
    // Can raid through obstacles if no direct enemies
    raidEnemies = getNearestEnemies(G, thisUnit.unitState).length > 0
      ? []
      : getNearestEnemies2(G, thisUnit.unitState);
  } else {
    // Standard raid
    raidEnemies = getRaidEnemies(G, thisUnit.unitState);
  }

  // Check for main target enemies
  const mainTargetEnemies = raidEnemies.filter(
    enemy => enemy.abilities.keywords.find(keyword => keyword === UnitKeywords.MainTarget) !== undefined
  );

  if (mainTargetEnemies.length > 0) {
    raidEnemies = mainTargetEnemies;
    G.serverMsgLog.push(
      createLogMessage(G, ctx, 'log.main_target', {
        unitName: (mainTargetEnemies.length > 1
          ? i18n.t('log.several_creatures')
          : logUnitName(mainTargetEnemies[0].name)),
        keyword: logUnitKeyword('mainTarget').name
      })
    );
  }

  // Check for vengeance status
  const vengeanceStatus = getStatus(thisUnit, UnitStatus.Vengeance);
  if (hasStatus(thisUnit, UnitStatus.Vengeance)) {
    const vengeanceTarget = getInGameUnits(G).find(
      unit => hasStatus(unit, UnitStatus.VengeanceTarget) && vengeanceStatus.enemyId === unit.id
    );

    if (vengeanceTarget) {
      if (raidEnemies.find(enemy => enemy.id === vengeanceTarget.id)) {
        // Target is in raid range, focus only on it
        raidEnemies = [vengeanceTarget];
        G.serverMsgLog.push(
          createLogMessage(G, ctx, 'log.vengeance', {
            unitName: logUnitName(vengeanceTarget.name),
            status: logUnitStatus('vengeance').name
          })
        );
      } else {
        // Target is not in raid range
        raidEnemies = [];
        G.serverMsgLog.push(
          createLogMessage(G, ctx, 'log.vengeance_error', {
            unitName: logUnitName(vengeanceTarget.name),
            status: logUnitStatus('vengeance').name
          })
        );
      }
    }
  }

  // If no raid targets, end turn
  if (raidEnemies.length === 0) {
    endRaidTurn(G, ctx, events, thisUnit);
  } else {
    // Set available points for raid and activate raid action
    G.availablePoints = raidEnemies.map(u => u.unitState.point);
    events.setActivePlayers({ currentPlayer: 'doRaid' });
  }
}

/**
 * Handle the LethalGrab ability which increases stats when killing certain unit types
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param1 - Event data
 * @param {string} param1.killerId - ID of the unit that made the kill
 * @param {Object} param1.target - The unit that was killed
 * @param {Object} param1.thisUnit - The unit with the ability
 */
const handleLethalGrab = ({G, ctx}, {killerId, target, thisUnit}) => {
  // Only apply if this unit is the killer
  if (thisUnit.id !== killerId) return;

  // Determine stat increases based on target type
  const bonusAmount = thisUnit.level > 2 ? 2 : 1;

  if (target.type === UnitTypes.Idol) {
    // Idols give bonuses to all stats
    thisUnit.power += bonusAmount;
    thisUnit.heals += bonusAmount;
    thisUnit.initiative += bonusAmount;
  } else if (target.type === UnitTypes.Prispeshnick) {
    // Prispeshnicks give health bonus
    thisUnit.heals += bonusAmount;
  } else if (target.type === UnitTypes.Prominkor) {
    // Prominkors give power bonus
    thisUnit.power += bonusAmount;
  } else if (target.type === UnitTypes.Vestnick) {
    // Vestnicks give initiative bonus
    thisUnit.initiative += bonusAmount;
  }

  // Log the stat increase
  G.serverMsgLog.push(
    createLogMessage(G, ctx, 'log.skills.stats_up', {
      unitName: logUnitName(thisUnit.name)
    })
  );
}

/**
 * Handle the LethalBlow ability which disarms nearby enemies when unit dies
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {Object} param1.thisUnit - The unit with the ability
 * @param {Object} param1.target - The unit that died
 */
const handleLethalBlow = ({G, ctx, events}, {thisUnit, target}) => {
  // Only apply if this unit is the one that died
  if (thisUnit.id !== target.id) return;

  // Find nearby enemies
  const nearEnemies = getNearestEnemies(G, thisUnit.unitState);

  if (nearEnemies.length > 0) {
    // Log the fear effect
    G.serverMsgLog.push(
      createLogMessage(G, ctx, 'log.skills.fear', {
        unitName: logUnitName(thisUnit.name)
      })
    );

    // Apply Unarmed status to all nearby enemies
    nearEnemies.forEach(enemy => {
      resolveUnitsInteraction({G, ctx, events}, {
        currentUnit: thisUnit,
        enemy: enemy,
        updates: {
          status: [{name: UnitStatus.Unarmed, qty: 1}]
        }
      });
    });
  }
}

/**
 * Handle the Urka ability which allows units to push enemies and move forward
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 */
const handleUrka = ({G, events, ctx}, {unitId}) => {
  const thisUnit = getUnitById(G, unitId);
  const newPoint = thisUnit.unitState.point;
  const oldPoint = G.currentUnit.unitState.point;

  // Calculate the movement vector
  const vector = {
    x: newPoint.x - oldPoint.x,
    y: newPoint.y - oldPoint.y,
    z: newPoint.z - oldPoint.z
  };

  // Calculate the point beyond the new position in the same direction
  const availablePoint = calculateNewPoint(newPoint, vector);

  // Check if the point beyond is empty
  if (getInGameUnits(G, unit => isSame(unit.unitState.point)(availablePoint)).length === 0) {
    G.availablePoints = [availablePoint];
  } else {
    G.availablePoints = [];
  }

  // Set the current unit and activate the Urka action
  G.currentUnit = thisUnit;
  events.setActivePlayers({ currentPlayer: 'showUrkaAction' });
}

/**
 * Handle the InstantKill ability which can instantly kill enemies when an ally is nearby
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {string} param1.enemyId - Enemy unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
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

/**
 * Handle the InstantKillOnCounter ability which instantly kills enemies on counter-attack
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {string} param1.enemyId - Enemy unit ID
 * @param {Object} param1.updates - Updates to apply
 * @returns {Object} Modified updates
 */
const handleInstantKillOnCounterOnAttack = ({G, ctx, events}, {unitId, enemyId, updates}) => {
  if (updates.damageType === DamageType.Counter) {
    const thisUnit = getUnitById(G, unitId)
    const enemy = getUnitById(G, enemyId)
    if (enemy.type !== UnitTypes.Idol) {
      updates.damage = 99;
      G.serverMsgLog.push(
        createLogMessage(G, ctx, 'log.skills.deadly', {
          unitName: logUnitName(thisUnit.name)
        })
      )
    }
    return updates
  } else return {}
}

/**
 * Handle the Lesavka ability which allows units to pull enemies to adjacent positions
 * @param {Object} param0 - Game data
 * @param {Object} param0.G - Game state
 * @param {Object} param0.ctx - Game context
 * @param {Object} param0.events - Game events
 * @param {Object} param1 - Event data
 * @param {string} param1.unitId - Unit ID
 * @param {string} param1.enemyId - Enemy unit ID
 */
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
    thisUnit.unitState.isAttackedThisPhase = true
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
    thisUnit.unitState.isAttackedThisPhase = true
    G.currentUnit = null
    onEndFightTurn(G, ctx)
  }
}

const handleUtilizeDeath = ({G, ctx, events}, {thisUnit, target}) => {
  if (getNeighbors2(thisUnit.unitState.point).find(isSame(target.unitState.point))) {
    const action = thisUnit.abilities.allTimeActions.find(action => action.name === UnitSkills.AbasuCurse)
    if (action) {
      action.qty++

      G.serverMsgLog.push({
        id: Math.random().toString(10).slice(2),
        turn: ctx.turn,
        player: +ctx.currentPlayer,
        phase: ctx.phase,
        text: i18n.t('log.skills.add_charge', {unitName: logUnitName(thisUnit.name), skill: logUnitSkill('abasuCurse').name}),
      })
    }
  }
}
