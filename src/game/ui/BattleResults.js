import React, {useCallback, useMemo} from 'react';
import {Buildings, playerColors} from "../helpers/Constants";
import {
  calculateSortie,
  logBuilding,
  logGameUi,
  logUnitName
} from "../helpers/Utils";
import {useTranslation} from "react-i18next";

const BattleResults = ({ props, style, info }) => {
  const { t } = useTranslation();
  const { G, playerID, moves } = props;
  const [setIsPopupOpen, setInfoUnit, setIsNamePopupOpen] = info;

  // Memoize the current player to avoid recalculation on each render
  const player = useMemo(() =>
    G.players.find(p => p.id === +playerID),
    [G.players, playerID]
  );

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const togglePopup = useCallback((unit, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setInfoUnit(unit);
    setIsPopupOpen(true);
  }, [setInfoUnit, setIsPopupOpen]);

  // Extract component parts into separate function components
  const RemainingUnits = useCallback(({ p }) => {
    const units = p.units.filter(u => u.unitState.isInGame);

    if (units.length === 0) return null;

    return (
      <div style={{ textAlign: "center", marginTop: 10, borderTop: "1px solid darkgrey" }}>
        <div>{logGameUi('survived_creatures')}</div>
        <div>
          {units.map(u => {
            setIsNamePopupOpen(false);
            return (
              <div
                className="unit-instance"
                key={`unit-${u.id}-${p.id}`}
                style={{ border: "none", padding: 0, margin: "0 auto" }}
              >
                <h3 style={{ color: playerColors[+p.id], fontSize: 18 }}>
                  {logUnitName(u.name)}
                  <span
                    onClick={(e) => togglePopup(u, e)}
                    style={{ color: "#d6d9d9", fontSize: 19, cursor: "pointer" }}
                  >
                    &#9432;
                  </span>
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [togglePopup, setIsNamePopupOpen]);

  const SortieResults = useCallback(({ p }) => {
    const sortieResults = calculateSortie(G, p);
    const hasCelestialGate = p.houses.some(h => h.name === Buildings.NebesnaBrama.name);
    const sortieUnitCount = p.units.filter(u => u.unitState.isInSortie).length;

    return (
      <div style={{ textAlign: "center", marginTop: 10, borderTop: "1px solid darkgrey" }}>
        <div style={{ fontSize: 20 }}>{logGameUi('sortie_results')}</div>
        <div>
          {sortieResults.map((res, i) => (
            <div key={`sortie-${res.player.id}-${i}`} style={{ marginBottom: 10 }}>
              <div style={{ color: playerColors[res.player.id], fontSize: 16 }}>
                {player.name}:
              </div>
              <div style={{ fontSize: 16 }}>{t('sortieTypes.' + res.type)}</div>
            </div>
          ))}
        </div>
        {hasCelestialGate && (
          <div style={{ fontSize: 20 }}>
            {t('game.income', { building: logBuilding('nebesnaBrama').name })}
            <span style={{ fontWeight: "bold" }}>+{3 * sortieUnitCount}✾</span>
          </div>
        )}
      </div>
    );
  }, [G, player.name, t]);

  const DamageButton = useCallback(({ p }) => {
    if (p.id !== player.id && player.isPlayerInBattle && !player.dealtDamage) {
      return (
        <div
          className='building-info-buy'
          style={{ margin: "auto", textAlign: "center", cursor: "pointer" }}
          onClick={() => moves.damagePlayer(p.id)}
        >
          {t('game.attack', { name: logBuilding('kapitoliy').name })}
        </div>
      );
    }
    return null;
  }, [player, moves, t]);

  const PlayersList = useMemo(() => {
    const activePlayers = G.players.filter(p => p.isPlayerInGame);

    return (
      <div className="results-p-container">
        {activePlayers.map(p => (
          <div key={`player-${p.id}`}>
            <div style={{ color: playerColors[p.id] }} className="results-p-name">
              {p.name}
            </div>
            <div className="player-info" style={{ fontSize: 24 }}>
              <div>
                <span style={{ color: "red" }}>{p.heals}&hearts;</span>
                [<span>{p.essence}✾</span>]
              </div>
              <div>{logGameUi('player_won')} {p.wins}</div>
              <div>{logGameUi('player_killed')} {p.killedUnits}</div>
              <RemainingUnits p={p} />
              <SortieResults p={p} />
            </div>
            <DamageButton p={p} />
          </div>
        ))}
      </div>
    );
  }, [G.players, RemainingUnits, SortieResults, DamageButton]);

  return <div style={style}>{PlayersList}</div>;
};

export default React.memo(BattleResults);
