import { Achievement, PlayerState } from '../types';
import { ACHIEVEMENTS } from '../constants';

// 检查成就解锁
export const checkAchievements = (state: PlayerState): PlayerState => {
  const newState = { ...state };
  
  if (!newState.achievements) {
    newState.achievements = {};
  }
  
  ACHIEVEMENTS.forEach(achievement => {
    if (newState.achievements[achievement.id]?.unlocked) {
      return;
    }
    
    if (!newState.achievements[achievement.id]) {
      newState.achievements[achievement.id] = {
        unlocked: false,
        progress: 0,
        goal: achievement.condition.value
      };
    }
    
    let progress = 0;
    
    switch (achievement.condition.type) {
      case 'rarity':
        const rarityId = achievement.condition.value;
        progress = newState.totalRarities[rarityId - 1] > 0 ? 1 : 0;
        break;
        
      case 'quantity':
        const rarityIdFromId = parseInt(achievement.id.split('_')[1]);
        progress = newState.totalRarities[rarityIdFromId - 1];
        break;
        
      case 'total_rolls':
        progress = newState.totalRolls;
        break;
        
      case 'total_rebirths':
        progress = newState.totalRebirths;
        break;
        
      default:
        break;
    }
    
    newState.achievements[achievement.id].progress = progress;
    
    if (progress >= achievement.condition.value && !newState.achievements[achievement.id].unlocked) {
      newState.achievements[achievement.id].unlocked = true;
      console.log(`Achievement unlocked: ${achievement.id}`);
    }
  });
  
  return newState;
};

// 获取已解锁的成就
export const getUnlockedAchievements = (state: PlayerState): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => 
    state.achievements[achievement.id]?.unlocked
  );
};

// 获取进行中的成就
export const getInProgressAchievements = (state: PlayerState): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => 
    !state.achievements[achievement.id]?.unlocked
  );
};

// 获取成就进度
export const getAchievementProgress = (state: PlayerState, achievementId: string): number => {
  if (!state.achievements[achievementId]) {
    return 0;
  }
  
  return state.achievements[achievementId].progress;
};

// 获取成就目标
export const getAchievementGoal = (state: PlayerState, achievementId: string): number => {
  if (!state.achievements[achievementId]) {
    return 0;
  }
  
  return state.achievements[achievementId].goal;
};

// 计算成就完成百分比
export const getAchievementPercentage = (state: PlayerState, achievementId: string): number => {
  const progress = getAchievementProgress(state, achievementId);
  const goal = getAchievementGoal(state, achievementId);
  
  if (goal === 0) {
    return 0;
  }
  
  return Math.min(100, (progress / goal) * 100);
};
