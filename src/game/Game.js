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
  endFightTurnCondition,
  getInGameUnits,
  onEndFightTurn,
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
              complete: { move: moves.complete, noLimit: true },
              summonUnit: { move: moves.summonUnit, noLimit: true }
            },
            next: 'placeUnit'
          },
          placeUnit: {
            moves: {
              moveUnit: moves.moveUnit,
              removeUnit: moves.removeUnit,
              complete: { move: moves.complete, noLimit: true },
              summonUnit: { move: moves.summonUnit, noLimit: true }
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
      onBegin: ({ G, ctx }) => { setGridSize(G, ctx) },
      next: "Fight",
      endIf: ({ G }) => (getInGameUnits(G, (unit) => unit.unitState.isClickable).length === 0),
      onEnd: ({ G, ctx }) => { setInFightUnits(G, ctx) },
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
          },
          doRaid: {
            moves: {
              attackTarget: moves.raidAttack,
              skipTurn: moves.skipRaidTurn
            }
          }
        }
      }
    },

    Fight: {
      onBegin: ({ G, events, ctx }) => { setFightOrder(G, events, ctx) },
      next: "Positioning",
      endIf: ({ G, ctx }) => (endFightPhase(G, ctx)),
      onEnd: ({ G, ctx }) => { cleanFightPhase(G, ctx) },
      turn: {
        activePlayers: {
          currentPlayer: { stage: 'pickUnitForAttack' }
        },
        order: {
          first: ({ G }) => G.fightQueue[0].playerId,
          next: ({ G }) => G.fightQueue[0].playerId
        },
        onMove: (data) => postProcess(data),
        endIf: ({ G, ctx }) => (endFightTurnCondition(G, ctx)),
        onEnd: ({ G, ctx }) => { onEndFightTurn(G, ctx) },
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
  endIf: ({ G, ctx }) => (handleGameOver(G, ctx)),
  onEnd: ({ G, ctx }) => { onGameOver(G, ctx) }
};
