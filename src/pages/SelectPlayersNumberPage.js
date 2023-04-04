import React, {Component} from "react";
import "./styles/homePage.css";
import {LobbyAPI} from "../api";
import TemplatePage from "./TemplatePage";
import {setPlayerNumber} from "../game/helpers/Utils";

const info_texts = {
  start2: "Create a new room for 2 players",
  start3: "Create a new room for 3 players",
  start4: "Create a new room for 4 players",
};
const api = new LobbyAPI();
class SelectPlayersNumberPage extends Component {
  state = {
    text: "",
    loading: false,
    redirect: null,
  };
  hoverIn = (src) => {
    let infoText = "";
    if (Object.keys(info_texts).includes(src)) {
      infoText = info_texts[src];
    } else {
      console.log("Unrecognized key for info_text");
    }
    this.setState({
      text: infoText,
    });
  };
  hoverOut = () => {
    this.setState({
      text: "",
    });
  };
  createGame = (num) => {
    console.log("createGame");
    if (this.state.loading) {
      return;
    } else {
      this.setState({
        loading: true,
      });
    }
    setPlayerNumber(num)
    api.createRoom(num).then(
      (roomID) => {
        const history = this.props.history;
        console.log("Created room with roomID = ", roomID);
        this.setState({ loading: false });
        history.push("/lobby/" + roomID);
      },
      (err) => {
        console.log(err);
        this.setState({ loading: false });
      }
    );
  };
  render() {
    return (
      <TemplatePage
        content={
          <>
            <div className="menu-cards">
              <div
                className="card start"
                onMouseEnter={() => this.hoverIn("start2")}
                onMouseLeave={() => this.hoverOut()}
                onClick={() => this.createGame(2)}
              >
                <div className="card-inside">
                  <h1>2 players</h1>
                </div>
              </div>
              <div
                className="card join"
                onMouseEnter={() => this.hoverIn("start3")}
                onMouseLeave={() => this.hoverOut()}
                onClick={() => this.createGame(3)}
              >
                <div className="card-inside">
                  <h1>3 players</h1>
                </div>
              </div>
              <div
                className="card other"
                onMouseEnter={() => this.hoverIn("start4")}
                onMouseLeave={() => this.hoverOut()}
                onClick={() => this.createGame(4)}
              >
                <div className="card-inside">
                  <h1>4 players</h1>
                </div>
              </div>
            </div>
            <div id="menu-description">{this.state.text}</div>
          </>
        }
      />
    );
  }
}

export default SelectPlayersNumberPage;
