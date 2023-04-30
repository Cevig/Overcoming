import React, {Component} from "react";
import "./styles/homePage.css";
import TemplatePage from "./TemplatePage";

const info_texts = {
  start: "Почати нову гру",
  join: "Приєднатися використовуючи код запрошення",
};
class HomePage extends Component {
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
                  <h1>нова гра</h1>
                </div>
              </div>
              <div
                className="card join"
                onMouseEnter={() => this.hoverIn("join")}
                onMouseLeave={() => this.hoverOut()}
                onClick={() => { history.push("/join"); }}
              >
                <div className="card-inside">
                  <h1>зайти до</h1>
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

export default HomePage;
