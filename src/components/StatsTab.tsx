import React, { useCallback } from 'react';
import { PlayerState } from '../types';
import { formatGameTime } from '../lib/format';
import { t } from '../locales';

interface StatsTabProps {
  language: 'zh' | 'en';
  player: PlayerState;
}

const StatsTab: React.FC<StatsTabProps> = ({ language, player }) => {
  const _t = useCallback((key: string) => t(key, language), [language]);

  return (
    <div className="stats-content">
      <h3>{_t('stats.title')}</h3>

      <div className="stats-section">
        <h4>{_t('stats.overall')}</h4>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.total-game-time')}</span>
          <span className="stats-value">{formatGameTime(Date.now() - player.gameStartTime, language)}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.total-rolls')}</span>
          <span className="stats-value">{player.totalRolls}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.current-cycle-rolls')}</span>
          <span className="stats-value">{player.currentCycleRolls}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.total-rebirths')}</span>
          <span className="stats-value">{player.totalRebirths}</span>
        </div>
      </div>

      <div className="stats-section">
        <h4>{_t('stats.current-cycle')}</h4>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.cycle-start-time')}</span>
          <span className="stats-value">{formatGameTime(Date.now() - player.currentCycleStartTime, language)}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.luck-level')}</span>
          <span className="stats-value">{player.upgrades.luck.level}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.interval-level')}</span>
          <span className="stats-value">{player.upgrades.interval.level}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.shimmer-level')}</span>
          <span className="stats-value">{player.upgrades.shimmer.level}</span>
        </div>
      </div>

      <div className="stats-section">
        <h4>{_t('stats.global-section')}</h4>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.global-luck-level')}</span>
          <span className="stats-value">{player.globalUpgrades.luck.level}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.global-interval-level')}</span>
          <span className="stats-value">{player.globalUpgrades.interval.level}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.global-shimmer-level')}</span>
          <span className="stats-value">{player.globalUpgrades.shimmer.level}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
