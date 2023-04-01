import {moves} from './state/Moves';
import {setup} from './state/Setup';
import {
  cleanFightPhase,
  endFightPhase,
  handleGameOver,
  onGameOver,
  postProcess,
  setFightOrder,
  setGridSize,
  setInFightUnits
} from './state/PostProcess';
import {
  getInGameUnits,
  getUnitById,
  skipTurnIfNotActive
} from "./helpers/Utils";

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
      start: true,
      next: "Positioning"
    },

    Positioning: {
      onBegin: ({ G }) => { setGridSize(G) },
      next: "Fight",
      endIf: ({ G }) => (getInGameUnits(G, (unit) => unit.unitState.isClickable).length === 0),
      onEnd: ({ G }) => { setInFightUnits(G) },
      turn: {
        onBegin: ({ G, ctx, events }) => { skipTurnIfNotActive(G, ctx, events) },
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
              selectUnitOnBoard: moves.selectUnitOnBoard,
            },
            next: 'placeUnitOnBoard'
          },
          placeUnitOnBoard: {
            moves: {
              moveUnitOnBoard: moves.moveUnitOnBoard,
              skipTurn: moves.skipTurn
            },
            next: 'pickUnitOnBoard'
          }
        }
      }
    },

    Fight: {
      onBegin: ({ G, events }) => { setFightOrder(G, events) },
      next: "Positioning",
      endIf: ({ G }) => (endFightPhase(G)),
      onEnd: ({ G }) => { cleanFightPhase(G) },
      turn: {
        activePlayers: {
          currentPlayer: { stage: 'pickUnitForAttack' }
        },
        maxMoves: 2,
        order: {
          first: ({ G }) => G.fightQueue[0].playerId,
          next: ({ G }) => G.fightQueue[0].playerId
        },
        onMove: ({ G, events }) => postProcess(G, events),
        endIf: ({ G, ctx, events }) => (ctx.numMoves >= 2 ? {next: G.fightQueue.length > 1 ? G.fightQueue[1].playerId : G.fightQueue[0].playerId} : false),
        onEnd: ({ G, ctx, events }) => { if(G.fightQueue.length && getUnitById(G, G.fightQueue[0].unitId).unitState.isClickable === false) G.fightQueue.shift(); return G },
        stages: {
          pickUnitForAttack: {
            moves: {
              selectUnitForAttack: moves.selectUnitForAttack,
            },
            next: 'makeDamage'
          },
          makeDamage: {
            moves: {
              attackTarget: moves.attackTarget,
              skipTurn: moves.skipFightTurn
            },
            next: 'pickUnitForAttack'
          }
        }
      }
    }
  },
  turn: {
    minMoves: 2,
    activePlayers: {
      currentPlayer: { stage: 'pickUnit' }
    },
    stages: {
      pickUnit: {
        moves: {
          selectNewUnit: moves.selectNewUnit,
          selectOldUnit: moves.selectOldUnit,
          complete: moves.complete
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
  endIf: ({ G }) => (handleGameOver(G)),
  onEnd: ({ G }) => { onGameOver(G) }
};
