import React, {Component} from "react";
import TemplatePage from "./TemplatePage";
import {logGameUi} from "../game/helpers/Utils";

class MobileCover extends Component {
  state = {};
  render() {
    return (
      <TemplatePage
        content={
          <div style={{ fontSize: 35, color: "#01b6c6" }}>
            {logGameUi('unavailable_mobile')}
          </div>
        }
      />
    );
  }
}

export default MobileCover;
