import React, {Component} from "react";
import TemplatePage from "./TemplatePage";
import "./styles/joinPage.css";

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
            Приєднатися до гри за допомогою коду:
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
                value="Пуск"
                className="game-code-submit"
              />
            </form>
          </>
        }
      />
    );
  }
}

export default JoinPage;
