import { PlayerState, RollResult, GameSettings } from '../types';
import { 
  RARITIES, REGENRARITIES,
  INITIAL_UPGRADE_PRICES,
  INITIAL_REGEN_UPGRADE_PRICES,
  UPGRADE_MULTIPLIERS,
  PRICE_GROWTH_RATES,
  REGEN_UPGRADE_MULTIPLIERS,
  REGEN_PRICE_GROWTH_RATES,
  DEFAULT_SETTINGS
} from '../constants';

export const initializePlayerState = (): PlayerState => {
  return {
    shimmer: 0,
    achievementPoints: 0,
    totalRolls: 0,
    currentCycleRolls: 0,
    totalRebirths: 0,
    gameStartTime: Date.now(),
    currentCycleStartTime: Date.now(),

    luck: 1,
    rollInterval: 5,
    shimmerMulti: 1,

    upgrades: {
      luck: { level: 0, price: INITIAL_UPGRADE_PRICES.luck },
      interval: { level: 0, price: INITIAL_UPGRADE_PRICES.interval },
      shimmer: { level: 0, price: INITIAL_UPGRADE_PRICES.shimmer }
    },

    regenLuck: 1,
    regenShimmerMulti: 1,
    regenRLuck: 1,
    regenGlistenMulti: 1,

    regenUpgrades: {
      luck: { level: 0, price: INITIAL_REGEN_UPGRADE_PRICES.luck },
      shimmer: { level: 0, price: INITIAL_REGEN_UPGRADE_PRICES.shimmer },
      regenLuck: { level: 0, price: INITIAL_REGEN_UPGRADE_PRICES.regenLuck },
      achievementPoints: { level: 0, price: INITIAL_REGEN_UPGRADE_PRICES.achievementPoints }
    },

    totalRegenRarities: Array(REGENRARITIES.length).fill(0),
    last10RegenRolls: [],
    bestRegenRoll: { id: 0, rarity: "", chance: 0, color: "#e3e3e3" },

    unlocked: { regen: false },

    rollTimer: 0,
    last10Rolls: [],
    bestRoll: { id: 0, rarity: "", chance: 0, color: "#ffffff" },

    totalRarities: Array(RARITIES.length).fill(0),
    achievements: {},
    settings: DEFAULT_SETTINGS,
    leaderboardParticipation: true,
    lastOnlineTime: Date.now()
  };
};

export const updateGameState = (state: PlayerState): PlayerState => {
  const newState = { ...state };
  if (newState.rollTimer > 0) {
    newState.rollTimer = Math.max(0, newState.rollTimer - (1 / 30));
  }
  newState.lastOnlineTime = Date.now();
  return newState;
};

export const roll = (state: PlayerState): PlayerState => {
  if (state.rollTimer > 0) return state;
  const newState = { ...state };
  const effectiveInterval = newState.rollInterval;
  newState.rollTimer = effectiveInterval;
  newState.totalRolls++;
  newState.currentCycleRolls++;
  const effectiveLuck = newState.luck;
  let selectedRarity: { id: number; rarity: string; rarityEn: string; chance: number; color: string } | null = null;
  const random = Math.random();
  for (let i = RARITIES.length - 1; i >= 0; i--) {
    const rarity = RARITIES[i];
    if (random < rarity.chance * effectiveLuck) {
      selectedRarity = rarity;
      break;
    }
  }
  if (!selectedRarity) {
    selectedRarity = RARITIES[0];
  }
  newState.totalRarities[selectedRarity.id - 1]++;
  const rollResult: RollResult = {
    id: selectedRarity.id,
    rarity: selectedRarity.rarity,
    chance: selectedRarity.chance,
    color: selectedRarity.color
  };
  newState.last10Rolls.unshift(rollResult);
  if (newState.last10Rolls.length > 10) {
    newState.last10Rolls.pop();
  }
  if (selectedRarity.id > newState.bestRoll.id) {
    newState.bestRoll = rollResult;
  }
  const shimmerGain = selectedRarity.id * newState.shimmerMulti;
  newState.shimmer += shimmerGain;
  return newState;
};

export const upgradeLuck = (state: PlayerState): PlayerState => {
  if (state.shimmer < state.upgrades.luck.price) return state;
  const newState = { ...state };
  newState.shimmer -= newState.upgrades.luck.price;
  newState.luck *= UPGRADE_MULTIPLIERS.luck;
  newState.upgrades.luck.level++;
  newState.upgrades.luck.price *= PRICE_GROWTH_RATES.luck;
  return newState;
};

export const upgradeInterval = (state: PlayerState): PlayerState => {
  if (state.shimmer < state.upgrades.interval.price) return state;
  const newState = { ...state };
  newState.shimmer -= newState.upgrades.interval.price;
  newState.rollInterval *= UPGRADE_MULTIPLIERS.interval;
  newState.upgrades.interval.level++;
  newState.upgrades.interval.price *= PRICE_GROWTH_RATES.interval;
  return newState;
};

export const upgradeShimmer = (state: PlayerState): PlayerState => {
  if (state.shimmer < state.upgrades.shimmer.price) return state;
  const newState = { ...state };
  newState.shimmer -= newState.upgrades.shimmer.price;
  newState.shimmerMulti *= UPGRADE_MULTIPLIERS.shimmer;
  newState.upgrades.shimmer.level++;
  newState.upgrades.shimmer.price *= PRICE_GROWTH_RATES.shimmer;
  return newState;
};

// --- 转生系统 ---

export const regenerate = (state: PlayerState): PlayerState => {
  if (state.bestRoll.id < 8) return state;
  const newState = { ...state };

  // 转生掷出
  const x = Math.random() / newState.regenRLuck / Math.pow(1.3, newState.bestRoll.id - 7);
  let selectedRegen = REGENRARITIES[0];
  for (let i = REGENRARITIES.length - 1; i >= 0; i--) {
    if (x <= REGENRARITIES[i].chance) {
      selectedRegen = REGENRARITIES[i];
      break;
    }
  }

  // 结算 achievementPoints
  const achievementPointsGain = (selectedRegen.id) * newState.regenGlistenMulti;
  newState.achievementPoints += achievementPointsGain;

  // 记录转生掷出
  const regenResult: RollResult = {
    id: selectedRegen.id,
    rarity: selectedRegen.rarity,
    chance: selectedRegen.chance,
    color: selectedRegen.color
  };
  newState.last10RegenRolls.unshift(regenResult);
  if (newState.last10RegenRolls.length > 10) {
    newState.last10RegenRolls.pop();
  }
  newState.totalRegenRarities[selectedRegen.id - 1]++;
  if (selectedRegen.id > newState.bestRegenRoll.id) {
    newState.bestRegenRoll = regenResult;
  }

  // 增加转生次数
  newState.totalRebirths++;

  // 继承转生属性
  newState.luck = newState.regenLuck;
  newState.shimmerMulti = newState.regenShimmerMulti;

  // 重置周期
  newState.shimmer = 0;
  newState.currentCycleRolls = 0;
  newState.currentCycleStartTime = Date.now();
  newState.rollInterval = 3;
  newState.rollTimer = 0;
  newState.upgrades = {
    luck: { level: 0, price: INITIAL_UPGRADE_PRICES.luck },
    interval: { level: 0, price: INITIAL_UPGRADE_PRICES.interval },
    shimmer: { level: 0, price: INITIAL_UPGRADE_PRICES.shimmer }
  };
  newState.last10Rolls = [];
  newState.bestRoll = { id: 0, rarity: "", chance: 0, color: "#ffffff" };

  return newState;
};

export const upgradeRegenLuck = (state: PlayerState): PlayerState => {
  if (state.achievementPoints < state.regenUpgrades.luck.price) return state;
  const newState = { ...state };
  newState.achievementPoints -= newState.regenUpgrades.luck.price;
  newState.regenLuck *= REGEN_UPGRADE_MULTIPLIERS.luck;
  newState.luck *= REGEN_UPGRADE_MULTIPLIERS.luck;
  newState.regenUpgrades.luck.level++;
  newState.regenUpgrades.luck.price *= REGEN_PRICE_GROWTH_RATES.luck;
  return newState;
};

export const upgradeRegenShimmer = (state: PlayerState): PlayerState => {
  if (state.achievementPoints < state.regenUpgrades.shimmer.price) return state;
  const newState = { ...state };
  newState.achievementPoints -= newState.regenUpgrades.shimmer.price;
  newState.regenShimmerMulti *= REGEN_UPGRADE_MULTIPLIERS.shimmer;
  newState.shimmerMulti *= REGEN_UPGRADE_MULTIPLIERS.shimmer;
  newState.regenUpgrades.shimmer.level++;
  newState.regenUpgrades.shimmer.price *= REGEN_PRICE_GROWTH_RATES.shimmer;
  return newState;
};

export const upgradeRegenRLuck = (state: PlayerState): PlayerState => {
  if (state.achievementPoints < state.regenUpgrades.regenLuck.price) return state;
  const newState = { ...state };
  newState.achievementPoints -= newState.regenUpgrades.regenLuck.price;
  newState.regenRLuck *= REGEN_UPGRADE_MULTIPLIERS.regenLuck;
  newState.regenUpgrades.regenLuck.level++;
  newState.regenUpgrades.regenLuck.price *= REGEN_PRICE_GROWTH_RATES.regenLuck;
  return newState;
};

export const upgradeRegenGlisten = (state: PlayerState): PlayerState => {
  if (state.achievementPoints < state.regenUpgrades.achievementPoints.price) return state;
  const newState = { ...state };
  newState.achievementPoints -= newState.regenUpgrades.achievementPoints.price;
  newState.regenGlistenMulti *= REGEN_UPGRADE_MULTIPLIERS.achievementPoints;
  newState.regenUpgrades.achievementPoints.level++;
  newState.regenUpgrades.achievementPoints.price *= REGEN_PRICE_GROWTH_RATES.achievementPoints;
  return newState;
};

// --- 通用 ---

export const updateSettings = (state: PlayerState, newSettings: Partial<GameSettings>): PlayerState => {
  const newState = { ...state };
  newState.settings = { ...newState.settings, ...newSettings };
  return newState;
};

export const formatNumber = (num: number): string => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
};
