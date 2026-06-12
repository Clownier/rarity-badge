import React, { useCallback } from 'react';
import { PlayerState } from '../types';
import { RARITIES } from '../constants';
import { t } from '../locales';
import Badge from './Badge';

interface IndexTabProps {
  language: 'zh' | 'en';
  player: PlayerState;
}

const IndexTab: React.FC<IndexTabProps> = ({ language, player }) => {
  const _t = useCallback((key: string) => t(key, language), [language]);

  return (
    <div className="index-content">
      <div className="index-list">
        {player.totalRarities.map((count, index) => {
          const isDiscovered = count > 0;
          const rarity = RARITIES[index];
          const rarityName = isDiscovered
            ? (language === 'zh' ? rarity.rarity : rarity.rarityEn)
            : _t('main.waiting-discover');
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
};

export default IndexTab;
