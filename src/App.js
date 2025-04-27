import React, {Fragment} from "react";
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
import {getPlayersNumber} from "./game/helpers/Utils";
import SelectPlayersNumberPage from "./pages/SelectPlayersNumberPage";
import ImagePreloader from "./game/helpers/ImagePreloader";

function App() {
  const history = useHistory();
  const server = APP_PRODUCTION
    ? `https://${window.location.hostname}`
    : GAME_SERVER_URL;
  const OverClient = Client({
    game: Overcoming,
    board: Board,
    multiplayer: SocketIO({ server: server }),
    numPlayers: getPlayersNumber()
  });
  const renderOverClient = (props) => {
    return <OverClient {...props} playerID="0"></OverClient>;
  };
  if (isMobile && APP_PRODUCTION) {
    return <MobileCover />;
  }
  return (
    <Fragment>
      <ImagePreloader />
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
        <Route path="/play" exact render={(props) => renderOverClient(props)} />
        <Route path="/lobby/:id" component={Lobby} />
        <Route
          path="*"
          render={(props) => <HomePage {...props} history={history} />}
        />
      </Switch>
    </Fragment>
  );
}

const AppLocal =
  Client({
    game: Overcoming,
    board: Board,
    // multiplayer: Local(),
    numPlayers: 2,
    debug: true
  });
const useLocal = false;

export default useLocal ? AppLocal : App;
