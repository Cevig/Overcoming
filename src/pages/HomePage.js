import React from "react";
import "./styles/homePage.css";
import TemplatePage from "./TemplatePage";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {logGameUi} from "../game/helpers/Utils";
import {useMenuPage} from "../hooks/useMenuPage";

const HomePage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const infoTexts = {
    start: logGameUi('new_game'),
    join: logGameUi('invite_code')
  };

  const { text, handleHoverIn, handleHoverOut } = useMenuPage(infoTexts);

  return (
    <TemplatePage
      content={
        <>
          <div className="menu-cards">
            <div
              className="card start"
              onMouseEnter={() => handleHoverIn("start")}
              onMouseLeave={handleHoverOut}
              onClick={() => history.push("/new")}
            >
              <div className="card-inside">
                <h1>{logGameUi('new_game')}</h1>
              </div>
            </div>
            <div
              className="card join"
              onMouseEnter={() => handleHoverIn("join")}
              onMouseLeave={handleHoverOut}
              onClick={() => history.push("/join")}
            >
              <div className="card-inside">
                <h1>{logGameUi('go_to')}</h1>
              </div>
            </div>
          </div>
          <div id="menu-description">{text}</div>
        </>
      }
    />
  );
};

export default HomePage;
