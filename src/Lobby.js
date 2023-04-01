import {Lobby} from 'boardgame.io/react';
import {Overcoming} from './game/Game';
import {Board} from './game/ui/Board';

<Lobby
  gameServer={`https://${window.location.hostname}:8000`}
  lobbyServer={`https://${window.location.hostname}:8000`}
  gameComponents={[
    { game: Overcoming, board: Board }
  ]}
/>;
