import React, {Component} from "react";
import GithubCorner from "react-github-corner";
import "./styles/templatePage.css";
import {Link} from "react-router-dom";
import {LanguageToggle} from "../game/ui/LanguageToggle";

class TemplatePage extends Component {
  render() {
    return (
      <div className="full_height">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="title">
            <div className="over-logo" />
            <div className="title-text">Overcoming</div>
            <LanguageToggle />
          </div>
        </Link>
        {this.props.content}
        <GithubCorner
          href={"https://github.com/Cevig/Overcoming"}
          bannerColor="#64CEAA"
          octoColor="#fff"
          size={80}
          direction="left"
        />
      </div>
    );
  }
}

export default TemplatePage;
