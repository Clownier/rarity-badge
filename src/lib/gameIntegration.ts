import { PlayerState } from '../types';
import { 
  roll, 
  rebirth
} from '../lib/gameLogic';
import { checkAchievements, getUnlockedAchievements, getInProgressAchievements, getAchievementProgress, getAchievementGoal } from '../lib/achievementSystem';

// 集成成就系统到游戏主循环
export const updateGameStateWithAchievements = (state: PlayerState): PlayerState => {
  // 先更新游戏状态
  let newState = { ...state };
  
  // 更新掷出计时器
  if (newState.rollTimer > 0) {
    newState.rollTimer = Math.max(0, newState.rollTimer - (1 / 30));
  }
  
  // 如果启用了自动掷出且计时器为0，执行掷出
  if (newState.settings.autoRoll && newState.rollTimer === 0) {
    newState = rollWithAchievements(newState);
  }
  
  // 然后检查成就
  newState = checkAchievements(newState);
  
  return newState;
};

// 集成成就系统到掷出操作
export const rollWithAchievements = (state: PlayerState): PlayerState => {
  // 先执行掷出
  let newState = roll(state);
  
  // 然后检查成就
  newState = checkAchievements(newState);
  
  return newState;
};

// 集成成就系统到重生操作
export const rebirthWithAchievements = (state: PlayerState): PlayerState => {
  // 先执行重生
  let newState = rebirth(state);
  
  // 然后检查成就
  newState = checkAchievements(newState);
  
  return newState;
};

// 获取成就相关数据
export const getAchievementData = (state: PlayerState) => {
  return {
    unlockedAchievements: getUnlockedAchievements(state),
    inProgressAchievements: getInProgressAchievements(state),
    getProgress: (id: string) => getAchievementProgress(state, id),
    getGoal: (id: string) => getAchievementGoal(state, id)
  };
};
