import React, { useCallback } from 'react';
import { PlayerState } from '../types';
import { formatNumber } from '../lib/gameLogic';
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
  onRegenerate: () => void;
}

const MainTab: React.FC<MainTabProps> = ({
  language, player, onRoll, onUpgradeLuck, onUpgradeInterval, onUpgradeShimmer,
  onRegenerate
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
        <div className="regeneration-section">
          <h3>{_t('main.regeneration')}</h3>
          <div className="ap-display">{formatNumber(player.achievementPoints)} {_t('main.glisten')}</div>
          <button
            className="regeneration-button"
            onClick={onRegenerate}
            disabled={player.bestRoll.id < 8}
          >
            {player.bestRoll.id >= 8
              ? `${_t('main.regenerate')} (${(Math.pow(1.3, player.bestRoll.id - 7) * player.regenRLuck).toFixed(1)}x ${_t('main.luck')})`
              : _t('main.regen-requires-super-epic')}
          </button>
        </div>
      )}
    </div>
  );
};

export default MainTab;
