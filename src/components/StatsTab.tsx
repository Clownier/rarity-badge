import React, { useCallback } from 'react';
import { PlayerState } from '../types';
import { formatGameTime } from '../lib/format';
import { t } from '../locales';
import RarityPieChart from './RarityPieChart';
import RegenBarChart from './RegenBarChart';
import RollStrip from './RollStrip';

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
        <h4>{_t('stats.regen-section')}</h4>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.regen-luck-level')}</span>
          <span className="stats-value">{player.regenUpgrades.luck.level}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.regen-shimmer-level')}</span>
          <span className="stats-value">{player.regenUpgrades.shimmer.level}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.regen-rluck-level')}</span>
          <span className="stats-value">{player.regenUpgrades.regenLuck.level}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">{_t('stats.regen-glisten-level')}</span>
          <span className="stats-value">{player.regenUpgrades.achievementPoints.level}</span>
        </div>
      </div>

      <div className="stats-section">
        <h4>{_t('stats.rarity-distribution')}</h4>
        <div className="stats-chart-scroll">
          <RarityPieChart totalRarities={player.totalRarities} language={language} />
        </div>
      </div>

      <div className="stats-section">
        <h4>{_t('stats.regen-distribution')}</h4>
        <div className="stats-chart-scroll">
          {player.totalRebirths > 0 ? (
            <RegenBarChart totalRegenRarities={player.totalRegenRarities} language={language} />
          ) : (
            <span className="stats-locked">{_t('stats.regen-locked')}</span>
          )}
        </div>
      </div>

      <div className="stats-section">
        <h4>{_t('stats.last-10-rolls')}</h4>
        <div className="stats-chart-scroll">
          <RollStrip rolls={player.last10Rolls} language={language} />
        </div>
      </div>

      <div className="stats-section">
        <h4>{_t('stats.last-10-regen-rolls')}</h4>
        <div className="stats-chart-scroll">
          {player.totalRebirths > 0 ? (
            <RollStrip rolls={player.last10RegenRolls} language={language} />
          ) : (
            <span className="stats-locked">{_t('stats.regen-locked')}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
