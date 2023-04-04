import React from "react";
import {Route, Switch, useHistory} from "react-router";
import Lobby from "./pages/Lobby";
import {Client} from "boardgame.io/react";
import {APP_PRODUCTION, GAME_SERVER_URL} from "./config";
import {Overcoming} from "./game/Game";
import {Board} from "./game/ui/Board";
import {SocketIO} from "boardgame.io/multiplayer";
import HomePage from "./pages/HomePage";
import JoinPage from "./pages/JoinPage";
import {isMobile} from "react-device-detect";
import MobileCover from "./pages/MobileCover";
import {Debug} from "boardgame.io/debug";
import {getPlayersNumber} from "./game/helpers/Utils";
import SelectPlayersNumberPage from "./pages/SelectPlayersNumberPage";

function App() {
  const history = useHistory();
  const server = APP_PRODUCTION
    ? `https://${window.location.hostname}`
    : GAME_SERVER_URL;
  const OverClient = Client({
    game: Overcoming,
    board: Board,
    multiplayer: SocketIO({ server: server }),
    numPlayers: getPlayersNumber(),
    debug: { impl: Debug }
  });
  const renderOverClient = () => {
    return <OverClient playerID="0"></OverClient>;
  };
  if (isMobile && APP_PRODUCTION) {
    return <MobileCover />;
  }
  return (
    <Switch>
      <Route
        path="/home"
        exact
        render={(props) => <HomePage {...props} history={history} />}
      />
      <Route
        path="/new"
        exact
        render={(props) => <SelectPlayersNumberPage {...props} history={history} />}
      />
      <Route
        path="/join"
        exact
        render={(props) => <JoinPage {...props} history={history} />}
      />
      <Route path="/play" exact render={(props) => renderOverClient()} />
      <Route path="/lobby/:id" component={Lobby} />
      <Route
        path="*"
        render={(props) => <HomePage {...props} history={history} />}
      />
    </Switch>
  );
}

const AppLocal =
  // Client({
  //   game: Overcoming,
  //   board: Board,
  //   // multiplayer: Local(),
  //   numPlayers: getPlayersNumber(),
  //   debug: true
  // });
0

export default AppLocal ? AppLocal : App;
