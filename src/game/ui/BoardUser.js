import React from 'react';
import {playerColors, UnitSkills} from "../helpers/Constants";
import UnitList from "./UnitList";
import "./BoardUser.css";
import {getUnitById} from "../helpers/Utils";

const styles = {
  moves: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  move: {
    padding: 5,
    border: '1px solid black',
    backgroundColor: 'grey',
    marginRight: 5,
    flexBasis: '18%',
    textAlign: 'center',
    marginTop: 5
  },
  clickableMove: {
    cursor: 'pointer',
    backgroundColor: 'white',
  },
  biom: {
    fontSize: 12,
    marginLeft: 3
  },

  mainStyles: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: `21%`,
    paddingRight: 10,
    maxWidth: 400
  },
  actions: {
    padding: 5,
    border: '1px solid black',
    backgroundColor: 'grey',
    marginRight: 5,
    textAlign: 'center',
    marginTop: 5
  },

  units: {
    display: 'flex',
    flexDirection: 'column'
  }
}

export class BoardUser extends React.Component {
  render () {
    const props = this.props.props
    const player = props.G.players.find(p => p.id === +props.ctx.currentPlayer);
    return (
      <div style={styles.mainStyles}>
        <UnitList data={props} info={this.props.info}/>
        {/*<div>phase: {props.ctx.phase}</div>*/}
        <div style={{textAlign: "center", color: playerColors[+props.ctx.currentPlayer], fontSize: 24, marginTop: 15}}>
          <span style={{color: "#444444"}}>Хід:</span> Гравець {player ? player.id + 1 : "Невідомий"}
        </div>
        {this.showFightQueue()}
        <div style={{marginTop: "auto", marginBottom: 30}}>
          <div style={{color: playerColors[+props.playerID], textAlign: "center", marginTop: 20, fontSize: 22}}>Дії</div>
          <div style={styles.actions}>
            <button onClick={() => props.undo()}>Назад</button>
            {props.ctx.activePlayers && (props.ctx.activePlayers[+props.playerID] === "placeUnit") ?
              <button onClick={() => props.moves.removeUnit()}>Видалити</button>
              : <span></span>
            }
            {props.ctx.phase === 'Setup' ?
              <button onClick={() => props.moves.complete()}>Завершити</button>
              : <span></span>
            }
            {this.isDefaultSkipTurnAvailable() ?
              <button onClick={() => props.moves.skipTurn()}>Пропустити</button>
              : <span></span>
            }
            {props.ctx.activePlayers && (props.ctx.activePlayers[+props.ctx.currentPlayer] === "hookUnitAction") ?
              <button onClick={() => props.moves.skipHook()}>Пропустити</button>
              : <span></span>
            }
            {props.ctx.activePlayers && (props.ctx.activePlayers[+props.ctx.currentPlayer] === "showUrkaAction") ?
              <button onClick={() => props.moves.doActionToEnemy()}>Перемістити слугу</button>
              : <span></span>
            }
            {props.ctx.activePlayers && (props.ctx.activePlayers[+props.ctx.currentPlayer] === "curseAbasyActionStage") ?
              <button onClick={() => props.moves.backFromAction()}>Повернутися до ходу</button>
              : <span></span>
            }
            {this.isHealAllyAvailable() ?
              <button onClick={() => props.moves.healAllyAction()}>Зцілити життя</button>
              : <span></span>
            }
            {this.isCurseAbasuAvailable() ?
              <button onClick={() => props.moves.curseAction()}>Причинити біль</button>
              : <span></span>
            }
            {this.isWeaponThrowAvailable() ?
              <button onClick={() => props.moves.throwWeaponAction()}>Шпурнути ікла</button>
              : <span></span>
            }
            {this.isReplaceUnitsAvailable() ?
              <button onClick={() => props.moves.replaceUnitsAction()}>Поміняти місцями</button>
              : <span></span>
            }
          </div>
        </div>
      </div>
    )
  }

  isHealAllyAvailable() {
    const props = this.props.props
    if (props.G.currentUnit && props.G.currentUnit.abilities.allTimeActions.find(skill => skill.name === UnitSkills.healAlly && skill.qty > 0)) {
      if (props.ctx.activePlayers && ((props.ctx.activePlayers[+props.ctx.currentPlayer] === "placeUnitOnBoard") ||
        (props.ctx.activePlayers[+props.ctx.currentPlayer] === "makeDamage"))) {
        return true
      }
    }
    return false
  }

  isWeaponThrowAvailable() {
    const props = this.props.props
    if (props.G.currentUnit && props.G.currentUnit.abilities.allTimeActions.find(skill => skill.name === UnitSkills.throwWeapon && skill.qty > 0)) {
      if (props.ctx.activePlayers && props.ctx.activePlayers[+props.ctx.currentPlayer] === "placeUnitOnBoard") {
        return true
      }
    }
    return false
  }

  isCurseAbasuAvailable() {
    const props = this.props.props
    if (props.G.currentUnit && props.G.currentUnit.abilities.allTimeActions.find(skill => skill.name === UnitSkills.abasuCurse && skill.qty > 0)) {
      if (props.ctx.activePlayers && ((props.ctx.activePlayers[+props.ctx.currentPlayer] === "placeUnitOnBoard") ||
        (props.ctx.activePlayers[+props.ctx.currentPlayer] === "makeDamage"))) {
        return true
      }
    }
    return false
  }

  isReplaceUnitsAvailable() {
    const props = this.props.props
    if (props.G.currentUnit && props.G.currentUnit.abilities.allTimeActions.find(skill => skill.name === UnitSkills.replaceUnits && skill.qty > 0)) {
      if (props.ctx.activePlayers && ((props.ctx.activePlayers[+props.ctx.currentPlayer] === "placeUnitOnBoard") ||
        (props.ctx.activePlayers[+props.ctx.currentPlayer] === "makeDamage"))) {
        return true
      }
    }
    return false
  }

  isDefaultSkipTurnAvailable() {
    const props = this.props.props
    const playerStage = props.ctx.activePlayers[+props.ctx.currentPlayer]
    return props.ctx.activePlayers && ((playerStage === "placeUnitOnBoard") || (playerStage === "makeDamage") ||
      (playerStage === "doRaid") || (playerStage === "showUrkaAction") || (playerStage === "healAllyAction") ||
      (playerStage === "throwWeaponAction") || (playerStage === "replaceUnitsAction"));
  }

  showFightQueue() {
    const props = this.props.props
    if (props.ctx.phase !== 'Fight' || props.G.fightQueue.length <= 0) {
      return (<></>)
    }
    const units = props.G.fightQueue.map(order => getUnitById(props.G, order.unitId))

    return (
      <div className="fight-queue-container">
        <div className="fight-queue-head">Порядок Ходів у Битві</div>
        <div className="fight-order" dangerouslySetInnerHTML={
          { __html: units
              .map((unit, i) =>
                `<div>
                    <span>${i+1}. </span>
                    <span style="color: ${playerColors[unit.unitState.playerId]}">${unit.name}</span>
                    <span>[${unit.power}/${unit.heals}/${unit.initiative}]</span>
                  </div>`
              ).join('')}
        } />
      </div>
    )
  }
}
