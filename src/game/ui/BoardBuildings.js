import React from 'react';
import {Buildings, BuildingsType} from "../helpers/Constants";
import "./BoardBuildings.css";

export class BoardBuildings extends React.Component {
  render () {
    const props = this.props.props
    const player = props.G.players.find(p => p.id === +props.playerID);
    return (
      <div style={this.props.style}>
        {this.showBuildingsList()}
      </div>
    )
  }


  showBuildingsList() {
    return (
      <div>
        <div className="buildings-container">
          <div className="buildings-head">Доступні Споруди</div>
          <div className="buildings-list">
            {this.showBuildings(BuildingsType.Peace)}
            {this.showBuildings(BuildingsType.Vivtar1)}
            {this.showBuildings(BuildingsType.Vivtar2)}
            {this.showBuildings(BuildingsType.Vivtar3)}
          </div>
        </div>
        <div className="buildings-divide"></div>
        <div className="buildings-container">
          <div className="buildings-head">Придбані Споруди</div>
          <div className="buildings-list">
            {this.showMyBuildings()}
          </div>
        </div>
      </div>
    )
  }

  showBuildings(type) {
    const props = this.props.props
    const player = props.G.players.find(p => p.id === +props.playerID);

    const availableBuildings = []
    for (const [key, value] of Object.entries(Buildings)) {
      if (value.type === type) {
        const playersHouse = player.houses.find(house => house.name === value.name)
        if (playersHouse === undefined) {
          availableBuildings.push(value)
        }
      }
    }
    return (
      <div className="buildings-type">
        <div className="buildings-type-name">{type} {
          type !== BuildingsType.Peace ?
            <div style={{fontSize: 18, marginTop: 5}}>[{player.bioms[0]}, {player.bioms[1]}]</div> :
            <></>
        }</div>
        <div className="buildings-type-content">
          {availableBuildings.map((house, i) => {
            return (
              <div className="building-info-wrapper" key={i}>
                <div className="building-info-name" dangerouslySetInnerHTML={{ __html: house.name}}></div>
                <div className="building-info-description" dangerouslySetInnerHTML={{ __html: house.description}}></div>
                <div className="building-info-price" dangerouslySetInnerHTML={{ __html: house.price > 0 ? `${house.price}✾` : ''}}></div>
                {this.getBuildingBuyPrice(house)}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  showMyBuildings() {
    const props = this.props.props
    const player = props.G.players.find(p => p.id === +props.playerID);

    return (
      <div className="buildings-type">
        <div className="buildings-type-content">
          {player.houses.map((house, i) => {
            return (
              <div className="building-info-wrapper" key={i}>
                <div className="building-info-name" dangerouslySetInnerHTML={{ __html: house.name}}></div>
                <div className="building-info-description" dangerouslySetInnerHTML={{ __html: house.description}}></div>
                <div className="building-info-price" dangerouslySetInnerHTML={{ __html: house.price > 0 ? `${house.price}✾` : ''}}></div>
                {this.getBuildingSellPrice(house)}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  getBuildingBuyPrice(house) {
    const props = this.props.props
    const player = props.G.players.find(p => p.id === +props.playerID);
    if (house.price > player.essence) {
      return (<div className="building-info-buy disabled">Придбати</div>)
    } else {
      return (<div className='building-info-buy' onClick={() => props.moves.buyHouse(house)}>Придбати</div>)
    }
  }

  getBuildingSellPrice(house) {
    const props = this.props.props
    if (house.sellPrice > 0) {
      return (<div className='building-info-buy' onClick={() => props.moves.sellHouse(house)}>Продати за {
        props.ctx.turn === house.turn ? <span><span style={{textDecoration: "line-through", color: "black"}}>{house.sellPrice}✾</span> {house.price}</span> : house.sellPrice
      }✾</div>)
    } else {
      return (<div className='building-info-buy disabled'>Не продається</div>)
    }
  }

}
