import React from 'react';
import {playerColors, UnitSkills} from "../helpers/Constants";
import UnitList from "./UnitList";
import "./BoardUser.css";
import {getNearestEnemies, getUnitById} from "../helpers/Utils";
import UnitSortie from "./UnitSortie";

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
    marginTop: 5,
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
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
    const playerClient = props.G.players.find(p => p.id === +props.playerID);
    return (
      <div style={styles.mainStyles}>
        <UnitList data={props} info={this.props.info}/>
        {props.ctx.phase === 'Setup' ?
          <UnitSortie data={props} info={this.props.info}/>
          : <></>
        }
        {(props.ctx.phase !== 'Setup' && props.ctx.phase !== 'Building') ?
          <div style={{textAlign: "center", color: playerColors[+props.ctx.currentPlayer], fontSize: 24, marginTop: 15}}>
            <span style={{color: "#444444"}}>Хід:</span> Гравець {player ? player.id + 1 : "Невідомий"}
          </div>
          : <></>
        }
        {this.showFightQueue()}
        <div>
          <div style={{color: playerColors[+props.playerID], textAlign: "center", marginTop: 20, fontSize: 22}}>Дії</div>
          {playerClient.isPlayerInGame ?
            <div style={styles.actions} className="user-actions">
              {props.ctx.phase === 'Positioning' || props.ctx.phase === 'Fight' ?
                <button onClick={() => props.undo()}>Назад</button>
                : <></>
              }
              {props.ctx.activePlayers && (props.ctx.activePlayers[+props.playerID] === "finishBuildingStage" || props.ctx.activePlayers[+props.playerID] === "finishSetupStage") ?
                <button onClick={() => props.moves.returnBack()}>Повернутися</button>
                : <></>
              }
              {props.ctx.activePlayers && (props.ctx.activePlayers[+props.playerID] === "placeUnit") ?
                <button onClick={() => props.moves.removeUnit()}>Повернути</button>
                : <></>
              }
              {(props.ctx.phase === 'Building' || props.ctx.phase === 'Setup') && (props.ctx.activePlayers && (props.ctx.activePlayers[+props.playerID] !== "finishBuildingStage" && props.ctx.activePlayers[+props.playerID] !== "finishSetupStage"))?
                <button onClick={() => props.moves.complete()}>Завершити</button>
                : <></>
              }
              {this.isSacrificeAvailable() ?
                <button onClick={() => props.moves.sacrificeHeals()}>Пожертувати життям</button>
                : <></>
              }
              {this.isDefaultSkipTurnAvailable() ?
                <button onClick={() => props.moves.skipTurn()}>Пропустити</button>
                : <></>
              }
              {props.ctx.activePlayers && (props.ctx.activePlayers[+props.ctx.currentPlayer] === "hookUnitAction") ?
                <button onClick={() => props.moves.skipHook()}>Пропустити</button>
                : <></>
              }
              {props.ctx.activePlayers && (props.ctx.activePlayers[+props.ctx.currentPlayer] === "throwOverAction") ?
                <button onClick={() => props.moves.skipHook()}>Пропустити</button>
                : <></>
              }
              {props.ctx.activePlayers && (props.ctx.activePlayers[+props.ctx.currentPlayer] === "showUrkaAction") ?
                <button onClick={() => props.moves.doActionToEnemy()}>Перемістити слугу</button>
                : <></>
              }
              {props.ctx.activePlayers && (props.ctx.activePlayers[+props.ctx.currentPlayer] === "curseAbasyActionStage") ?
                <button onClick={() => props.moves.backFromAction()}>Повернутися до ходу</button>
                : <></>
              }
              {props.ctx.activePlayers && (props.ctx.activePlayers[+playerClient.id] === "resultsStage") ?
                <button onClick={() => props.moves.nextRound()}>Наступний раунд</button>
                : <></>
              }
              {this.isHealAllyAvailable() ?
                <button onClick={() => props.moves.healAllyAction()}>Зцілити життя</button>
                : <></>
              }
              {this.isCurseAbasuAvailable() ?
                <button onClick={() => props.moves.curseAction()}>Причинити біль</button>
                : <></>
              }
              {this.isWeaponThrowAvailable() ?
                <button onClick={() => props.moves.throwWeaponAction()}>Шпурнути ікла</button>
                : <></>
              }
              {this.isReplaceUnitsAvailable() ?
                <button onClick={() => props.moves.replaceUnitsAction()}>Поміняти місцями</button>
                : <></>
              }
              {this.isPauseToRecoverAvailable() ?
                <button onClick={() => props.moves.pauseToRecoverAction()}>Час відновитись</button>
                : <></>
              }
              {this.isNotMovedRecoverAvailable() ?
                <button onClick={() => props.moves.notMovedRecoverAction()}>Можна відновитись</button>
                : <></>
              }
              {this.isChargeAttackAvailable() ?
                <button onClick={() => props.moves.chargeAttackAction()}>Зарядити атаку</button>
                : <></>
              }
              {this.isSetElokoCurseAvailable() ?
                <button onClick={() => props.moves.setElokoCurseAction()}>Зачарувати істоту</button>
                : <></>
              }
              {this.isSetItOnFireAvailable() ?
                <button onClick={() => props.moves.setItOnFireAction()}>Спалити істоту</button>
                : <></>
              }
            </div>
            : <></>
          }
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

  isSetElokoCurseAvailable() {
    const props = this.props.props
    if (props.G.currentUnit && props.G.currentUnit.abilities.allTimeActions.find(skill => skill.name === UnitSkills.SetElokoCurse && skill.qty > 0)) {
      if (props.ctx.activePlayers && props.ctx.activePlayers[+props.ctx.currentPlayer] === "placeUnitOnBoard") {
        return true
      }
    }
    return false
  }

  isSetItOnFireAvailable() {
    const props = this.props.props
    if (props.G.currentUnit && props.G.currentUnit.abilities.allTimeActions.find(skill => skill.name === UnitSkills.SetItOnFire && skill.qty > 0)) {
      if (props.ctx.activePlayers && ((props.ctx.activePlayers[+props.ctx.currentPlayer] === "placeUnitOnBoard") ||
        (props.ctx.activePlayers[+props.ctx.currentPlayer] === "makeDamage"))) {
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

  isPauseToRecoverAvailable() {
    const props = this.props.props
    if (props.G.currentUnit && props.G.currentUnit.abilities.allTimeActions.find(skill => skill.name === UnitSkills.pauseToRecover && skill.qty > 0)) {
      if (props.ctx.activePlayers && (props.ctx.activePlayers[+props.ctx.currentPlayer] === "placeUnitOnBoard" ||
        (props.ctx.activePlayers[+props.ctx.currentPlayer] === "makeDamage"))) {
        return true
      }
    }
    return false
  }

  isNotMovedRecoverAvailable() {
    const props = this.props.props
    if (props.G.currentUnit && props.G.currentUnit.abilities.allTimeActions.find(skill => skill.name === UnitSkills.NotMovedRecover &&
      props.G.currentUnit.unitState.point && getNearestEnemies(props.G, props.G.currentUnit.unitState).length === 0 &&
      props.G.currentUnit.heals < props.G.currentUnit.unitState.baseStats.heals)) {
      if (props.ctx.activePlayers && (props.ctx.activePlayers[+props.ctx.currentPlayer] === "placeUnitOnBoard" )) {
        return true
      }
    }
    return false
  }

  isChargeAttackAvailable() {
    const props = this.props.props
    if (props.G.currentUnit && props.G.currentUnit.abilities.allTimeActions.find(skill => skill.name === UnitSkills.ChargeAttack && skill.qty > 0)) {
      if (props.ctx.activePlayers && (props.ctx.activePlayers[+props.ctx.currentPlayer] === "placeUnitOnBoard")) {
        return true
      }
    }
    return false
  }

  isDefaultSkipTurnAvailable() {
    const props = this.props.props
    const playerStage = props.ctx.activePlayers ? props.ctx.activePlayers[+props.ctx.currentPlayer] : null
    return props.ctx.activePlayers && ((playerStage === "placeUnitOnBoard") || (playerStage === "makeDamage") ||
      (playerStage === "doRaid") || (playerStage === "showUrkaAction"));
  }

  isSacrificeAvailable() {
    const props = this.props.props
    const playerStage = props.ctx.activePlayers ? props.ctx.activePlayers[+props.ctx.currentPlayer] : null
    if (props.ctx.activePlayers && playerStage === "purchase") {
      const player = props.G.players.find(p => p.id === +props.playerID);
      return player.isUsedSacrifice === false && player.heals > 2 && props.G.players.filter(p => p.isPlayerInGame).filter(p => p.heals > player.heals).length > 0 &&
        (player.essence < 24 && player.houses.find(h => props.ctx.turn === h.turn) === undefined && player.units.length === 0)
    } else return false
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
