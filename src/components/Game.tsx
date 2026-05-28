import React, { useState, useEffect, useCallback } from 'react';
import { PlayerState } from '../types';
import { 
  initializePlayerState
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
import { RARITIES } from '../constants';
import AchievementTab from './AchievementTab';
import OptionsTab from './OptionsTab';
import Badge from './Badge';
import '../styles/Game.css';
import '../styles/StatsTab.css';

const Game: React.FC = () => {
  // 初始化玩家状态
  const [player, setPlayer] = useState<PlayerState>(() => {
    // 尝试从本地存储加载游戏
    const savedGame = loadGame();
    if (savedGame) {
      // 计算离线进度
      const currentTime = Date.now();
      const offlineProgress = calculateOfflineProgress(savedGame, currentTime);
      
      // 应用离线进度
      if (offlineProgress.timeOffline > 0) {
        return applyOfflineProgress(savedGame, offlineProgress);
      }
      
      return savedGame;
    }
    
    return initializePlayerState();
  });
  
  const [activeTab, setActiveTab] = useState<'main' | 'index' | 'achievements' | 'stats' | 'options'>('main');
  const [showOfflineProgress, setShowOfflineProgress] = useState(false);
  const [offlineProgress, setOfflineProgress] = useState({ shimmerGained: 0, rollsMade: 0, timeOffline: 0 });
  
  // 自动保存
  useEffect(() => {
    const autoSaveInterval = setupAutoSave(player, saveGame);
    return () => clearInterval(autoSaveInterval);
  }, [player]);
  
  // 游戏主循环
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayer(prevPlayer => updateGameStateWithAchievements(prevPlayer));
    }, 1000 / 30); // 30 FPS

    return () => clearInterval(gameLoop);
  }, []);
  
  // 检查离线进度
  useEffect(() => {
    const savedGame = loadGame();
    if (savedGame) {
      const currentTime = Date.now();
      const progress = calculateOfflineProgress(savedGame, currentTime);
      
      if (progress.timeOffline > 60000) { // 离线超过1分钟
        setOfflineProgress(progress);
        setShowOfflineProgress(true);
      }
    }
  }, []);
  
  // 手动掷出
  const handleRoll = useCallback(() => {
    setPlayer(prevPlayer => rollWithAchievements(prevPlayer));
  }, []);
  
  // 升级幸运
  const handleUpgradeLuck = useCallback(() => {
    setPlayer(prevPlayer => {
      // 检查是否有足够的微光
      if (prevPlayer.shimmer < prevPlayer.upgrades.luck.price) {
        return prevPlayer;
      }
      
      // 扣除微光
      const newState = { ...prevPlayer };
      newState.shimmer -= newState.upgrades.luck.price;
      
      // 增加幸运值
      newState.luck *= 2.5;
      
      // 更新等级和价格
      newState.upgrades.luck.level++;
      newState.upgrades.luck.price *= 3;
      
      return newState;
    });
  }, []);
  
  // 升级间隔
  const handleUpgradeInterval = useCallback(() => {
    setPlayer(prevPlayer => {
      // 检查是否有足够的微光
      if (prevPlayer.shimmer < prevPlayer.upgrades.interval.price) {
        return prevPlayer;
      }
      
      // 扣除微光
      const newState = { ...prevPlayer };
      newState.shimmer -= newState.upgrades.interval.price;
      
      // 减少间隔时间
      newState.rollInterval *= 0.85;
      
      // 更新等级和价格
      newState.upgrades.interval.level++;
      newState.upgrades.interval.price *= 2.25;
      
      return newState;
    });
  }, []);
  
  // 升级微光
  const handleUpgradeShimmer = useCallback(() => {
    setPlayer(prevPlayer => {
      // 检查是否有足够的微光
      if (prevPlayer.shimmer < prevPlayer.upgrades.shimmer.price) {
        return prevPlayer;
      }
      
      // 扣除微光
      const newState = { ...prevPlayer };
      newState.shimmer -= newState.upgrades.shimmer.price;
      
      // 增加微光倍率
      newState.shimmerMulti *= 2;
      
      // 更新等级和价格
      newState.upgrades.shimmer.level++;
      newState.upgrades.shimmer.price *= 4;
      
      return newState;
    });
  }, []);
  
  // 升级全局幸运
  const handleUpgradeGlobalLuck = useCallback(() => {
    setPlayer(prevPlayer => {
      // 检查是否有足够的成就点
      if (prevPlayer.achievementPoints < prevPlayer.globalUpgrades.luck.price) {
        return prevPlayer;
      }
      
      // 扣除成就点
      const newState = { ...prevPlayer };
      newState.achievementPoints -= newState.globalUpgrades.luck.price;
      
      // 增加全局幸运值
      newState.globalLuck += 0.1;
      
      // 更新等级和价格
      newState.globalUpgrades.luck.level++;
      newState.globalUpgrades.luck.price *= 2;
      
      return newState;
    });
  }, []);
  
  // 升级全局间隔
  const handleUpgradeGlobalInterval = useCallback(() => {
    setPlayer(prevPlayer => {
      // 检查是否有足够的成就点
      if (prevPlayer.achievementPoints < prevPlayer.globalUpgrades.interval.price) {
        return prevPlayer;
      }
      
      // 扣除成就点
      const newState = { ...prevPlayer };
      newState.achievementPoints -= newState.globalUpgrades.interval.price;
      
      // 增加全局间隔减少系数
      newState.globalIntervalReduction += 0.05;
      
      // 更新等级和价格
      newState.globalUpgrades.interval.level++;
      newState.globalUpgrades.interval.price *= 2;
      
      return newState;
    });
  }, []);
  
  // 升级全局微光
  const handleUpgradeGlobalShimmer = useCallback(() => {
    setPlayer(prevPlayer => {
      // 检查是否有足够的成就点
      if (prevPlayer.achievementPoints < prevPlayer.globalUpgrades.shimmer.price) {
        return prevPlayer;
      }
      
      // 扣除成就点
      const newState = { ...prevPlayer };
      newState.achievementPoints -= newState.globalUpgrades.shimmer.price;
      
      // 增加全局微光倍率
      newState.globalShimmerMulti += 0.2;
      
      // 更新等级和价格
      newState.globalUpgrades.shimmer.level++;
      newState.globalUpgrades.shimmer.price *= 2;
      
      return newState;
    });
  }, []);
  
  // 重生
  const handleRebirth = useCallback(() => {
    setPlayer(prevPlayer => rebirthWithAchievements(prevPlayer));
  }, []);
  
  // 保存游戏
  const handleSaveGame = useCallback(() => {
    saveGame(player);
    alert(getText('游戏已保存', 'Game saved'));
  }, [player]);
  
  // 加载游戏
  const handleLoadGame = useCallback(() => {
    const savedGame = loadGame();
    if (savedGame) {
      setPlayer(savedGame);
      alert(getText('游戏已加载', 'Game loaded'));
    } else {
      alert(getText('没有找到存档', 'No save found'));
    }
  }, []);
  
  // 获取当前语言的文本
  const getText = useCallback((zhText: string, enText: string) => {
    return player.settings.language === 'zh' ? zhText : enText;
  }, [player.settings.language]);
  
  // 获取稀有度名称
  const getRarityName = useCallback((rarityId: number) => {
    const rarity = RARITIES.find(r => r.id === rarityId);
    if (!rarity) return '';
    return player.settings.language === 'zh' ? rarity.rarity : rarity.rarityEn;
  }, [player.settings.language]);
  
  // 格式化数字
  const formatNumber = useCallback((num: number): string => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';
    } else {
      return num.toFixed(2);
    }
  }, []);
  
  // 计算重生可获得的成就点
  const calculateRebirthPoints = useCallback((bestRollId: number): number => {
    return Math.max(1, Math.floor((bestRollId - 6) / 2));
  }, []);
  
  // 关闭离线进度提示
  const handleCloseOfflineProgress = useCallback(() => {
    setShowOfflineProgress(false);
  }, []);
  
  // 渲染主界面
  const renderMainTab = () => (
    <div className="main-content">
      <div className="roll-button-container">
        <button 
          className={`roll-button ${player.rollTimer === 0 ? 'ready' : ''}`} 
          onClick={handleRoll}
          disabled={player.rollTimer > 0}
        >
          {getText('掷出', 'Roll')} {player.rollTimer > 0 ? `(${player.rollTimer.toFixed(1)}s)` : getText('(就绪)', '(Ready)')}
        </button>
      </div>

      <div className="upgrades-section">
        <h3>{getText('当前周期升级', 'Current Cycle Upgrades')}</h3>
        <div className="upgrades">
          <div className="upgrade-item" onClick={handleUpgradeLuck}>
            <div className="upgrade-title">{getText('幸运', 'Luck')}</div>
            <div className="upgrade-description">
              {player.luck.toFixed(1)}x -&gt; {(player.luck * 2.5).toFixed(1)}x
            </div>
            <div className="upgrade-price">
              {formatNumber(player.upgrades.luck.price)} {getText('微光', 'Shimmer')}
            </div>
          </div>

          <div className="upgrade-item" onClick={handleUpgradeInterval}>
            <div className="upgrade-title">{getText('间隔', 'Interval')}</div>
            <div className="upgrade-description">
              {player.rollInterval.toFixed(1)}s -&gt; {(player.rollInterval * 0.85).toFixed(1)}s
            </div>
            <div className="upgrade-price">
              {formatNumber(player.upgrades.interval.price)} {getText('微光', 'Shimmer')}
            </div>
          </div>

          <div className="upgrade-item" onClick={handleUpgradeShimmer}>
            <div className="upgrade-title">{getText('微光', 'Shimmer')}</div>
            <div className="upgrade-description">
              {player.shimmerMulti.toFixed(1)}x -&gt; {(player.shimmerMulti * 2).toFixed(1)}x
            </div>
            <div className="upgrade-price">
              {formatNumber(player.upgrades.shimmer.price)} {getText('微光', 'Shimmer')}
            </div>
          </div>
        </div>
      </div>

      <div className="upgrades-section">
        <h3>{getText('全局升级', 'Global Upgrades')}</h3>
        <div className="upgrades">
          <div className="upgrade-item global" onClick={handleUpgradeGlobalLuck}>
            <div className="upgrade-title">{getText('全局幸运', 'Global Luck')}</div>
            <div className="upgrade-description">
              {player.globalLuck.toFixed(1)}x -&gt; {(player.globalLuck + 0.1).toFixed(1)}x
            </div>
            <div className="upgrade-price">
              {player.globalUpgrades.luck.price} {getText('成就点', 'AP')}
            </div>
          </div>

          <div className="upgrade-item global" onClick={handleUpgradeGlobalInterval}>
            <div className="upgrade-title">{getText('全局间隔', 'Global Interval')}</div>
            <div className="upgrade-description">
              {player.globalIntervalReduction.toFixed(2)}x -&gt; {(player.globalIntervalReduction + 0.05).toFixed(2)}x
            </div>
            <div className="upgrade-price">
              {player.globalUpgrades.interval.price} {getText('成就点', 'AP')}
            </div>
          </div>

          <div className="upgrade-item global" onClick={handleUpgradeGlobalShimmer}>
            <div className="upgrade-title">{getText('全局微光', 'Global Shimmer')}</div>
            <div className="upgrade-description">
              {player.globalShimmerMulti.toFixed(1)}x -&gt; {(player.globalShimmerMulti + 0.2).toFixed(1)}x
            </div>
            <div className="upgrade-price">
              {player.globalUpgrades.shimmer.price} {getText('成就点', 'AP')}
            </div>
          </div>
        </div>
      </div>

      <div className="recent-rolls">
        <h3>{getText('最近 10次 投掷', 'Last 10 Rolls')}</h3>
        <div className="rolls-list">
          {player.last10Rolls.map((roll, index) => (
            <div key={index} className="roll-item" style={{ color: roll.color }}>
              <Badge rarityId={roll.id} size={30} className="roll-badge" />
              <span className="roll-text">
                {player.settings.language === 'zh' ? roll.rarity : getRarityName(roll.id)} - {(1 / roll.chance).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="best-roll">
        <h3>{getText('最佳投掷', 'Best Roll')}</h3>
        <div className="roll-item" style={{ color: player.bestRoll.color }}>
          {player.bestRoll.id > 0 && <Badge rarityId={player.bestRoll.id} size={40} className="best-roll-badge" />}
          <span className="roll-text">
            {player.settings.language === 'zh' ? player.bestRoll.rarity : getRarityName(player.bestRoll.id)} - {(1 / player.bestRoll.chance).toFixed(0)}
          </span>
        </div>
      </div>

      {player.bestRoll.id >= 7 && (
        <div className="rebirth-button-container">
          <button className="rebirth-button" onClick={handleRebirth}>
            {getText('重生', 'Rebirth')} (+{calculateRebirthPoints(player.bestRoll.id)} {getText('成就点', 'AP')})
          </button>
        </div>
      )}
    </div>
  );

  // 渲染索引界面
  const renderIndexTab = () => (
    <div className="index-content">
      <div className="index-list">
        {player.totalRarities.map((count, index) => {
          // 检查是否已发现该稀有度
          const isDiscovered = count > 0;
          // 获取稀有度信息
          const rarity = RARITIES[index];
          // 获取稀有度名称（根据语言）
          const rarityName = isDiscovered 
            ? (player.settings.language === 'zh' ? rarity.rarity : rarity.rarityEn)
            : getText('等待发现...', 'Waiting to be discovered...');
          // 计算概率显示
          const chanceDisplay = isDiscovered ? ` - ${(1 / rarity.chance).toFixed(0)}` : '';
          
          return (
            <div key={index} className="index-item">
              {isDiscovered && <Badge rarityId={index + 1} size={36} className="index-badge" />}
              <div className="index-title" style={{ color: isDiscovered ? rarity.color : '#a4a4ac' }}>
                #{index + 1} - {rarityName}{chanceDisplay}
              </div>
              <div className="index-count">{count || 0}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // 渲染成就界面
  const renderAchievementsTab = () => {
    const { unlockedAchievements, inProgressAchievements, getProgress, getGoal } = getAchievementData(player);
    
    return (
      <AchievementTab
        unlockedAchievements={unlockedAchievements}
        inProgressAchievements={inProgressAchievements}
        getProgress={getProgress}
        getGoal={getGoal}
        language={player.settings.language}
      />
    );
  };

  // 渲染统计界面
  const renderStatsTab = () => (
    <div className="stats-content">
      <h3>{getText('统计', 'Statistics')}</h3>
      
      <div className="stats-section">
        <h4>{getText('总体统计', 'Overall Statistics')}</h4>
        <div className="stats-row">
          <div className="stats-label">{getText('游戏总时长', 'Total Game Time')}</div>
          <div className="stats-value">
            {formatGameTime(Date.now() - player.gameStartTime)}
          </div>
        </div>
        <div className="stats-row">
          <div className="stats-label">{getText('总掷出次数', 'Total Rolls')}</div>
          <div className="stats-value">{player.totalRolls}</div>
        </div>
        <div className="stats-row">
          <div className="stats-label">{getText('当前周期掷出次数', 'Current Cycle Rolls')}</div>
          <div className="stats-value">{player.currentCycleRolls}</div>
        </div>
        <div className="stats-row">
          <div className="stats-label">{getText('总重生次数', 'Total Rebirths')}</div>
          <div className="stats-value">{player.totalRebirths}</div>
        </div>
      </div>
      
      <div className="stats-section">
        <h4>{getText('当前周期统计', 'Current Cycle Statistics')}</h4>
        <div className="stats-row">
          <div className="stats-label">{getText('当前周期开始时间', 'Current Cycle Start Time')}</div>
          <div className="stats-value">
            {formatGameTime(Date.now() - player.currentCycleStartTime)}
          </div>
        </div>
        <div className="stats-row">
          <div className="stats-label">{getText('幸运等级', 'Luck Level')}</div>
          <div className="stats-value">{player.upgrades.luck.level}</div>
        </div>
        <div className="stats-row">
          <div className="stats-label">{getText('间隔等级', 'Interval Level')}</div>
          <div className="stats-value">{player.upgrades.interval.level}</div>
        </div>
        <div className="stats-row">
          <div className="stats-label">{getText('微光等级', 'Shimmer Level')}</div>
          <div className="stats-value">{player.upgrades.shimmer.level}</div>
        </div>
      </div>
      
      <div className="stats-section">
        <h4>{getText('全局升级统计', 'Global Upgrade Statistics')}</h4>
        <div className="stats-row">
          <div className="stats-label">{getText('全局幸运等级', 'Global Luck Level')}</div>
          <div className="stats-value">{player.globalUpgrades.luck.level}</div>
        </div>
        <div className="stats-row">
          <div className="stats-label">{getText('全局间隔等级', 'Global Interval Level')}</div>
          <div className="stats-value">{player.globalUpgrades.interval.level}</div>
        </div>
        <div className="stats-row">
          <div className="stats-label">{getText('全局微光等级', 'Global Shimmer Level')}</div>
          <div className="stats-value">{player.globalUpgrades.shimmer.level}</div>
        </div>
      </div>
    </div>
  );

  // 渲染选项界面
  const renderOptionsTab = () => (
    <OptionsTab
      player={player}
      onUpdatePlayer={setPlayer}
      onSaveGame={handleSaveGame}
      onLoadGame={handleLoadGame}
    />
  );
  
  // 格式化游戏时间
  const formatGameTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}${getText('天', 'd')} ${hours % 24}${getText('小时', 'h')}`;
    } else if (hours > 0) {
      return `${hours}${getText('小时', 'h')} ${minutes % 60}${getText('分钟', 'm')}`;
    } else {
      return `${minutes}${getText('分钟', 'm')} ${seconds % 60}${getText('秒', 's')}`;
    }
  };
  
  // 渲染离线进度提示
  const renderOfflineProgress = () => {
    if (!showOfflineProgress) return null;
    
    const timeOfflineFormatted = formatGameTime(offlineProgress.timeOffline);
    
    return (
      <div className="offline-progress-modal">
        <div className="offline-progress-content">
          <h3>{getText('离线进度', 'Offline Progress')}</h3>
          <div className="offline-progress-info">
            <div>{getText('离线时长', 'Time Offline')}: {timeOfflineFormatted}</div>
            <div>{getText('掷出次数', 'Rolls Made')}: {offlineProgress.rollsMade}</div>
            <div>{getText('获得微光', 'Shimmer Gained')}: {formatNumber(offlineProgress.shimmerGained)}</div>
          </div>
          <button className="option-button" onClick={handleCloseOfflineProgress}>
            {getText('确定', 'OK')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="game-container">
      {renderOfflineProgress()}
      
      <div className="game-header">
        <h1>{getText('稀有度徽章', 'Rarity Badge')}</h1>
        <div className="resources-display">
          <div className="shimmer-display">
            {formatNumber(player.shimmer)} {getText('微光', 'Shimmer')}
          </div>
          <div className="ap-display">
            {player.achievementPoints} {getText('成就点', 'AP')}
          </div>
        </div>
      </div>

      <div className="roll-display">
        <div className="roll-result">
          {player.last10Rolls.length > 0 && (
            <>
              <Badge rarityId={player.last10Rolls[0].id} size={60} className="current-roll-badge" />
              <span className="roll-text">
                {getText('掷出', 'Rolled')} {player.settings.language === 'zh' 
                  ? player.last10Rolls[0].rarity 
                  : getRarityName(player.last10Rolls[0].id)}
              </span>
            </>
          )}
          {player.last10Rolls.length === 0 && (
            <span>{getText('尚未掷出', 'Not rolled yet')}</span>
          )}
        </div>
      </div>

      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'main' ? 'active' : ''}`} 
          onClick={() => setActiveTab('main')}
        >
          {getText('主界面', 'Main')}
        </div>
        <div 
          className={`tab ${activeTab === 'index' ? 'active' : ''}`} 
          onClick={() => setActiveTab('index')}
        >
          {getText('索引', 'Index')}
        </div>
        <div 
          className={`tab ${activeTab === 'achievements' ? 'active' : ''}`} 
          onClick={() => setActiveTab('achievements')}
        >
          {getText('成就', 'Achievements')}
        </div>
        <div 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`} 
          onClick={() => setActiveTab('stats')}
        >
          {getText('统计', 'Stats')}
        </div>
        <div 
          className={`tab ${activeTab === 'options' ? 'active' : ''}`} 
          onClick={() => setActiveTab('options')}
        >
          {getText('选项', 'Options')}
        </div>
      </div>

      {activeTab === 'main' && renderMainTab()}
      {activeTab === 'index' && renderIndexTab()}
      {activeTab === 'achievements' && renderAchievementsTab()}
      {activeTab === 'stats' && renderStatsTab()}
      {activeTab === 'options' && renderOptionsTab()}
    </div>
  );
};

export default Game;
