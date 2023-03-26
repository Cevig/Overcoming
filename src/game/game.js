import {moves} from './state/moves';
import {setup} from './state/setup';
import {postProcess} from './state/postProcess';

export const Overcoming = {
  setup: setup,
  moves,
  phases: {
    Setup: {
      moves: {
        selectNew: moves.selectNew,
        selectOld: moves.selectOld,
        selectNewUnit: moves.selectNewUnit,
        selectOldUnit: moves.selectOldUnit,
        moveUnit: moves.moveUnit,
        complete: moves.complete
      },
      endIf: ({ G }) => (G.setupComplete === G.players.length),
      // onBegin: ({ G }) => { G.availablePoints = []; return G },
      // next: 'moveUnit',
      start: true
    }
  },
  turn: {
    // order: TurnOrder.RESET,
    minMoves: 2,
    activePlayers: {
      currentPlayer: { stage: 'pickUnit' }
    },
    // endIf: ({ G, ctx }) => (G.moveCount > ctx.turn),

    stages: {
      pickUnit: {
        moves: {
          selectNewUnit: moves.selectNewUnit,
          selectOldUnit: moves.selectOldUnit,
          complete: moves.complete,
        },
        next: 'placeUnit'
      },
      placeUnit: {
        moves: {
          moveUnit: moves.moveUnit,
          complete: moves.complete
        },
        next: 'pickUnit'
      }
    },
    onMove: ({ G, events }) => postProcess(G, events)
  },
  endIf: ({ G }) => (G.gameover !== null ? G.gameover : undefined),
};
