import React, {useState} from "react";
import TemplatePage from "./TemplatePage";
import "./styles/joinPage.css";
import {logGameUi} from "../game/helpers/Utils";
import {useHistory} from "react-router-dom";

const JoinPage = () => {
  const [gameId, setGameId] = useState("0000");
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/lobby/${gameId}`);
  };

  const handleChange = (event) => {
    setGameId(event.target.value);
  };

  return (
    <TemplatePage
      content={
        <>
          {logGameUi('join_via_code')}:
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="game-code-tb"
              value={gameId}
              onChange={handleChange}
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
};

export default JoinPage;
