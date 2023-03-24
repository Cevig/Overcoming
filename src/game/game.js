import { Game } from 'boardgame.io/core';
import { moves } from './state/moves';
import { setup } from './state/setup';
import { postProcess } from './state/postProcess';

export const game = Game({
  name: 'Overcoming',
  setup,
  moves,
  flow: {
    phases: [
      {
        name: 'selectInsect',
        allowedMoves: ['selectNew', 'selectOld', 'selectNewUnit'],
        endPhaseIf: G => G.currentUnit !== null,
      },
      {
        name: 'moveInsect',
        allowedMoves: ['moveInsect', 'cancel'],
        endPhaseIf: G => G.currentUnit === null,
      },
    ],
    endTurnIf: (G, ctx) => G.moveCount > ctx.turn,
    endGameIf: (G, ctx) => G.gameover !== null ? G.gameover : undefined,
    onMove: (G, ctx) => postProcess(G),
  },
});
