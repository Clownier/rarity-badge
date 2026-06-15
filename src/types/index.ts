// 游戏中的稀有度类型定义
export interface Rarity {
  id: number;
  rarity: string;
  rarityEn: string;
  chance: number;
  color: string;
  badgeDescription: string;
  badgeDescriptionEn: string;
}

// 转生稀有度
export interface RegenRarity {
  id: number;
  rarity: string;
  rarityEn: string;
  chance: number;
  color: string;
}

// 掷出结果
export interface RollResult {
  id: number;
  rarity: string;
  chance: number;
  color: string;
}

// 玩家状态接口
export interface PlayerState {
  // 基础数据
  shimmer: number;
  achievementPoints: number;
  totalRolls: number;
  currentCycleRolls: number;
  totalRebirths: number;
  gameStartTime: number;
  currentCycleStartTime: number;
  
  // 当前周期升级
  luck: number;
  rollInterval: number;
  shimmerMulti: number;
  
  // 当前周期升级价格
  upgrades: {
    luck: { level: number; price: number };
    interval: { level: number; price: number };
    shimmer: { level: number; price: number };
  };
  
  // 转生相关
  regenLuck: number;
  regenShimmerMulti: number;
  regenRLuck: number;
  regenGlistenMulti: number;
  
  // 转生升级价格
  regenUpgrades: {
    luck: { level: number; price: number };
    shimmer: { level: number; price: number };
    regenLuck: { level: number; price: number };
    achievementPoints: { level: number; price: number };
  };
  
  // 转生稀有度记录
  totalRegenRarities: number[];
  last10RegenRolls: RollResult[];
  bestRegenRoll: RollResult;
  
  // 功能解锁
  unlocked: { regen: boolean };
  
  // 掷出记录
  rollTimer: number;
  last10Rolls: RollResult[];
  
  // 最佳掷出
  bestRoll: RollResult;
  
  // 稀有度发现记录
  totalRarities: number[];
  
  // 成就系统
  achievements: {
    [key: string]: {
      unlocked: boolean;
      progress: number;
      goal: number;
    };
  };
  
  // 设置
  settings: {
    language: 'zh' | 'en';
    autoRoll: boolean;
    soundEnabled: boolean;
    volume: number;
    autoSaveInterval: number;
  };
  
  // 排行榜参与状态
  leaderboardParticipation: boolean;
  
  // 离线时间记录
  lastOnlineTime: number;
}

// 成就类型
export interface Achievement {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  type: 'discovery' | 'quantity' | 'progress';
  condition: {
    type: string;
    value: number;
  };
  reward: number;
  icon: string;
}

// 游戏设置
export interface GameSettings {
  language: 'zh' | 'en';
  autoRoll: boolean;
  soundEnabled: boolean;
  volume: number;
  autoSaveInterval: number;
}
