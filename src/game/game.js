import {moves} from './state/moves';
import {setup} from './state/setup';
import {postProcess, setGridSize} from './state/postProcess';
import {getInGameUnits, skipPositioningTurn} from "./utils";

export const Overcoming = {
  setup: setup,
  moves,
  phases: {
    Setup: {
      moves: {
        selectNewUnit: moves.selectNewUnit,
        selectOldUnit: moves.selectOldUnit,
        moveUnit: moves.moveUnit,
        complete: moves.complete
      },
      endIf: ({ G }) => (G.setupComplete === G.players.length),
      // onBegin: ({ G }) => { G.availablePoints = []; return G },
      // next: 'moveUnit',
      start: true,
      next: "Positioning"
    },

    Positioning: {
      onBegin: ({ G }) => { setGridSize(G); return G },
      endIf: ({ G }) => (getInGameUnits(G, (unit) => unit.unitState.isClickable).length === 0),
      next: "Fight",
      turn: {
        onBegin: ({ G, ctx, events }) => { skipPositioningTurn(G, ctx, events); return G},
        activePlayers: {
          currentPlayer: { stage: 'pickUnitOnBoard' }
        },
        maxMoves: 2,
        order: {
          first: ({ G, ctx }) => G.moveOrder % G.players.filter(p => p.isInGame).length,
          next: ({ G, ctx }) => (ctx.playOrderPos + 1) % G.players.filter(p => p.isInGame).length,
          playOrder: ({ G, ctx }) => G.players.filter(p => p.isInGame).map(p => p.id)
        },
        onMove: ({ G, events }) => postProcess(G, events),
        stages: {
          pickUnitOnBoard: {
            moves: {
              selectUnitOnBoard: moves.selectUnitOnBoard
            },
            next: 'placeUnitOnBoard'
          },
          placeUnitOnBoard: {
            moves: {
              moveUnitOnBoard: moves.moveUnitOnBoard
            },
            next: 'pickUnitOnBoard'
          }
        }
      }
    },

    Fight: {
      next: "Positioning",
      onBegin: ({ G }) => { getInGameUnits(G).forEach(unit => unit.unitState.isClickable = true); return G },
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
          finish: moves.finish
        },
        next: 'placeUnit'
      },
      placeUnit: {
        moves: {
          moveUnit: moves.moveUnit,
          complete: moves.complete,
          finish: moves.finish
        },
        next: 'pickUnit'
      }
    },
    onMove: ({ G, events }) => postProcess(G, events)
  },
  endIf: ({ G }) => (G.gameover !== null ? G.gameover : undefined),
};
