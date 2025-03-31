import React, {Component} from "react";
import TemplatePage from "./TemplatePage";
import "./styles/joinPage.css";
import {logGameUi} from "../game/helpers/Utils";
import {withTranslation} from "react-i18next";

class JoinPage extends Component {
  state = { id: "0000" };
  handleSubmit = () => {
    //Route to page
    const history = this.props.history;
    history.push("/lobby/" + this.state.id);
  };
  handleChange = (event) => {
    this.setState({
      id: event.target.value,
    });
  };
  render() {
    return (
      <TemplatePage
        content={
          <>
          {logGameUi('join_via_code')}:
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                className="game-code-tb"
                value={this.state.id}
                onChange={this.handleChange}
              />
              <br />
              <input
                type="submit"
                value={logGameUi('lets_go')}
                className="game-code-submit"
              />
            </form>
          </>
        }
      />
    );
  }
}

export default withTranslation()(JoinPage);
