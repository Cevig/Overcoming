const { Overcoming } = require("./game/Game");
const Server = require('boardgame.io/server').Server;
import {GAME_SERVER_PORT} from "./config";

const server = Server({
  games: [Overcoming],
  // origins: [Origins.LOCALHOST],
});

server.run(GAME_SERVER_PORT, () => console.log('Server running on port: ' + GAME_SERVER_PORT));
