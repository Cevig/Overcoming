import {moves} from './state/Moves';
import {setup} from './state/Setup';
import {
  cleanFightPhase,
  endFightPhase,
  endPositioningPhase,
  handleGameOver,
  handleSortieRewards,
  nextPhaseCondition,
  onBuildingBegin,
  onEndPositioningTurn,
  onGameOver,
  onPositioningStart,
  onSetupBegin,
  postProcess,
  setFightOrder,
  setInFightUnits
} from './state/PostProcess';
import {
  cleanRound,
  endFightTurnCondition,
  onEndFightTurnAfter,
  skipTurnIfNotActive
} from "./helpers/Utils";
import {GAME_NAME} from "../config";
import {TurnOrder} from "boardgame.io/core";

export const Overcoming = {
  name: GAME_NAME,
  setup: setup,
  moves,
  phases: {
    Building: {
      onBegin: ({ G, ctx, events }) => { onBuildingBegin(G, ctx, events) },
      turn: {
        activePlayers: {
          all: { stage: 'purchase' }
        },
        stages: {
          purchase: {
            moves: {
              buyHouse: { move: moves.buyHouseMove, noLimit: true },
              sellHouse: { move: moves.sellHouseMove, noLimit: true },
              summonUnit: { move: moves.summonUnit, noLimit: true },
              sellUnit: { move: moves.sellUnitMove, noLimit: true },
              complete: { move: moves.completeBuilding, noLimit: true },
              sacrificeHeals: { move: moves.sacrificeHeals, noLimit: true },
              surrender: moves.leaveGame,
            }
          },

          finishBuildingStage: {
            moves: {
              returnBack: { move: moves.returnToPurchase, noLimit: true }
            }
          }
        }
      },
      endIf: ({ G }) => (G.buildingComplete === G.players.filter(p => p.isPlayerInGame).length),
      start: true,
      next: "Setup"
    },
    Setup: {
      onBegin: ({ G, ctx, events }) => { onSetupBegin(G, ctx, events) },
      turn: {
        activePlayers: {
          all: { stage: 'pickUnit' }
        },
        stages: {
          pickUnit: {
            moves: {
              selectNewUnit: moves.selectNewUnit,
              selectOldUnit: moves.selectOldUnit,
              complete: { move: moves.complete, noLimit: true },
              surrender: moves.leaveGame,
            },
            next: 'placeUnit'
          },
          placeUnit: {
            moves: {
              moveUnit: moves.moveUnit,
              removeUnit: moves.removeUnit,
              unitToSortie: moves.unitToSortie,
              complete: { move: moves.complete, noLimit: true }
            },
            next: 'pickUnit'
          },

          chooseBlockSideActionStage: {
            moves: {
              setBlockSide: moves.doSetBlockSide
            }
          },

          finishSetupStage: {
            moves: {
              returnBack: { move: moves.returnToSetup, noLimit: true }
            }
          }
        },
        onMove: (data) => postProcess(data)
      },
      endIf: ({ G }) => (G.setupComplete === G.players.filter(p => p.isPlayerInGame).length),
      next: "Positioning"
    },
    Positioning: {
      onBegin: ({ G, ctx, events }) => { onPositioningStart(G, ctx, events) },
      next: ({G}) => (nextPhaseCondition(G)),
      endIf: ({ G }) => (endPositioningPhase(G)),
      onEnd: ({ G, ctx, events }) => { setInFightUnits(G, ctx, events) },
      turn: {
        onBegin: ({ G, ctx, events }) => { skipTurnIfNotActive(G, ctx, events) },
        activePlayers: {
          currentPlayer: { stage: 'pickUnitOnBoard' }
        },
        order: {
          first: ({ G, ctx }) => G.moveOrder % G.players.filter(p => p.isPlayerInBattle).length,
          next: ({ G, ctx }) => (ctx.playOrderPos + 1) % G.players.filter(p => p.isPlayerInBattle).length,
          playOrder: ({ G, ctx }) => G.players.filter(p => p.isPlayerInBattle).map(p => p.id)
        },
        onMove: (data) => postProcess(data),
        onEnd: ({ G, ctx }) => { onEndPositioningTurn(G, ctx) },
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
              skipTurn: moves.skipTurn,
              healAllyAction: moves.healAllyActionMove,
              curseAction: moves.curseActionMove,
              throwWeaponAction: moves.throwWeaponActionMove,
              replaceUnitsAction: moves.replaceUnitsActionMove,
              pauseToRecoverAction: moves.pauseToRecoverActionMove,
              notMovedRecoverAction: moves.notMovedRecoverActionMove,
              chargeAttackAction: moves.chargeAttackActionMove,
              setElokoCurseAction: moves.setElokoCurseActionMove,
              setItOnFireAction: moves.setItOnFireActionMove,
            },
            next: 'pickUnitOnBoard'
          },
          doRaid: {
            moves: {
              attackTarget: moves.raidAttack,
              skipTurn: moves.skipRaidTurn,
              replaceHeals: moves.replaceHeals,
            }
          },

          showUrkaAction: {
            moves: {
              doActionToEnemy: moves.doActionToEnemy,
              skipTurn: moves.skipUrkaAction,
              moveAgain: moves.moveAgain,
            },
            next: 'selectEnemyByUrka'
          },
          selectEnemyByUrka: {
            moves: {
              selectEnemy: moves.selectEnemy
            },
            next: 'placeEnemyByUrka'
          },
          placeEnemyByUrka: {
            moves: {
              moveEnemy: moves.moveEnemy
            },
          },

          healAllyActionStage: {
            moves: {
              healAlly: moves.doHealAlly
            }
          },

          curseAbasyActionStage: {
            moves: {
              curseOrRecover: moves.curseOrRecover,
              backFromAction: moves.backFromAction
            }
          },

          throwWeaponActionStage: {
            moves: {
              throwWeapon: moves.doThrowWeapon
            }
          },

          replaceUnitsActionStage: {
            moves: {
              replaceUnitsFirst: moves.doReplaceUnitsActionFirst,
              replaceUnits: moves.doReplaceUnitsAction
            }
          },

          setElokoCurseActionStage: {
            moves: {
              setElokoCurse: moves.doSetElokoCurse
            }
          },

          setItOnFireActionStage: {
            moves: {
              setItOnFire: moves.doSetItOnFire
            }
          },
        }
      }
    },
    Fight: {
      onBegin: ({ G, events, ctx }) => { setFightOrder(G, events, ctx) },
      next: "Positioning",
      endIf: ({ G, ctx }) => (endFightPhase(G, ctx)),
      onEnd: ({ G, ctx, events }) => { cleanFightPhase(G, ctx, events) },
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
        onEnd: ({ G, ctx }) => { onEndFightTurnAfter(G, ctx) },
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
              skipTurn: moves.skipFightTurn,
              healAllyAction: moves.healAllyActionMove,
              curseAction: moves.curseActionMove,
              replaceUnitsAction: moves.replaceUnitsActionMove,
              pauseToRecoverAction: moves.pauseToRecoverActionMove,
              setItOnFireAction: moves.setItOnFireActionMove,
            },
            next: 'pickUnitForAttack'
          },

          hookUnitAction: {
            moves: {
              hookUnit: moves.hookUnit,
              skipHook: moves.skipHook
            }
          },

          throwOverAction: {
            moves: {
              throwOver: moves.throwOverActionMove,
              skipHook: moves.skipHook
            }
          },

          healAllyActionStage: {
            moves: {
              healAlly: moves.doHealAlly
            }
          },

          curseAbasyActionStage: {
            moves: {
              curseOrRecover: moves.curseOrRecover,
              backFromAction: moves.backFromAction
            }
          },

          replaceUnitsActionStage: {
            moves: {
              replaceUnitsFirst: moves.doReplaceUnitsActionFirst,
              replaceUnits: moves.doReplaceUnitsAction
            }
          },

          setItOnFireActionStage: {
            moves: {
              setItOnFire: moves.doSetItOnFire
            }
          },
        }
      }
    },
    FinishBattle: {
      onBegin: ({ G, events, ctx }) => { handleSortieRewards(G, events, ctx) },
      turn: {
        activePlayers: {
          all: { stage: 'resultsStage' }
        },
        order: TurnOrder.RESET,
        stages: {
          resultsStage: {
            moves: {
              nextRound: { move: moves.nextRoundMove, noLimit: true },
              damagePlayer: { move: moves.damagePlayerMove, noLimit: true }
            }
          },

          finishBattleResultStage: {
            moves: {}
          }
        }
      },
      endIf: ({ G }) => (G.battleResultComplete === G.players.filter(p => p.isPlayerInGame).length),
      next: "Building",
      onEnd: ({ G, ctx, events }) => { cleanRound(G, ctx, events) }
    }
  },
  endIf: ({ G, ctx }) => (handleGameOver(G, ctx)),
  onEnd: ({ G, ctx }) => { onGameOver(G, ctx) }
};
