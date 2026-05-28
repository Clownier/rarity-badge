import { Achievement, PlayerState } from '../types';
import { ACHIEVEMENTS } from '../constants';

// 检查成就解锁
export const checkAchievements = (state: PlayerState): PlayerState => {
  // 复制状态以避免直接修改
  const newState = { ...state };
  let achievementPointsGained = 0;
  
  // 初始化成就对象（如果不存在）
  if (!newState.achievements) {
    newState.achievements = {};
  }
  
  // 遍历所有成就
  ACHIEVEMENTS.forEach(achievement => {
    // 如果成就已解锁，跳过
    if (newState.achievements[achievement.id]?.unlocked) {
      return;
    }
    
    // 初始化成就（如果不存在）
    if (!newState.achievements[achievement.id]) {
      newState.achievements[achievement.id] = {
        unlocked: false,
        progress: 0,
        goal: achievement.condition.value
      };
    }
    
    // 更新成就进度
    let progress = 0;
    
    switch (achievement.condition.type) {
      case 'rarity':
        // 检查是否发现特定稀有度 - 修复首次发现成就逻辑
        const rarityId = achievement.condition.value;
        // 只要数量大于0就算发现
        progress = newState.totalRarities[rarityId - 1] > 0 ? 1 : 0;
        break;
        
      case 'quantity':
        // 检查特定稀有度的数量
        const rarityIdFromId = parseInt(achievement.id.split('_')[1]);
        progress = newState.totalRarities[rarityIdFromId - 1];
        break;
        
      case 'total_rolls':
        // 检查总掷出次数
        progress = newState.totalRolls;
        break;
        
      case 'total_rebirths':
        // 检查总重生次数
        progress = newState.totalRebirths;
        break;
        
      default:
        break;
    }
    
    // 更新进度
    newState.achievements[achievement.id].progress = progress;
    
    // 检查是否达成成就
    if (progress >= achievement.condition.value && !newState.achievements[achievement.id].unlocked) {
      // 标记为已解锁
      newState.achievements[achievement.id].unlocked = true;
      // 增加成就点
      achievementPointsGained += achievement.reward;
      
      // 可以在这里添加成就解锁通知逻辑
      console.log(`Achievement unlocked: ${achievement.id}, +${achievement.reward} points`);
    }
  });
  
  // 增加成就点
  if (achievementPointsGained > 0) {
    newState.achievementPoints += achievementPointsGained;
  }
  
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
