import React from 'react';
import {Buildings, BuildingsType, UnitTypes} from "../helpers/Constants";
import "./BoardBuildings.css";
import {getHousePrice} from "../helpers/Utils";

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
      <div style={{width: '100%'}}>
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
          if (value.name === Buildings.VivtarPoplichnukiv2.name) {
            player.houses.find(house => house.name === Buildings.VivtarPoplichnukiv.name) !== undefined ? availableBuildings.push(value) : availableBuildings.push({...value, notAllowed: true})
          } else if (value.name === Buildings.VivtarPoplichnukiv3.name) {
            (player.houses.find(house => house.name === Buildings.VivtarPoplichnukiv.name) && player.houses.find(house => house.name === Buildings.VivtarPoplichnukiv2.name))
              ? availableBuildings.push(value) : availableBuildings.push({...value, notAllowed: true})
          } else if (value.name === Buildings.VivtarProminkoriv2.name) {
            (player.houses.find(house => house.name === Buildings.VivtarProminkoriv.name))
              ? availableBuildings.push(value) : availableBuildings.push({...value, notAllowed: true})
          } else if (value.name === Buildings.VivtarProminkoriv3.name) {
            (player.houses.find(house => house.name === Buildings.VivtarProminkoriv.name) && player.houses.find(house => house.name === Buildings.VivtarProminkoriv2.name))
              ? availableBuildings.push(value) : availableBuildings.push({...value, notAllowed: true})
          } else if (value.name === Buildings.VivtarVisnukiv2.name) {
            (player.houses.find(house => house.name === Buildings.VivtarVisnukiv.name))
              ? availableBuildings.push(value) : availableBuildings.push({...value, notAllowed: true})
          } else if (value.name === Buildings.VivtarVisnukiv3.name) {
            (player.houses.find(house => house.name === Buildings.VivtarVisnukiv.name) && player.houses.find(house => house.name === Buildings.VivtarVisnukiv2.name))
              ? availableBuildings.push(value) : availableBuildings.push({...value, notAllowed: true})
          } else {
            availableBuildings.push(value)
          }
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
                <div className="building-info-price" dangerouslySetInnerHTML={{ __html: house.price > 0 ? `${getHousePrice(house, player)}✾` : ''}}></div>
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
    const availableToSell = []
    return (
      <div className="buildings-type">
        <div className="buildings-type-content">
          {player.houses.map((house, i) => {
            return (
              <div className="building-info-wrapper" key={i}>
                <div className="building-info-name" dangerouslySetInnerHTML={{ __html: house.name}}></div>
                <div className="building-info-description" dangerouslySetInnerHTML={{ __html: house.description}}></div>
                <div className="building-info-price" dangerouslySetInnerHTML={{ __html: house.price > 0 ? `${getHousePrice(house, player)}✾` : ''}}></div>
                {this.getBuildingSellPrice(house)}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  isSellBuildingAvailable(house) {
    const props = this.props.props
    const player = props.G.players.find(p => p.id === +props.playerID);
    let isAllowed = true
    if (house.name === Buildings.VivtarPoplichnukiv.name) {
      isAllowed = (player.units.find(u => u.type === UnitTypes.Prispeshnick && u.level === 1) ||
      player.houses.find(h => h.name === Buildings.VivtarPoplichnukiv2.name)) ? false : isAllowed
    } else if (house.name === Buildings.VivtarProminkoriv.name) {
      isAllowed = (player.units.find(u => u.type === UnitTypes.Prominkor && u.level === 1) ||
        player.houses.find(h => h.name === Buildings.VivtarProminkoriv2.name)) ? false : isAllowed
    } else if (house.name === Buildings.VivtarVisnukiv.name) {
      isAllowed = (player.units.find(u => u.type === UnitTypes.Vestnick && u.level === 1) ||
      player.houses.find(h => h.name === Buildings.VivtarVisnukiv2.name)) ? false : isAllowed
    } else if (house.name === Buildings.VivtarPoplichnukiv2.name) {
      isAllowed = (player.units.find(u => u.type === UnitTypes.Prispeshnick && u.level === 2) ||
      player.houses.find(h => h.name === Buildings.VivtarPoplichnukiv3.name)) ? false : isAllowed
    } else if (house.name === Buildings.VivtarProminkoriv2.name) {
      isAllowed = (player.units.find(u => u.type === UnitTypes.Prominkor && u.level === 2) ||
      player.houses.find(h => h.name === Buildings.VivtarProminkoriv3.name)) ? false : isAllowed
    } else if (house.name === Buildings.VivtarVisnukiv2.name) {
      isAllowed = (player.units.find(u => u.type === UnitTypes.Vestnick && u.level === 2) ||
      player.houses.find(h => h.name === Buildings.VivtarVisnukiv3.name)) ? false : isAllowed
    } else if (house.name === Buildings.VivtarPoplichnukiv3.name) {
      isAllowed = player.units.find(u => u.type === UnitTypes.Prispeshnick && u.level === 3) ? false : isAllowed
    } else if (house.name === Buildings.VivtarProminkoriv3.name) {
      isAllowed = player.units.find(u => u.type === UnitTypes.Prominkor && u.level === 3) ? false : isAllowed
    } else if (house.name === Buildings.VivtarVisnukiv3.name) {
      isAllowed = player.units.find(u => u.type === UnitTypes.Vestnick && u.level === 3) ? false : isAllowed
    }

    return isAllowed
  }

  getBuildingBuyPrice(house) {
    const props = this.props.props
    const player = props.G.players.find(p => p.id === +props.playerID);
    if (getHousePrice(house, player) > player.essence || house.notAllowed) {
      return (<div className="building-info-buy disabled">Придбати</div>)
    } else {
      return (<div className='building-info-buy' onClick={() => props.moves.buyHouse(house)}>Придбати</div>)
    }
  }

  getBuildingSellPrice(house) {
    const props = this.props.props
    if (props.ctx.turn === house.turn) {
      const isAllowedToSell = this.isSellBuildingAvailable(house)
      return (<div className={isAllowedToSell?'building-info-buy':'building-info-buy disabled'} onClick={() => isAllowedToSell ? props.moves.sellHouse(house) : 0}>Повернути</div>)
    } else {
      return (<></>)
    }
  }

}
