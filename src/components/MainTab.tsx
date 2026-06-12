import React, { useCallback } from 'react';
import { PlayerState } from '../types';
import { formatNumber, calculateRebirthPoints } from '../lib/gameLogic';
import { getRarityName } from '../lib/format';
import { t } from '../locales';
import Badge from './Badge';

interface MainTabProps {
  language: 'zh' | 'en';
  player: PlayerState;
  onRoll: () => void;
  onUpgradeLuck: () => void;
  onUpgradeInterval: () => void;
  onUpgradeShimmer: () => void;
  onUpgradeGlobalLuck: () => void;
  onUpgradeGlobalInterval: () => void;
  onUpgradeGlobalShimmer: () => void;
  onRebirth: () => void;
}

const MainTab: React.FC<MainTabProps> = ({
  language, player, onRoll, onUpgradeLuck, onUpgradeInterval, onUpgradeShimmer,
  onUpgradeGlobalLuck, onUpgradeGlobalInterval, onUpgradeGlobalShimmer, onRebirth
}) => {
  const _t = useCallback((key: string) => t(key, language), [language]);

  return (
    <div className="main-content">
      <div className="roll-button-container">
        <button
          className={`roll-button ${player.rollTimer === 0 ? 'ready' : ''}`}
          onClick={onRoll}
          disabled={player.rollTimer > 0}
        >
          {_t('main.roll')} {player.rollTimer > 0 ? `(${player.rollTimer.toFixed(1)}s)` : _t('main.ready')}
        </button>
      </div>

      <div className="upgrades-section">
        <h3>{_t('main.current-cycle-upgrades')}</h3>
        <div className="upgrades">
          <div className="upgrade-item" onClick={onUpgradeLuck}>
            <div className="upgrade-title">{_t('main.upgrade-luck')}</div>
            <div className="upgrade-description">
              {player.luck.toFixed(1)}x &gt; {(player.luck * 2.5).toFixed(1)}x
            </div>
            <div className="upgrade-price">
              {formatNumber(player.upgrades.luck.price)} {_t('main.shimmer')}
            </div>
          </div>

          <div className="upgrade-item" onClick={onUpgradeInterval}>
            <div className="upgrade-title">{_t('main.upgrade-interval')}</div>
            <div className="upgrade-description">
              {player.rollInterval.toFixed(1)}s &gt; {(player.rollInterval * 0.85).toFixed(1)}s
            </div>
            <div className="upgrade-price">
              {formatNumber(player.upgrades.interval.price)} {_t('main.shimmer')}
            </div>
          </div>

          <div className="upgrade-item" onClick={onUpgradeShimmer}>
            <div className="upgrade-title">{_t('main.upgrade-shimmer')}</div>
            <div className="upgrade-description">
              {player.shimmerMulti.toFixed(1)}x &gt; {(player.shimmerMulti * 2).toFixed(1)}x
            </div>
            <div className="upgrade-price">
              {formatNumber(player.upgrades.shimmer.price)} {_t('main.shimmer')}
            </div>
          </div>
        </div>
      </div>

      <div className="upgrades-section">
        <h3>{_t('main.global-upgrades')}</h3>
        <div className="upgrades">
          <div className="upgrade-item global" onClick={onUpgradeGlobalLuck}>
            <div className="upgrade-title">{_t('main.global-luck')}</div>
            <div className="upgrade-description">
              {player.globalLuck.toFixed(1)}x &gt; {(player.globalLuck + 0.1).toFixed(1)}x
            </div>
            <div className="upgrade-price">
              {player.globalUpgrades.luck.price} {_t('main.ap')}
            </div>
          </div>

          <div className="upgrade-item global" onClick={onUpgradeGlobalInterval}>
            <div className="upgrade-title">{_t('main.global-interval')}</div>
            <div className="upgrade-description">
              {player.globalIntervalReduction.toFixed(2)}x &gt; {(player.globalIntervalReduction + 0.05).toFixed(2)}x
            </div>
            <div className="upgrade-price">
              {player.globalUpgrades.interval.price} {_t('main.ap')}
            </div>
          </div>

          <div className="upgrade-item global" onClick={onUpgradeGlobalShimmer}>
            <div className="upgrade-title">{_t('main.global-shimmer')}</div>
            <div className="upgrade-description">
              {player.globalShimmerMulti.toFixed(1)}x &gt; {(player.globalShimmerMulti + 0.2).toFixed(1)}x
            </div>
            <div className="upgrade-price">
              {player.globalUpgrades.shimmer.price} {_t('main.ap')}
            </div>
          </div>
        </div>
      </div>

      <div className="recent-rolls">
        <h3>{_t('main.last-10-rolls')}</h3>
        <div className="rolls-list">
          {player.last10Rolls.map((roll, index) => (
            <div key={index} className="roll-item" style={{ color: roll.color }}>
              <Badge rarityId={roll.id} size={30} className="roll-badge" />
              <span className="roll-text">
                {language === 'zh' ? roll.rarity : getRarityName(roll.id, language)} - {(1 / roll.chance).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="best-roll">
        <h3>{_t('main.best-roll')}</h3>
        <div className="roll-item" style={{ color: player.bestRoll.color }}>
          {player.bestRoll.id > 0 && <Badge rarityId={player.bestRoll.id} size={40} className="best-roll-badge" />}
          <span className="roll-text">
            {language === 'zh' ? player.bestRoll.rarity : getRarityName(player.bestRoll.id, language)} - {(1 / player.bestRoll.chance).toFixed(0)}
          </span>
        </div>
      </div>

      {player.bestRoll.id >= 7 && (
        <div className="rebirth-button-container">
          <button className="rebirth-button" onClick={onRebirth}>
            {_t('main.rebirth')} (+{calculateRebirthPoints(player.bestRoll.id)} {_t('main.ap')})
          </button>
        </div>
      )}
    </div>
  );
};

export default MainTab;
