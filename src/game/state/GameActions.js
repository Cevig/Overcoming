import {getInGameUnits, getUnitById} from "../helpers/Utils";
import {handleAbility} from "./UnitSkills";

/**
 * Handles actions that should be triggered when units move
 * @param {Object} data - Game data containing state, context, and events
 * @returns {void}
 */
export const handleOnMoveActions = (data) => {
  const {G} = data;

  // Use a Set to track applied skills more efficiently
  const appliedSkills = new Set();

  try {
    // Get all units with onMove abilities
    const unitsWithMoveAbilities = getInGameUnits(G, unit => unit.abilities.onMove.length !== 0);

    // Process each unit's abilities
    for (const unit of unitsWithMoveAbilities) {
      for (const skill of unit.abilities.onMove) {
        // Create a unique key for this player+skill combination
        const skillKey = `${unit.id}-${skill.name}`;

        // Only apply the skill if it hasn't been applied yet
        if (!appliedSkills.has(skillKey)) {
          handleAbility(data, skill.name, {unitId: unit.id});
          appliedSkills.add(skillKey);
        }
      }
    }
  } catch (error) {
    console.error("Error in handleOnMoveActions:", error);
    // Optionally add error handling logic here
  }
}

/**
 * Generic function to handle unit stat updates
 * @param {Object} data - Game data containing state, context, and events
 * @param {Object} eventData - Event data including unitId and updates
 * @param {string} updateType - Type of update ('attack' or 'defence')
 * @returns {Object} Updated stats
 */
const handleUnitStatsUpdate = (data, eventData, updateType) => {
  const {G} = data;
  const {unitId, updates = {}} = eventData;
  const result = [];

  try {
    const unit = getUnitById(G, unitId);

    // Check if unit exists and has abilities of the specified type
    if (unit && unit.abilities.statUpdates[updateType] && unit.abilities.statUpdates[updateType].length !== 0) {
      // Apply each ability and collect results
      for (const skill of unit.abilities.statUpdates[updateType]) {
        const abilityResult = handleAbility(data, skill.name, eventData);
        if (abilityResult) {
          result.push(abilityResult);
        }
      }
    }

    // Merge all results with the original updates
    return Object.assign({}, updates, ...result);
  } catch (error) {
    console.error(`Error in handleUnitStatsUpdate (${updateType}):`, error);
    return updates; // Return original updates in case of error
  }
}

/**
 * Handles unit stat updates during defence
 * @param {Object} data - Game data containing state, context, and events
 * @param {Object} eventData - Event data including unitId and updates
 * @returns {Object} Updated stats for defence
 */
export const handleUnitStatsUpdateInDefence = (data, eventData) => {
  return handleUnitStatsUpdate(data, eventData, 'defence');
}

/**
 * Handles unit stat updates during attack
 * @param {Object} data - Game data containing state, context, and events
 * @param {Object} eventData - Event data including unitId and updates
 * @returns {Object} Updated stats for attack
 */
export const handleUnitStatsUpdateInAttack = (data, eventData) => {
  return handleUnitStatsUpdate(data, eventData, 'attack');
}
