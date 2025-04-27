import React from "react";
import {Link, useParams} from "react-router-dom";
import {SocketIO} from "boardgame.io/multiplayer";
import {Client} from "boardgame.io/react";

// Styles
import "./styles/lobby.css";

// Components
import {Overcoming} from "../game/Game";
import {Board} from "../game/ui/Board";
import TemplatePage from "./TemplatePage";

// Constants
import {APP_PRODUCTION, GAME_SERVER_URL, WEB_SERVER_URL} from "../config.js";
import {getPlayersNumber, logGameUi} from "../game/helpers/Utils";

// Hooks
import {useLobby} from "../hooks/useLobby";

// Configure the game client
const server = APP_PRODUCTION
  ? `https://${window.location.hostname}`
  : GAME_SERVER_URL;

const GameClient = Client({
  game: Overcoming,
  board: Board,
  multiplayer: SocketIO({
    server: server,
  }),
  debug: false,
});

const Lobby = () => {
  const { id } = useParams();
  const {
    joined,
    myID,
    userAuthToken,
    playerName,
    setPlayerName,
    nameSubmitted,
    setNameSubmitted,
    copied,
    lobbyExists,
    gameLinkBoxRef,
    joinRoom,
    copyToClipboard,
    clearPollInterval
  } = useLobby(id);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      joinRoom(myID, playerName.trim());
    }
  };

  // Player item component
  const PlayerItem = ({ player }) => {
    if (player) {
      if (player.id === myID) {
        return (
          <div>
            <div className="player-item">
              {player.name} - {logGameUi('you')}
              <div className="player-ready"></div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div className="player-item">
              {player.name}
              <div className="player-ready"></div>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div>
          <div className="player-item loading">
            {logGameUi('waiting_players')}
            <div className="player-waiting"></div>
          </div>
        </div>
      );
    }
  };

  // Game exists view
  const GameExistsView = () => {
    const players = [...Array(getPlayersNumber()).keys()];
    const serverUrl = APP_PRODUCTION
      ? `https://${window.location.hostname}`
      : WEB_SERVER_URL;

    return (
      <>
        <div>{logGameUi('invite_friends')}:</div>
        <div className="game-link">
          <div
            className="game-link-box"
            ref={gameLinkBoxRef}
          >
            {`${serverUrl}/lobby/${id}`}
          </div>
          <div className="game-link-button" onClick={copyToClipboard}>
            {copied ? logGameUi('ready') + "!" : " " + logGameUi('copy') + " "}
          </div>
        </div>
        <div>
          {logGameUi('game_code')}
          <br /> <div className="game-code">{id}</div>
        </div>

        {myID !== null && !nameSubmitted && (
          <div className="name-form-container">
            <form onSubmit={handleNameSubmit}>
              <div>{logGameUi('enter_name')}:</div>
              <input
                type="text"
                value={playerName || sessionStorage.getItem(`bgio-userName${myID}`)}
                onChange={(e) => setPlayerName(e.target.value)}
                className="player-name-input"
                placeholder={logGameUi('your_name')}
                autoFocus
              />
              <button type="submit" className="game-link-button">
                {logGameUi('go_to')}
              </button>
            </form>
          </div>
        )}

        <div className="player-list">
          {players.map((p) => {
            const joinedPlayer = joined[p];
            return <PlayerItem key={p} player={joinedPlayer} />;
          })}
        </div>
        <div>
          <br />
          {logGameUi('ready_note')}!
        </div>
      </>
    );
  };

  // Game not found view
  const GameNotFoundView = () => (
    <div style={{ color: "#01b6c6" }}>
      {logGameUi('sorry_no_game')}
      <br />
      <Link to="/">{logGameUi('create_game')}</Link>
    </div>
  );

  // Render game client when all players have joined
  if (joined.length === getPlayersNumber()) {
    clearPollInterval();
    return (
      <GameClient
        matchID={id}
        playerID={String(myID)}
        credentials={userAuthToken}
        matchData={[playerName]}
        debug={false}
      />
    );
  }

  // Render lobby
  return (
    <TemplatePage
      content={
        lobbyExists ? <GameExistsView /> : <GameNotFoundView />
      }
    />
  );
};

export default Lobby;
