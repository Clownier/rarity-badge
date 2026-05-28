import React from 'react';
import { Achievement } from '../types';
import '../styles/AchievementTab.css';

interface AchievementItemProps {
  achievement: Achievement;
  isUnlocked: boolean;
  progress: number;
  goal: number;
  language: 'zh' | 'en';
}

const AchievementItem: React.FC<AchievementItemProps> = ({ 
  achievement, 
  isUnlocked, 
  progress, 
  goal,
  language
}) => {
  const percentage = (progress / goal) * 100;
  
  return (
    <div className={`achievement-item ${isUnlocked ? 'unlocked' : ''}`}>
      <div className="achievement-icon">
        {isUnlocked ? '✅' : '🔒'}
      </div>
      <div className="achievement-content">
        <div className="achievement-title">
          {language === 'zh' ? achievement.name : achievement.nameEn}
        </div>
        <div className="achievement-description">
          {language === 'zh' ? achievement.description : achievement.descriptionEn}
        </div>
        <div className="achievement-progress-container">
          <div 
            className="achievement-progress-bar" 
            style={{ width: `${Math.min(100, percentage)}%` }}
          ></div>
          <div className="achievement-progress-text">
            {progress} / {goal}
          </div>
        </div>
      </div>
      <div className="achievement-reward">
        +{achievement.reward} {language === 'zh' ? '成就点' : 'AP'}
      </div>
    </div>
  );
};

interface AchievementTabProps {
  unlockedAchievements: Achievement[];
  inProgressAchievements: Achievement[];
  getProgress: (id: string) => number;
  getGoal: (id: string) => number;
  language: 'zh' | 'en';
}

const AchievementTab: React.FC<AchievementTabProps> = ({
  unlockedAchievements,
  inProgressAchievements,
  getProgress,
  getGoal,
  language
}) => {
  return (
    <div className="achievements-content">
      <h3>{language === 'zh' ? '已解锁成就' : 'Unlocked Achievements'}</h3>
      <div className="achievements-list">
        {unlockedAchievements.length === 0 ? (
          <div className="no-achievements">
            {language === 'zh' ? '尚未解锁任何成就' : 'No achievements unlocked yet'}
          </div>
        ) : (
          unlockedAchievements.map(achievement => (
            <AchievementItem
              key={achievement.id}
              achievement={achievement}
              isUnlocked={true}
              progress={getProgress(achievement.id)}
              goal={getGoal(achievement.id)}
              language={language}
            />
          ))
        )}
      </div>
      
      <h3>{language === 'zh' ? '进行中成就' : 'In Progress Achievements'}</h3>
      <div className="achievements-list">
        {inProgressAchievements.map(achievement => (
          <AchievementItem
            key={achievement.id}
            achievement={achievement}
            isUnlocked={false}
            progress={getProgress(achievement.id)}
            goal={getGoal(achievement.id)}
            language={language}
          />
        ))}
      </div>
    </div>
  );
};

export default AchievementTab;
