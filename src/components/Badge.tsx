import React from 'react';
import { RARITIES } from '../constants';

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
import badge13 from '../assets/badges/badge_13.svg?url';
import badge14 from '../assets/badges/badge_14.svg?url';
import badge15 from '../assets/badges/badge_15.svg?url';
import badge16 from '../assets/badges/badge_16.svg?url';
import badge17 from '../assets/badges/badge_17.svg?url';
import badge18 from '../assets/badges/badge_18.svg?url';
import badge19 from '../assets/badges/badge_19.svg?url';
import badge20 from '../assets/badges/badge_20.svg?url';
import badge21 from '../assets/badges/badge_21.svg?url';
import badge22 from '../assets/badges/badge_22.svg?url';
import badge23 from '../assets/badges/badge_23.svg?url';
import badge24 from '../assets/badges/badge_24.svg?url';
import badge25 from '../assets/badges/badge_25.svg?url';
import badge26 from '../assets/badges/badge_26.svg?url';
import badge27 from '../assets/badges/badge_27.svg?url';
import badge28 from '../assets/badges/badge_28.svg?url';

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
  12: badge12,
  13: badge13,
  14: badge14,
  15: badge15,
  16: badge16,
  17: badge17,
  18: badge18,
  19: badge19,
  20: badge20,
  21: badge21,
  22: badge22,
  23: badge23,
  24: badge24,
  25: badge25,
  26: badge26,
  27: badge27,
  28: badge28
};

interface BadgeProps {
  rarityId: number;
  size?: number;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ rarityId, size = 50, className = '' }) => {
  // 确保rarityId在有效范围内
  const validRarityId = Math.min(Math.max(1, rarityId), RARITIES.length);
  
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
