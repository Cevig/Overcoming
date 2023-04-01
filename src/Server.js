const { Overcoming } = require("./game/Game");
const Server = require('boardgame.io/server').Server;

const port = 8000;

const server = Server({
  games: [Overcoming]
});

server.run(port, () => console.log('Server running on port: ' + port));
