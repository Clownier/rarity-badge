import { PlayerState } from '../types';
import CryptoJS from 'crypto-js';

// 密钥（实际应用中应该使用更安全的方式存储）
const ENCRYPTION_KEY = 'rarity-badge-game-secret-key';

// 保存游戏到localStorage
export const saveGame = (state: PlayerState): void => {
  try {
    const gameData = JSON.stringify(state);
    localStorage.setItem('rarityBadgeGameSave', gameData);
  } catch (error) {
    console.error('保存游戏失败:', error);
  }
};

// 从localStorage加载游戏
export const loadGame = (): PlayerState | null => {
  try {
    const gameData = localStorage.getItem('rarityBadgeGameSave');
    if (!gameData) return null;
    
    return JSON.parse(gameData) as PlayerState;
  } catch (error) {
    console.error('加载游戏失败:', error);
    return null;
  }
};

// 加密存档数据
export const encryptSaveData = (state: PlayerState): string => {
  try {
    // 创建不包含玩家昵称的存档副本
    const saveData = { ...state };
    
    // 转换为JSON字符串
    const jsonData = JSON.stringify(saveData);
    
    // 使用AES加密
    const encryptedData = CryptoJS.AES.encrypt(jsonData, ENCRYPTION_KEY).toString();
    
    return encryptedData;
  } catch (error) {
    console.error('加密存档失败:', error);
    return '';
  }
};

// 解密存档数据
export const decryptSaveData = (encryptedData: string): PlayerState | null => {
  try {
    // 使用AES解密
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      throw new Error('解密后数据为空');
    }
    
    // 解析JSON
    const saveData = JSON.parse(decryptedData) as PlayerState;
    
    // 导入的存档不参与排行榜
    saveData.leaderboardParticipation = false;
    
    return saveData;
  } catch (error) {
    console.error('解密存档失败:', error);
    return null;
  }
};

// 初始化游戏数据（清除所有本地数据）
export const initializeGameData = (): void => {
  try {
    // 清除游戏存档
    localStorage.removeItem('rarityBadgeGameSave');
    
    // 清除排行榜参与状态
    localStorage.removeItem('rarityBadgeLeaderboardNickname');
    
    // 清除其他相关数据
    localStorage.removeItem('rarityBadgeGameSettings');
    
    // 清除所有以rarityBadge开头的数据
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('rarityBadge')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('初始化游戏数据失败:', error);
  }
};

// 自动保存游戏
export const setupAutoSave = (
  state: PlayerState,
  saveFunction: (state: PlayerState) => void
): NodeJS.Timeout => {
  const interval = state.settings.autoSaveInterval * 1000; // 转换为毫秒
  
  return setInterval(() => {
    saveFunction(state);
  }, interval);
};

// 计算离线进度
export const calculateOfflineProgress = (
  state: PlayerState,
  currentTime: number
): { 
  shimmerGained: number;
  rollsMade: number;
  timeOffline: number;
} => {
  const lastOnlineTime = state.lastOnlineTime;
  const timeOffline = currentTime - lastOnlineTime;
  
  // 如果离线时间很短，不计算离线进度
  if (timeOffline < 60000) { // 小于1分钟
    return { shimmerGained: 0, rollsMade: 0, timeOffline: 0 };
  }
  
  // 计算离线期间可能的掷出次数
  const effectiveInterval = state.rollInterval / state.globalIntervalReduction;
  const rollsMade = Math.floor(timeOffline / 1000 / effectiveInterval);
  
  // 计算平均每次掷出获得的微光
  // 这里使用一个简化的计算方式，实际游戏中可能需要更复杂的计算
  const averageRarityValue = 1.5; // 假设平均稀有度值
  const averageShimmerPerRoll = 
    averageRarityValue * state.shimmerMulti * state.globalShimmerMulti;
  
  // 计算离线获得的总微光（应用离线效率系数0.8）
  const shimmerGained = rollsMade * averageShimmerPerRoll * 0.8;
  
  return {
    shimmerGained,
    rollsMade,
    timeOffline
  };
};

// 应用离线进度
export const applyOfflineProgress = (
  state: PlayerState,
  offlineProgress: {
    shimmerGained: number;
    rollsMade: number;
    timeOffline: number;
  }
): PlayerState => {
  const newState = { ...state };
  
  // 增加微光
  newState.shimmer += offlineProgress.shimmerGained;
  
  // 增加总掷出次数和当前周期掷出次数
  newState.totalRolls += offlineProgress.rollsMade;
  newState.currentCycleRolls += offlineProgress.rollsMade;
  
  // 更新最后在线时间
  newState.lastOnlineTime = Date.now();
  
  return newState;
};
