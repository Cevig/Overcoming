import React from 'react';
import {Client} from 'boardgame.io/react';
import {Overcoming} from "./game/game";
import {Board} from "./game/ui/Board";

const App = Client({
  game: Overcoming,
  board: Board,
  // ai,
  // multiplayer: { server: 'localhost:8000' },
  debug: true
});



export default App;
