import { PlayerState, GameSettings } from '../types';
import { 
  RARITIES, 
  INITIAL_UPGRADE_PRICES, 
  INITIAL_GLOBAL_UPGRADE_PRICES,
  UPGRADE_MULTIPLIERS,
  PRICE_GROWTH_RATES,
  GLOBAL_PRICE_GROWTH_RATE,
  GLOBAL_UPGRADE_EFFECTS,
  DEFAULT_SETTINGS
} from '../constants';

// 初始化玩家状态
export const initializePlayerState = (): PlayerState => {
  return {
    // 基础数据
    shimmer: 0,
    achievementPoints: 0,
    totalRolls: 0,
    currentCycleRolls: 0,
    totalRebirths: 0,
    gameStartTime: Date.now(),
    currentCycleStartTime: Date.now(),
    
    // 当前周期升级
    luck: 1,
    rollInterval: 5,
    shimmerMulti: 1,
    
    // 当前周期升级价格
    upgrades: {
      luck: { level: 0, price: INITIAL_UPGRADE_PRICES.luck },
      interval: { level: 0, price: INITIAL_UPGRADE_PRICES.interval },
      shimmer: { level: 0, price: INITIAL_UPGRADE_PRICES.shimmer }
    },
    
    // 全局升级
    globalLuck: 1,
    globalIntervalReduction: 1,
    globalShimmerMulti: 1,
    
    // 全局升级价格
    globalUpgrades: {
      luck: { level: 0, price: INITIAL_GLOBAL_UPGRADE_PRICES.luck },
      interval: { level: 0, price: INITIAL_GLOBAL_UPGRADE_PRICES.interval },
      shimmer: { level: 0, price: INITIAL_GLOBAL_UPGRADE_PRICES.shimmer }
    },
    
    // 掷出记录
    rollTimer: 0,
    last10Rolls: [],
    
    // 最佳掷出
    bestRoll: {
      id: 0,
      rarity: "",
      chance: 0,
      color: "#ffffff"
    },
    
    // 稀有度发现记录
    totalRarities: Array(RARITIES.length).fill(0),
    
    // 成就系统
    achievements: {},
    
    // 设置
    settings: DEFAULT_SETTINGS,
    
    // 排行榜参与状态
    leaderboardParticipation: true,
    
    // 离线时间记录
    lastOnlineTime: Date.now()
  };
};

// 更新游戏状态
export const updateGameState = (state: PlayerState): PlayerState => {
  // 复制状态以避免直接修改
  const newState = { ...state };
  
  // 更新掷出计时器
  if (newState.rollTimer > 0) {
    newState.rollTimer = Math.max(0, newState.rollTimer - (1 / 30));
  }
  
  // 更新最后在线时间
  newState.lastOnlineTime = Date.now();
  
  return newState;
};

// 掷出操作
export const roll = (state: PlayerState): PlayerState => {
  // 如果计时器不为0，不能掷出
  if (state.rollTimer > 0) {
    return state;
  }
  
  // 复制状态以避免直接修改
  const newState = { ...state };
  
  // 应用全局间隔减少
  const effectiveInterval = newState.rollInterval / newState.globalIntervalReduction;
  
  // 设置掷出计时器
  newState.rollTimer = effectiveInterval;
  
  // 增加总掷出次数和当前周期掷出次数
  newState.totalRolls++;
  newState.currentCycleRolls++;
  
  // 应用幸运值和全局幸运值
  const effectiveLuck = newState.luck * newState.globalLuck;
  
  // 随机选择稀有度 - 修复幸运值计算逻辑，与原始程序保持一致
  let selectedRarity = null;
  const random = Math.random();
  
  // 从最稀有的开始检查，确保与原始Rarity Toy逻辑一致
  for (let i = RARITIES.length - 1; i >= 0; i--) {
    const rarity = RARITIES[i];
    if (random < rarity.chance * effectiveLuck) {
      selectedRarity = rarity;
      break;
    }
  }
  
  // 如果没有选中任何稀有度，选择最常见的
  if (!selectedRarity) {
    selectedRarity = RARITIES[0];
  }
  
  // 增加该稀有度的计数
  newState.totalRarities[selectedRarity.id - 1]++;
  
  // 添加到最近10次掷出记录
  const rollResult = {
    id: selectedRarity.id,
    rarity: selectedRarity.rarity,
    chance: selectedRarity.chance,
    color: selectedRarity.color
  };
  
  newState.last10Rolls.unshift(rollResult);
  if (newState.last10Rolls.length > 10) {
    newState.last10Rolls.pop();
  }
  
  // 更新最佳掷出
  if (selectedRarity.id > newState.bestRoll.id) {
    newState.bestRoll = rollResult;
  }
  
  // 增加微光 - 修改为2的N次方公式
  const shimmerGain = Math.pow(2, selectedRarity.id) * newState.shimmerMulti * newState.globalShimmerMulti;
  newState.shimmer += shimmerGain;
  
  return newState;
};

// 升级幸运
export const upgradeLuck = (state: PlayerState): PlayerState => {
  // 检查是否有足够的微光
  if (state.shimmer < state.upgrades.luck.price) {
    return state;
  }
  
  // 复制状态以避免直接修改
  const newState = { ...state };
  
  // 扣除微光
  newState.shimmer -= newState.upgrades.luck.price;
  
  // 增加幸运值
  newState.luck *= UPGRADE_MULTIPLIERS.luck;
  
  // 更新等级和价格
  newState.upgrades.luck.level++;
  newState.upgrades.luck.price *= PRICE_GROWTH_RATES.luck;
  
  return newState;
};

// 升级间隔
export const upgradeInterval = (state: PlayerState): PlayerState => {
  // 检查是否有足够的微光
  if (state.shimmer < state.upgrades.interval.price) {
    return state;
  }
  
  // 复制状态以避免直接修改
  const newState = { ...state };
  
  // 扣除微光
  newState.shimmer -= newState.upgrades.interval.price;
  
  // 减少间隔时间
  newState.rollInterval *= UPGRADE_MULTIPLIERS.interval;
  
  // 更新等级和价格
  newState.upgrades.interval.level++;
  newState.upgrades.interval.price *= PRICE_GROWTH_RATES.interval;
  
  return newState;
};

// 升级微光
export const upgradeShimmer = (state: PlayerState): PlayerState => {
  // 检查是否有足够的微光
  if (state.shimmer < state.upgrades.shimmer.price) {
    return state;
  }
  
  // 复制状态以避免直接修改
  const newState = { ...state };
  
  // 扣除微光
  newState.shimmer -= newState.upgrades.shimmer.price;
  
  // 增加微光倍率
  newState.shimmerMulti *= UPGRADE_MULTIPLIERS.shimmer;
  
  // 更新等级和价格
  newState.upgrades.shimmer.level++;
  newState.upgrades.shimmer.price *= PRICE_GROWTH_RATES.shimmer;
  
  return newState;
};

// 升级全局幸运
export const upgradeGlobalLuck = (state: PlayerState): PlayerState => {
  // 检查是否有足够的成就点
  if (state.achievementPoints < state.globalUpgrades.luck.price) {
    return state;
  }
  
  // 复制状态以避免直接修改
  const newState = { ...state };
  
  // 扣除成就点
  newState.achievementPoints -= newState.globalUpgrades.luck.price;
  
  // 增加全局幸运值
  newState.globalLuck += GLOBAL_UPGRADE_EFFECTS.luck;
  
  // 更新等级和价格
  newState.globalUpgrades.luck.level++;
  newState.globalUpgrades.luck.price *= GLOBAL_PRICE_GROWTH_RATE;
  
  return newState;
};

// 升级全局间隔 - 修复全局间隔升级逻辑，确保减少投掷间隔
export const upgradeGlobalInterval = (state: PlayerState): PlayerState => {
  // 检查是否有足够的成就点
  if (state.achievementPoints < state.globalUpgrades.interval.price) {
    return state;
  }
  
  // 复制状态以避免直接修改
  const newState = { ...state };
  
  // 扣除成就点
  newState.achievementPoints -= newState.globalUpgrades.interval.price;
  
  // 增加全局间隔减少系数 - 这会减少投掷间隔时间
  newState.globalIntervalReduction += GLOBAL_UPGRADE_EFFECTS.interval;
  
  // 更新等级和价格
  newState.globalUpgrades.interval.level++;
  newState.globalUpgrades.interval.price *= GLOBAL_PRICE_GROWTH_RATE;
  
  return newState;
};

// 升级全局微光
export const upgradeGlobalShimmer = (state: PlayerState): PlayerState => {
  // 检查是否有足够的成就点
  if (state.achievementPoints < state.globalUpgrades.shimmer.price) {
    return state;
  }
  
  // 复制状态以避免直接修改
  const newState = { ...state };
  
  // 扣除成就点
  newState.achievementPoints -= newState.globalUpgrades.shimmer.price;
  
  // 增加全局微光倍率
  newState.globalShimmerMulti += GLOBAL_UPGRADE_EFFECTS.shimmer;
  
  // 更新等级和价格
  newState.globalUpgrades.shimmer.level++;
  newState.globalUpgrades.shimmer.price *= GLOBAL_PRICE_GROWTH_RATE;
  
  return newState;
};

// 重生
export const rebirth = (state: PlayerState): PlayerState => {
  // 检查是否满足重生条件
  if (state.bestRoll.id < 7) {
    return state;
  }
  
  // 计算重生获得的成就点
  const rebirthPoints = calculateRebirthPoints(state.bestRoll.id);
  
  // 复制状态以避免直接修改
  const newState = { ...state };
  
  // 增加成就点
  newState.achievementPoints += rebirthPoints;
  
  // 增加总重生次数
  newState.totalRebirths++;
  
  // 重置当前周期数据
  newState.shimmer = 0;
  newState.currentCycleRolls = 0;
  newState.currentCycleStartTime = Date.now();
  
  // 重置当前周期升级
  newState.luck = 1;
  newState.rollInterval = 5;
  newState.shimmerMulti = 1;
  
  // 重置当前周期升级价格
  newState.upgrades = {
    luck: { level: 0, price: INITIAL_UPGRADE_PRICES.luck },
    interval: { level: 0, price: INITIAL_UPGRADE_PRICES.interval },
    shimmer: { level: 0, price: INITIAL_UPGRADE_PRICES.shimmer }
  };
  
  // 重置掷出记录
  newState.rollTimer = 0;
  newState.last10Rolls = [];
  
  // 重置最佳掷出
  newState.bestRoll = {
    id: 0,
    rarity: "",
    chance: 0,
    color: "#ffffff"
  };
  
  return newState;
};

// 计算重生可获得的成就点
export const calculateRebirthPoints = (bestRollId: number): number => {
  return Math.max(1, Math.floor((bestRollId - 6) / 2));
};

// 更新游戏设置
export const updateSettings = (state: PlayerState, newSettings: Partial<GameSettings>): PlayerState => {
  // 复制状态以避免直接修改
  const newState = { ...state };
  
  // 更新设置
  newState.settings = {
    ...newState.settings,
    ...newSettings
  };
  
  return newState;
};

// 格式化数字
export const formatNumber = (num: number): string => {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + 'T';
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  } else {
    return num.toFixed(2);
  }
};
