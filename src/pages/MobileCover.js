import React, {Component} from "react";
import TemplatePage from "./TemplatePage";

class MobileCover extends Component {
  state = {};
  render() {
    return (
      <TemplatePage
        content={
          <div style={{ fontSize: 35 }}>
            Вибачте, гра недоступна для телефонів.
          </div>
        }
      />
    );
  }
}

export default MobileCover;
