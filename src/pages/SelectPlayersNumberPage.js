import React from "react";
import "./styles/homePage.css";
import {LobbyAPI} from "../api";
import TemplatePage from "./TemplatePage";
import {setPlayerNumber} from "../game/helpers/Utils";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {useMenuPage} from "../hooks/useMenuPage";

const api = new LobbyAPI();

const SelectPlayersNumberPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const infoTexts = {
    start2: t('game.create_for_players', {qty: 2}),
    start3: t('game.create_for_players', {qty: 3}),
    start4: t('game.create_for_players', {qty: 4})
  };

  const { text, loading, setLoading, handleHoverIn, handleHoverOut } = useMenuPage(infoTexts);

  const createGame = async (num) => {
    if (loading) return;

    try {
      setLoading(true);
      setPlayerNumber(num);
      const roomID = await api.createRoom(num);
      console.log("Created room with roomID = ", roomID);
      history.push("/lobby/" + roomID);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TemplatePage
      content={
        <>
          <div className="menu-cards">
            <div
              className="card start"
              onMouseEnter={() => handleHoverIn("start2")}
              onMouseLeave={handleHoverOut}
              onClick={() => createGame(2)}
            >
              <div className="card-inside">
                <h1>{t('game.qty_players', {qty: 2})}</h1>
              </div>
            </div>
            <div
              className="card join"
              onMouseEnter={() => handleHoverIn("start3")}
              onMouseLeave={handleHoverOut}
              onClick={() => createGame(3)}
            >
              <div className="card-inside">
                <h1>{t('game.qty_players', {qty: 3})}</h1>
              </div>
            </div>
            <div
              className="card other"
              onMouseEnter={() => handleHoverIn("start4")}
              onMouseLeave={handleHoverOut}
              onClick={() => createGame(4)}
            >
              <div className="card-inside">
                <h1>{t('game.qty_players', {qty: 4})}</h1>
              </div>
            </div>
          </div>
          <div id="menu-description">{text}</div>
        </>
      }
    />
  );
};

export default SelectPlayersNumberPage;
