import { PlayerState } from '../types';
import { 
  roll, 
  regenerate
} from '../lib/gameLogic';
import { checkAchievements, getUnlockedAchievements, getInProgressAchievements, getAchievementProgress, getAchievementGoal } from '../lib/achievementSystem';

// 集成成就系统到游戏主循环
export const updateGameStateWithAchievements = (state: PlayerState): PlayerState => {
  let newState = { ...state };
  
  if (newState.rollTimer > 0) {
    newState.rollTimer = Math.max(0, newState.rollTimer - (1 / 30));
  }
  
  if (newState.settings.autoRoll && newState.rollTimer === 0) {
    newState = rollWithAchievements(newState);
  }
  
  newState = checkAchievements(newState);
  
  return newState;
};

export const rollWithAchievements = (state: PlayerState): PlayerState => {
  let newState = roll(state);
  newState = checkAchievements(newState);
  return newState;
};

// 转生 + 成就检查
export const regenerateWithAchievements = (state: PlayerState): PlayerState => {
  let newState = regenerate(state);
  newState = checkAchievements(newState);
  return newState;
};

export const getAchievementData = (state: PlayerState) => {
  return {
    unlockedAchievements: getUnlockedAchievements(state),
    inProgressAchievements: getInProgressAchievements(state),
    getProgress: (id: string) => getAchievementProgress(state, id),
    getGoal: (id: string) => getAchievementGoal(state, id)
  };
};
