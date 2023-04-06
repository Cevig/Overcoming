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
import {GAME_NAME} from "../config";

export const Overcoming = {
  name: GAME_NAME,
  setup: setup,
  moves,
  phases: {
    Setup: {
      turn: {
        activePlayers: {
          currentPlayer: { stage: 'pickUnit' }
        },
        stages: {
          pickUnit: {
            moves: {
              selectNewUnit: moves.selectNewUnit,
              selectOldUnit: moves.selectOldUnit,
              complete: { move: moves.complete, noLimit: true }
            },
            next: 'placeUnit'
          },
          placeUnit: {
            moves: {
              moveUnit: moves.moveUnit,
              removeUnit: moves.removeUnit,
              complete: { move: moves.complete, noLimit: true }
            },
            next: 'pickUnit'
          }
        },
        onMove: (data) => postProcess(data)
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
        order: {
          first: ({ G, ctx }) => G.moveOrder % G.players.filter(p => p.isInGame).length,
          next: ({ G, ctx }) => (ctx.playOrderPos + 1) % G.players.filter(p => p.isInGame).length,
          playOrder: ({ G, ctx }) => G.players.filter(p => p.isInGame).map(p => p.id)
        },
        onMove: (data) => postProcess(data),
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
        order: {
          first: ({ G }) => G.fightQueue[0].playerId,
          next: ({ G }) => G.fightQueue[0].playerId
        },
        onMove: (data) => postProcess(data),
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
  endIf: ({ G }) => (handleGameOver(G)),
  onEnd: ({ G }) => { onGameOver(G) }
};
