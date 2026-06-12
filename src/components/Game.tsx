import React, { useState, useEffect, useCallback } from 'react';
import { PlayerState } from '../types';
import {
  initializePlayerState,
  upgradeLuck,
  upgradeInterval,
  upgradeShimmer,
  upgradeGlobalLuck,
  upgradeGlobalInterval,
  upgradeGlobalShimmer,
  formatNumber
} from '../lib/gameLogic';
import {
  updateGameStateWithAchievements,
  rollWithAchievements,
  rebirthWithAchievements,
  getAchievementData
} from '../lib/gameIntegration';
import {
  saveGame,
  loadGame,
  setupAutoSave,
  calculateOfflineProgress,
  applyOfflineProgress
} from '../lib/saveSystem';
import { getRarityName, formatGameTime } from '../lib/format';
import { t } from '../locales';
import MainTab from './MainTab';
import IndexTab from './IndexTab';
import StatsTab from './StatsTab';
import AchievementTab from './AchievementTab';
import OptionsTab from './OptionsTab';
import Badge from './Badge';
import '../styles/Game.css';
import '../styles/StatsTab.css';

const Game: React.FC = () => {
  const [player, setPlayer] = useState<PlayerState>(() => {
    const savedGame = loadGame();
    if (savedGame) {
      const currentTime = Date.now();
      const offlineProgress = calculateOfflineProgress(savedGame, currentTime);
      if (offlineProgress.timeOffline > 0) {
        return applyOfflineProgress(savedGame, offlineProgress);
      }
      return savedGame;
    }
    return initializePlayerState();
  });

  const [activeTab, setActiveTab] = useState<'main' | 'index' | 'achievements' | 'stats' | 'options'>('main');
  const [showOfflineProgress, setShowOfflineProgress] = useState(false);
  const [offlineProgressData, setOfflineProgressData] = useState({ shimmerGained: 0, rollsMade: 0, timeOffline: 0 });

  const lang = player.settings.language;
  const _t = useCallback((key: string) => t(key, lang), [lang]);

  useEffect(() => {
    const autoSaveInterval = setupAutoSave(player, saveGame);
    return () => clearInterval(autoSaveInterval);
  }, [player]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayer(prevPlayer => updateGameStateWithAchievements(prevPlayer));
    }, 1000 / 30);
    return () => clearInterval(gameLoop);
  }, []);

  useEffect(() => {
    const savedGame = loadGame();
    if (savedGame) {
      const currentTime = Date.now();
      const progress = calculateOfflineProgress(savedGame, currentTime);
      if (progress.timeOffline > 60000) {
        setOfflineProgressData(progress);
        setShowOfflineProgress(true);
      }
    }
  }, []);

  const handleRoll = useCallback(() => {
    setPlayer(prevPlayer => rollWithAchievements(prevPlayer));
  }, []);

  const handleUpgradeLuck = useCallback(() => {
    setPlayer(prevPlayer => upgradeLuck(prevPlayer));
  }, []);

  const handleUpgradeInterval = useCallback(() => {
    setPlayer(prevPlayer => upgradeInterval(prevPlayer));
  }, []);

  const handleUpgradeShimmer = useCallback(() => {
    setPlayer(prevPlayer => upgradeShimmer(prevPlayer));
  }, []);

  const handleUpgradeGlobalLuck = useCallback(() => {
    setPlayer(prevPlayer => upgradeGlobalLuck(prevPlayer));
  }, []);

  const handleUpgradeGlobalInterval = useCallback(() => {
    setPlayer(prevPlayer => upgradeGlobalInterval(prevPlayer));
  }, []);

  const handleUpgradeGlobalShimmer = useCallback(() => {
    setPlayer(prevPlayer => upgradeGlobalShimmer(prevPlayer));
  }, []);

  const handleRebirth = useCallback(() => {
    setPlayer(prevPlayer => rebirthWithAchievements(prevPlayer));
  }, []);

  const handleSaveGame = useCallback(() => {
    saveGame(player);
    alert(_t('game.save-success'));
  }, [player, _t]);

  const handleLoadGame = useCallback(() => {
    const savedGame = loadGame();
    if (savedGame) {
      setPlayer(savedGame);
      alert(_t('game.load-success'));
    } else {
      alert(_t('game.no-save'));
    }
  }, [_t]);

  const handleCloseOfflineProgress = useCallback(() => {
    setShowOfflineProgress(false);
  }, []);

  const renderAchievementsTab = () => {
    const { unlockedAchievements, inProgressAchievements, getProgress, getGoal } = getAchievementData(player);
    return (
      <AchievementTab
        unlockedAchievements={unlockedAchievements}
        inProgressAchievements={inProgressAchievements}
        getProgress={getProgress}
        getGoal={getGoal}
        language={lang}
      />
    );
  };

  const renderOptionsTab = () => (
    <OptionsTab
      player={player}
      onUpdatePlayer={setPlayer}
      onSaveGame={handleSaveGame}
      onLoadGame={handleLoadGame}
    />
  );

  const renderOfflineProgress = () => {
    if (!showOfflineProgress) return null;

    const timeOfflineFormatted = formatGameTime(offlineProgressData.timeOffline, lang);

    return (
      <div className="offline-progress-modal">
        <div className="offline-progress-content">
          <h3>{_t('offline.title')}</h3>
          <div className="offline-progress-info">
            <div>{_t('offline.time')}: {timeOfflineFormatted}</div>
            <div>{_t('offline.rolls')}: {offlineProgressData.rollsMade}</div>
            <div>{_t('offline.shimmer')}: {formatNumber(offlineProgressData.shimmerGained)}</div>
          </div>
          <button className="option-button" onClick={handleCloseOfflineProgress}>
            {_t('offline.ok')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="game-container">
      {renderOfflineProgress()}

      <div className="game-header">
        <h1>{_t('game.title')}</h1>
        <div className="resources-display">
          <span className="shimmer-display">{formatNumber(player.shimmer)} {_t('main.shimmer')}</span>
          <span className="ap-display">{player.achievementPoints} {_t('main.ap')}</span>
        </div>
      </div>

      <div className="roll-display">
        <div className="roll-result">
          {player.last10Rolls.length > 0 && (
            <>
              <Badge rarityId={player.last10Rolls[0].id} size={60} className="current-roll-badge" />
              <span className="roll-text">
                {_t('main.rolled')} {lang === 'zh'
                  ? player.last10Rolls[0].rarity
                  : getRarityName(player.last10Rolls[0].id, lang)}
              </span>
            </>
          )}
          {player.last10Rolls.length === 0 && (
            <span>{_t('main.not-rolled-yet')}</span>
          )}
        </div>
      </div>

      <div className="tabs">
        <div className={`tab ${activeTab === 'main' ? 'active' : ''}`} onClick={() => setActiveTab('main')}>
          {_t('tab.main')}
        </div>
        <div className={`tab ${activeTab === 'index' ? 'active' : ''}`} onClick={() => setActiveTab('index')}>
          {_t('tab.index')}
        </div>
        <div className={`tab ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}>
          {_t('tab.achievements')}
        </div>
        <div className={`tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
          {_t('tab.stats')}
        </div>
        <div className={`tab ${activeTab === 'options' ? 'active' : ''}`} onClick={() => setActiveTab('options')}>
          {_t('tab.options')}
        </div>
      </div>

      {activeTab === 'main' && (
        <MainTab
          language={lang}
          player={player}
          onRoll={handleRoll}
          onUpgradeLuck={handleUpgradeLuck}
          onUpgradeInterval={handleUpgradeInterval}
          onUpgradeShimmer={handleUpgradeShimmer}
          onUpgradeGlobalLuck={handleUpgradeGlobalLuck}
          onUpgradeGlobalInterval={handleUpgradeGlobalInterval}
          onUpgradeGlobalShimmer={handleUpgradeGlobalShimmer}
          onRebirth={handleRebirth}
        />
      )}
      {activeTab === 'index' && (
        <IndexTab language={lang} player={player} />
      )}
      {activeTab === 'achievements' && renderAchievementsTab()}
      {activeTab === 'stats' && (
        <StatsTab language={lang} player={player} />
      )}
      {activeTab === 'options' && renderOptionsTab()}
    </div>
  );
};

export default Game;
