import React, {Component} from "react";
import "./styles/homePage.css";
import TemplatePage from "./TemplatePage";
import {withTranslation} from "react-i18next";
import {logGameUi} from "../game/helpers/Utils";

const info_texts = () => {
  return {
    start: logGameUi('new_game'),
    join: logGameUi('invite_code')
  }
};
class HomePage extends Component {
  state = {
    text: "",
    loading: false,
    redirect: null,
  };
  hoverIn = (src) => {
    let infoText = "";
    if (Object.keys(info_texts()).includes(src)) {
      infoText = info_texts()[src];
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
  render() {
    const history = this.props.history;
    return (
      <TemplatePage
        content={
          <>
            <div className="menu-cards">
              <div
                className="card start"
                onMouseEnter={() => this.hoverIn("start")}
                onMouseLeave={() => this.hoverOut()}
                onClick={() => { history.push("/new") }}
              >
                <div className="card-inside">
                  <h1>{logGameUi('new_game')}</h1>
                </div>
              </div>
              <div
                className="card join"
                onMouseEnter={() => this.hoverIn("join")}
                onMouseLeave={() => this.hoverOut()}
                onClick={() => { history.push("/join"); }}
              >
                <div className="card-inside">
                  <h1>{logGameUi('go_to')}</h1>
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

export default withTranslation()(HomePage);
