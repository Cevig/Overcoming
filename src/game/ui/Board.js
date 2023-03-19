import React from 'react';
// import { HexGrid } from 'boardgame.io/ui';
import { HexGrid, Token } from './custom/myHex';
import { createPoint, isSame } from '../utils';
import { Insect } from './Insect';
import {playerColors} from "../constants";

const style = {
  display: 'flex',
  flexDirection: 'column'
};

const hexStyle = {
  display: 'flex',
  flexGrow: 1,
  width: 1100,
  backgroundColor: "#39546a"
}

const styles = {
  moves: {
    display: 'flex',
    flexDirection: 'row',
  },
  move: {
    padding: 5,
    border: '1px solid black',
    backgroundColor: 'grey',
  },
  clickableMove: {
    cursor: 'pointer',
    backgroundColor: 'white',
  }
}
const getCellColor_old = HexGrid.prototype._getCellColor;

HexGrid.prototype._getCellColor = function(...coords) {
  const color = getCellColor_old.bind(this)(...coords);
  let result = color
  if (color === 'white') {
    let point = createPoint(...coords)
    for (const playerColor in this.props.colorMap) {
      let found = this.props.colorMap[playerColor].find(coord => isSame(coord)(point))
      if (found !== undefined && isSame(found)(point)) {
        result = playerColor;
        break;
      }
    }
  }
  return result;
}

export class Board extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.render = this.render.bind(this);
    this.cellClicked = this.cellClicked.bind(this);
  }

  cellClicked({ x, y, z }) {
    const phase = this.props.ctx.phase;
    const point = createPoint(x, y, z);
    if (phase === 'selectInsect') {
      const found = this.props.G.insects.find((insect) => isSame(point)(insect.point));
      if (found && found.player === this.props.ctx.currentPlayer && found.isMovable === true) {
        this.props.moves.selectOld(found);
      }
    } else if (phase === 'moveInsect') {
      const found = this.props.G.availablePoints.find(isSame(point));
      if (found !== undefined) {
        this.props.moves.moveInsect(found);
      }
    }
  }

  render() {
    const player = this.props.G.players[this.props.ctx.currentPlayer];
    return (
      <div style={style}>
        <HexGrid
          levels={this.props.G.grid.levels}
          style={hexStyle}
          colorMap={this.props.G.grid.colorMap}
          onClick={this.cellClicked}>
          {
            this.props.G.insects.map((insect, i) => {
              const { x, y, z } = insect.point;
              insect.color = playerColors[player.id]
              return <Token x={x} y={y} z={z} key={i}>
                <Insect insect={insect} />
              </Token>
            })
          }
        </HexGrid>
        <div>
          <div>Player: {player.id}</div>
          <div style={styles.moves}>
            {player.insects.map((insect, i) => {
              return insect.isClickable ?
                <div style={{ ...styles.move, ...styles.clickableMove }} onClick={() => this.props.moves.selectNew(insect)} key={i}>{insect.type}</div> :
                <div style={styles.move} key={i}>{insect.type}</div>;
            })}
          </div>
        </div>
        <div>phase: {this.props.ctx.phase}</div>
        <button onClick={this.props.moves.cancel}>Cancel</button>
      </div>
    );
  }
}
