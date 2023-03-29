import {getInGameUnits, getNeighbors, isNotSame} from '../utils';
import {startPositions} from "./setup";

const flat = array => array.reduce((prev, curr) => prev.concat(curr), []);

export const moves = {
  // selectNew: (G, ctx, currentInsect) => {
  //   let availablePoints = [];
  //   if (G.insects.length === 0) { // first insect first player
  //     availablePoints = [createPoint(0, 0, 0)];
  //   } else if (G.insects.length === 1) { // first insect second player
  //     availablePoints = getNeighbors({ x: 0, y: 0, z: 0 });
  //   } else if (G.insects.length > 1) {
  //     // neighbors of own insects - neighbors of opponent's insects - insects
  //     const possiblePoints = flat(G.insects.filter(({ player }) => player === ctx.currentPlayer).map(({ point }) => getNeighbors(point)));
  //     const excludedPoints = [
  //       ...flat(G.insects.filter(({ player }) => player !== ctx.currentPlayer).map(({ point }) => getNeighbors(point))),
  //       ...G.insects.map(i => i.point),
  //     ]
  //     availablePoints = possiblePoints.filter(possible => excludedPoints.every(excluded => excluded.coord !== possible.coord));
  //   }
  //   return {
  //     ...G,
  //     currentInsect,
  //     availablePoints,
  //   };
  // },
  selectNewUnit: ({G, ctx}, currentUnit) => {
    if (G.players[ctx.currentPlayer].units.filter(unit => unit.unitState.isInGame === false).length > 0) {
      G.availablePoints = startPositions[ctx.currentPlayer]
      G.currentUnit = currentUnit
    }
  },
  selectOldUnit: ({ G }, currentUnit) => {
    G.availablePoints = getNeighbors(currentUnit.unitState.point)
    G.currentUnit = currentUnit
  },

  selectUnitOnBoard: ({ G, ctx }, currentUnit) => {
    G.availablePoints = getNeighbors(currentUnit.unitState.point)
      .filter(point =>
        getInGameUnits(G).every(unit => isNotSame(unit.unitState.point)(point))
      )

    G.currentUnit = currentUnit
  },

  moveUnit: ({G, ctx}, point) => {
    const unit = G.players[ctx.currentPlayer].units.filter(unit => unit.id === G.currentUnit.id)[0]
    unit.unitState.point = point
    unit.unitState.isInGame = true
    G.currentUnit = null
    G.availablePoints = []
  },

  moveUnitOnBoard: ({G, ctx}, point) => {
    const unit = G.players[ctx.currentPlayer].units.filter(unit => unit.id === G.currentUnit.id)[0]
    unit.unitState.point = point
    unit.unitState.isInGame = true
    unit.unitState.isClickable = false
    G.currentUnit = null
    G.availablePoints = []
  },

  complete: ({G, events}) => {
    G.setupComplete++
    events.endTurn()
  },

  finish: ({G, events}) => {
    G.moveOrder++
    events.endPhase()
  },
};
