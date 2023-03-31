import React from 'react';
import {Client} from 'boardgame.io/react';
import {Overcoming} from "./game/game";
import {Board} from "./game/ui/Board";

const App = Client({
  game: Overcoming,
  board: Board,
  // multiplayer: Local(),
  numPlayers: 2,
  debug: false
});
export default App;
