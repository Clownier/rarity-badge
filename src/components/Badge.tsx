import React from 'react';

// 使用Vite推荐的方式导入SVG
import badge1 from '../assets/badges/badge_1.svg?url';
import badge2 from '../assets/badges/badge_2.svg?url';
import badge3 from '../assets/badges/badge_3.svg?url';
import badge4 from '../assets/badges/badge_4.svg?url';
import badge5 from '../assets/badges/badge_5.svg?url';
import badge6 from '../assets/badges/badge_6.svg?url';
import badge7 from '../assets/badges/badge_7.svg?url';
import badge8 from '../assets/badges/badge_8.svg?url';
import badge9 from '../assets/badges/badge_9.svg?url';
import badge10 from '../assets/badges/badge_10.svg?url';
import badge11 from '../assets/badges/badge_11.svg?url';
import badge12 from '../assets/badges/badge_12.svg?url';

// 创建徽章图片映射
const badgeImages: Record<number, string> = {
  1: badge1,
  2: badge2,
  3: badge3,
  4: badge4,
  5: badge5,
  6: badge6,
  7: badge7,
  8: badge8,
  9: badge9,
  10: badge10,
  11: badge11,
  12: badge12
};

interface BadgeProps {
  rarityId: number;
  size?: number;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ rarityId, size = 50, className = '' }) => {
  // 确保rarityId在有效范围内
  const validRarityId = Math.min(Math.max(1, rarityId), 12);
  
  return (
    <img 
      src={badgeImages[validRarityId]} 
      alt={`Rarity Badge ${validRarityId}`}
      width={size}
      height={size}
      className={`badge-image ${className}`}
      style={{ display: 'inline-block' }} // 确保图像正确显示
    />
  );
};

export default Badge;
