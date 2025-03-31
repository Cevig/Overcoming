import React, {Component} from "react";
import {Link} from "react-router-dom";
import {SocketIO} from "boardgame.io/multiplayer";
import {Client} from "boardgame.io/react";

// Styles
import "./styles/lobby.css";

// API Helper
import {LobbyAPI} from "../api";

// Components
import {Overcoming} from "../game/Game";
import {Board} from "../game/ui/Board";
import TemplatePage from "./TemplatePage";

// Constants
import {APP_PRODUCTION, GAME_SERVER_URL, WEB_SERVER_URL} from "../config.js";
import {
  getPlayersNumber,
  logGameUi,
  logPlayerName,
  setPlayerNumber
} from "../game/helpers/Utils";

const api = new LobbyAPI();
const server = APP_PRODUCTION
  ? `https://${window.location.hostname}`
  : GAME_SERVER_URL;
const GameClient = Client({
  game: Overcoming,
  board: Board,
  multiplayer: SocketIO({
    server: server,
  }),
});
class Lobby extends Component {
  state = {};
  constructor(props) {
    super(props);
    console.log("construct");
    this.state.id = props.match.params.id;
    this.state.joined = [];
    this.state.myID = null;
    this.state.userAuthToken = null;
  }
  componentDidMount() {
    this.checkRoomStateAndJoin();
    this.interval = setInterval(this.checkRoomState, 2000);
    window.addEventListener("beforeunload", this.cleanup.bind(this));
  }
  cleanup() {
    console.log("cleaning up");
    api.leaveRoom(this.state.id, this.state.myID, this.state.userAuthToken);
    if(this.interval) clearInterval(this.interval);
  }
  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.cleanup.bind(this));
  }
  joinRoom = (player_no) => {
    const username = logPlayerName(player_no+1);
    if (this.state.id) {
      const metadata = (Math.random() + 1).toString(36).substring(7);
      api.joinRoom(this.state.id, username, player_no, metadata).then(
        (authToken) => {
          sessionStorage.setItem(`metadata-${player_no}`, metadata);
          console.log("Joined room as player ", player_no);
          this.setState({ myID: player_no, userAuthToken: authToken });
          sessionStorage.setItem(`localAuth-${player_no}`, authToken);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };
  checkRoomStateAndJoin = () => {
    console.log("pinging room endpoint to check who is there...");
    if (this.state.id) {
      api.whoIsInRoom(this.state.id).then(
        (players) => {
          const joinedPlayers = players.filter((p) => p.name);
          this.setState({
            joined: joinedPlayers,
          });
          const notOrderedPlayer = [...Array(joinedPlayers.length).keys()].find(i => !joinedPlayers.some(p => p.id === i));

          const metadataConnectionPlayer = players.find(p => [...Array(players.length).keys()].some(id => p.data === sessionStorage.getItem(`metadata-${id}`)))

          if (metadataConnectionPlayer !== undefined) { //) && (metadataConnectionPlayer.isConnected === true)
            api.leaveRoom(this.state.id, metadataConnectionPlayer.id, sessionStorage.getItem(`localAuth-${metadataConnectionPlayer.id}`));
          }
          const myPlayerNum = metadataConnectionPlayer !== undefined ? metadataConnectionPlayer.id : (notOrderedPlayer !== undefined) ? notOrderedPlayer : joinedPlayers.length;
          setPlayerNumber(players.length)
          this.joinRoom(myPlayerNum);
        },
        (error) => {
          console.log("room does not exist");
          this.setState({
            id: null,
          });
        }
      );
    }
  };
  checkRoomState = () => {
    if (this.state.id) {
      api.whoIsInRoom(this.state.id).then(
        (players) => {
          const joinedPlayers = players.filter((p) => p.name);
          this.setState({
            joined: joinedPlayers,
          });
        },
        (error) => {
          console.log("room does not exist");
          this.setState({
            id: null,
          });
        }
      );
    }
  };
  getPlayerItem = (player) => {
    if (player) {
      if (player.id === this.state.myID) {
        return (
          <div>
            <div className="player-item">
              {logPlayerName(player.id+1)} - {logGameUi('you')}
              <div className="player-ready"></div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div className="player-item">
              {logPlayerName(player.id+1)}
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
  copyToClipboard = () => {
    var textField = document.createElement("textarea");
    textField.innerText = this.gameLinkBox.innerText;
    textField.style.opacity = "0";
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    this.setState({ copied: true });
    setTimeout(
      function () {
        this.setState({ copied: false });
      }.bind(this),
      2000
    );
  };
  gameExistsView = () => {
    const players = [...Array(getPlayersNumber()).keys()];
    const server = APP_PRODUCTION
      ? `https://${window.location.hostname}`
      : WEB_SERVER_URL;
    return (
      <>
        <div>{logGameUi('invite_friends')}:</div>
        <div className="game-link">
          <div
            className="game-link-box"
            ref={(gameLinkBox) => (this.gameLinkBox = gameLinkBox)}
          >
            {`${server}/lobby/${this.state.id}`}
          </div>
          <div className="game-link-button" onClick={this.copyToClipboard}>
            {this.state.copied ? logGameUi('ready')+"!" : " "+logGameUi('copy')+" "}
          </div>
        </div>
        <div>
          {logGameUi('game_code')}
          <br /> <div className="game-code">{this.state.id}</div>
        </div>
        <div className="player-list">
          {players.map((p) => {
            const joinedPlayer = this.state.joined[p];
            return this.getPlayerItem(joinedPlayer);
          })}
        </div>
        <div>
          <br />
          {logGameUi('ready_note')}!
        </div>
      </>
    );
  };
  gameNotFoundView = () => {
    return (
      <>
        <div>
          {logGameUi('sorry_no_game')}
          <br />
          <Link to="/">{logGameUi('create_game')}</Link>
        </div>
      </>
    );
  };
  getGameClient = () => {
    return (
      <GameClient
        matchID={this.state.id}
        playerID={String(this.state.myID)}
        credentials={this.state.userAuthToken}
      ></GameClient>
    );
  };
  render() {
    if (this.state.joined.length === getPlayersNumber()) {
      if(this.interval) clearInterval(this.interval);
      return this.getGameClient();
    }
    return (
      <TemplatePage
        content={
          this.state.id ? this.gameExistsView() : this.gameNotFoundView()
        }
      />
    );
  }
}

export default Lobby;
