// 游戏中的稀有度常量定义
import { Rarity, Achievement } from '../types';

// 稀有度概率与原始 Rarity Toy 保持一致
export const RARITIES: Rarity[] = [
  { 
    id: 1, 
    rarity: "普通", 
    rarityEn: "Common", 
    chance: 1/1, 
    color: "#c4c4c4",
    badgeDescription: "简单圆形徽章，无特殊标记",
    badgeDescriptionEn: "Simple circular badge with no special markings"
  },
  { 
    id: 2, 
    rarity: "不常见", 
    rarityEn: "Uncommon", 
    chance: 1/2, 
    color: "#93ff80",
    badgeDescription: "带有单一叶片图案的圆形徽章",
    badgeDescriptionEn: "Circular badge with a single leaf pattern"
  },
  { 
    id: 3, 
    rarity: "非常不常见", 
    rarityEn: "Very Uncommon", 
    chance: 1/4, 
    color: "#6aff19",
    badgeDescription: "带有双叶图案的圆形徽章",
    badgeDescriptionEn: "Circular badge with a double leaf pattern"
  },
  { 
    id: 4, 
    rarity: "稀有", 
    rarityEn: "Rare", 
    chance: 1/8, 
    color: "#82d9b3",
    badgeDescription: "带有三叶图案的圆形徽章",
    badgeDescriptionEn: "Circular badge with a triple leaf pattern"
  },
  { 
    id: 5, 
    rarity: "非常稀有", 
    rarityEn: "Very Rare", 
    chance: 1/16, 
    color: "#6be8d7",
    badgeDescription: "带有四叶图案的圆形徽章",
    badgeDescriptionEn: "Circular badge with a four-leaf pattern"
  },
  { 
    id: 6, 
    rarity: "超级稀有", 
    rarityEn: "Super Rare", 
    chance: 1/32, 
    color: "#08f3ff",
    badgeDescription: "带有五叶图案的星形徽章",
    badgeDescriptionEn: "Star-shaped badge with a five-leaf pattern"
  },
  { 
    id: 7, 
    rarity: "史诗", 
    rarityEn: "Epic", 
    chance: 1/64, 
    color: "#6d47bf",
    badgeDescription: "带有紫色光环的六角形徽章",
    badgeDescriptionEn: "Hexagonal badge with a purple aura"
  },
  { 
    id: 8, 
    rarity: "非常史诗", 
    rarityEn: "Very Epic", 
    chance: 1/128, 
    color: "#923af0",
    badgeDescription: "带有紫色闪电的六角形徽章",
    badgeDescriptionEn: "Hexagonal badge with a purple lightning"
  },
  { 
    id: 9, 
    rarity: "超级史诗", 
    rarityEn: "Super Epic", 
    chance: 1/256, 
    color: "#c300ff",
    badgeDescription: "带有紫色双闪电的六角形徽章",
    badgeDescriptionEn: "Hexagonal badge with double purple lightning"
  },
  { 
    id: 10, 
    rarity: "极致史诗", 
    rarityEn: "Ultra Epic", 
    chance: 1/512, 
    color: "#ff00d9",
    badgeDescription: "带有紫色三闪电的六角形徽章",
    badgeDescriptionEn: "Hexagonal badge with triple purple lightning"
  },
  { 
    id: 11, 
    rarity: "传说", 
    rarityEn: "Legendary", 
    chance: 1/1024, 
    color: "#ff9c75",
    badgeDescription: "带有金色边框的八角形徽章",
    badgeDescriptionEn: "Octagonal badge with a golden border"
  },
  { 
    id: 12, 
    rarity: "非常传说", 
    rarityEn: "Very Legendary", 
    chance: 1/2048, 
    color: "#ffba42",
    badgeDescription: "带有金色光芒的八角形徽章",
    badgeDescriptionEn: "Octagonal badge with golden rays"
  },
  { 
    id: 13, 
    rarity: "超级传说", 
    rarityEn: "Super Legendary", 
    chance: 1/4096, 
    color: "#ffe600",
    badgeDescription: "带有金色双光芒的八角形徽章",
    badgeDescriptionEn: "Octagonal badge with double golden rays"
  },
  { 
    id: 14, 
    rarity: "极致传说", 
    rarityEn: "Ultra Legendary", 
    chance: 1/8192, 
    color: "#fff069",
    badgeDescription: "带有金色三光芒的八角形徽章",
    badgeDescriptionEn: "Octagonal badge with triple golden rays"
  },
  { 
    id: 15, 
    rarity: "超越理解的传说", 
    rarityEn: "Legendary Beyond Comprehension", 
    chance: 1/16384, 
    color: "#fff7cf",
    badgeDescription: "带有金色光环的十角形徽章",
    badgeDescriptionEn: "Decagonal badge with a golden aura"
  },
  { 
    id: 16, 
    rarity: "神话", 
    rarityEn: "Mythical", 
    chance: 1/32768, 
    color: "#ff6666",
    badgeDescription: "带有红色火焰的钻石形徽章",
    badgeDescriptionEn: "Diamond-shaped badge with a red flame"
  },
  { 
    id: 17, 
    rarity: "非常神话", 
    rarityEn: "Very Mythical", 
    chance: 1/65536, 
    color: "#ff4242",
    badgeDescription: "带有红色双火焰的钻石形徽章",
    badgeDescriptionEn: "Diamond-shaped badge with double red flames"
  },
  { 
    id: 18, 
    rarity: "超级神话", 
    rarityEn: "Super Mythical", 
    chance: 1/131072, 
    color: "#ff2b2b",
    badgeDescription: "带有红色三火焰的钻石形徽章",
    badgeDescriptionEn: "Diamond-shaped badge with triple red flames"
  },
  { 
    id: 19, 
    rarity: "极致神话", 
    rarityEn: "Ultra Mythical", 
    chance: 1/262144, 
    color: "#ff0000",
    badgeDescription: "带有红色光环的钻石形徽章",
    badgeDescriptionEn: "Diamond-shaped badge with a red aura"
  },
  { 
    id: 20, 
    rarity: "闻所未闻...", 
    rarityEn: "Unheard-of...", 
    chance: 1/524288, 
    color: "#961111",
    badgeDescription: "带有黑色边缘的不规则形徽章",
    badgeDescriptionEn: "Irregular-shaped badge with black edges"
  },
  { 
    id: 21, 
    rarity: "黑暗", 
    rarityEn: "Darkness", 
    chance: 1/1048576, 
    color: "#454545",
    badgeDescription: "带有黑色漩涡的不规则形徽章",
    badgeDescriptionEn: "Irregular-shaped badge with a black swirl"
  },
  { 
    id: 22, 
    rarity: "绝对黑暗", 
    rarityEn: "Absolute Darkness", 
    chance: 1/2097152, 
    color: "#000000",
    badgeDescription: "纯黑色的不规则形徽章",
    badgeDescriptionEn: "Solid black irregular-shaped badge"
  },
  { 
    id: 23, 
    rarity: "我已一无所有...", 
    rarityEn: "Now I Have Nothing...", 
    chance: 1/4194304, 
    color: "#ffffff",
    badgeDescription: "带有裂缝的白色不规则形徽章",
    badgeDescriptionEn: "White irregular-shaped badge with cracks"
  },
  { 
    id: 24, 
    rarity: "甚至没有时间...", 
    rarityEn: "Not Even Time...", 
    chance: 1/8388608, 
    color: "#6f00ff",
    badgeDescription: "带有紫色时钟图案的不规则形徽章",
    badgeDescriptionEn: "Irregular-shaped badge with a purple clock pattern"
  },
  { 
    id: 25, 
    rarity: "你为什么要这样做？", 
    rarityEn: "Why Did You Do This?", 
    chance: 1/16777216, 
    color: "#8455c2",
    badgeDescription: "带有问号图案的不规则形徽章",
    badgeDescriptionEn: "Irregular-shaped badge with a question mark pattern"
  },
  { 
    id: 26, 
    rarity: "你撕裂了结构...", 
    rarityEn: "You Tore Apart The Fabric...", 
    chance: 1/33554432, 
    color: "#4f3f8a",
    badgeDescription: "带有撕裂图案的不规则形徽章",
    badgeDescriptionEn: "Irregular-shaped badge with a torn pattern"
  },
  { 
    id: 27, 
    rarity: "那维系着一切...", 
    rarityEn: "That Holds Everything Together...", 
    chance: 1/67108864, 
    color: "#474a6e",
    badgeDescription: "带有网格图案的不规则形徽章",
    badgeDescriptionEn: "Irregular-shaped badge with a grid pattern"
  },
  { 
    id: 28, 
    rarity: "我永远不会原谅你。", 
    rarityEn: "And I'll Never Forgive You.", 
    chance: 1/134217728, 
    color: "#4a615b",
    badgeDescription: "带有破碎心形的不规则形徽章",
    badgeDescriptionEn: "Irregular-shaped badge with a broken heart pattern"
  }
];

// 成就定义
export const ACHIEVEMENTS: Achievement[] = [
  // 徽章发现成就
  ...RARITIES.filter(r => r.id > 6).map(rarity => ({
    id: `discover_${rarity.id}`,
    name: `发现${rarity.rarity}`,
    nameEn: `Discover ${rarity.rarityEn}`,
    description: `首次发现${rarity.rarity}徽章`,
    descriptionEn: `Discover ${rarity.rarityEn} badge for the first time`,
    type: 'discovery' as const,
    condition: {
      type: 'rarity',
      value: rarity.id
    },
    reward: rarity.id - 6,
    icon: 'discovery'
  })),
  
  // 徽章数量成就
  ...RARITIES.flatMap(rarity => [
    {
      id: `quantity_${rarity.id}_1000`,
      name: `${rarity.rarity}收藏家`,
      nameEn: `${rarity.rarityEn} Collector`,
      description: `获得1000个${rarity.rarity}徽章`,
      descriptionEn: `Collect 1000 ${rarity.rarityEn} badges`,
      type: 'quantity' as const,
      condition: {
        type: 'quantity',
        value: 1000
      },
      reward: 1,
      icon: 'quantity'
    },
    {
      id: `quantity_${rarity.id}_10000`,
      name: `${rarity.rarity}大师`,
      nameEn: `${rarity.rarityEn} Master`,
      description: `获得10000个${rarity.rarity}徽章`,
      descriptionEn: `Collect 10000 ${rarity.rarityEn} badges`,
      type: 'quantity' as const,
      condition: {
        type: 'quantity',
        value: 10000
      },
      reward: 2,
      icon: 'quantity'
    }
  ]),
  
  // 总体游戏进度成就
  {
    id: 'total_rolls_100',
    name: '初学者',
    nameEn: 'Beginner',
    description: '累计掷出100次',
    descriptionEn: 'Roll 100 times in total',
    type: 'progress' as const,
    condition: {
      type: 'total_rolls',
      value: 100
    },
    reward: 1,
    icon: 'progress'
  },
  {
    id: 'total_rolls_1000',
    name: '熟练者',
    nameEn: 'Adept',
    description: '累计掷出1000次',
    descriptionEn: 'Roll 1000 times in total',
    type: 'progress' as const,
    condition: {
      type: 'total_rolls',
      value: 1000
    },
    reward: 1,
    icon: 'progress'
  },
  {
    id: 'total_rolls_10000',
    name: '专家',
    nameEn: 'Expert',
    description: '累计掷出10000次',
    descriptionEn: 'Roll 10000 times in total',
    type: 'progress' as const,
    condition: {
      type: 'total_rolls',
      value: 10000
    },
    reward: 2,
    icon: 'progress'
  },
  {
    id: 'total_rolls_100000',
    name: '大师',
    nameEn: 'Master',
    description: '累计掷出100000次',
    descriptionEn: 'Roll 100000 times in total',
    type: 'progress' as const,
    condition: {
      type: 'total_rolls',
      value: 100000
    },
    reward: 3,
    icon: 'progress'
  },
  {
    id: 'total_rebirths_1',
    name: '新生',
    nameEn: 'Reborn',
    description: '完成1次重生',
    descriptionEn: 'Complete 1 rebirth',
    type: 'progress' as const,
    condition: {
      type: 'total_rebirths',
      value: 1
    },
    reward: 1,
    icon: 'rebirth'
  },
  {
    id: 'total_rebirths_5',
    name: '轮回者',
    nameEn: 'Cycler',
    description: '完成5次重生',
    descriptionEn: 'Complete 5 rebirths',
    type: 'progress' as const,
    condition: {
      type: 'total_rebirths',
      value: 5
    },
    reward: 1,
    icon: 'rebirth'
  },
  {
    id: 'total_rebirths_10',
    name: '永生者',
    nameEn: 'Immortal',
    description: '完成10次重生',
    descriptionEn: 'Complete 10 rebirths',
    type: 'progress' as const,
    condition: {
      type: 'total_rebirths',
      value: 10
    },
    reward: 2,
    icon: 'rebirth'
  },
  {
    id: 'total_rebirths_50',
    name: '超越者',
    nameEn: 'Transcendent',
    description: '完成50次重生',
    descriptionEn: 'Complete 50 rebirths',
    type: 'progress' as const,
    condition: {
      type: 'total_rebirths',
      value: 50
    },
    reward: 2,
    icon: 'rebirth'
  },
  {
    id: 'total_rebirths_100',
    name: '永恒者',
    nameEn: 'Eternal',
    description: '完成100次重生',
    descriptionEn: 'Complete 100 rebirths',
    type: 'progress' as const,
    condition: {
      type: 'total_rebirths',
      value: 100
    },
    reward: 3,
    icon: 'rebirth'
  }
];

// 初始升级价格
export const INITIAL_UPGRADE_PRICES = {
  luck: 10,
  interval: 10,
  shimmer: 25
};

// 初始全局升级价格
export const INITIAL_GLOBAL_UPGRADE_PRICES = {
  luck: 5,
  interval: 5,
  shimmer: 10
};

// 升级倍率
export const UPGRADE_MULTIPLIERS = {
  luck: 2.5,
  interval: 0.85,
  shimmer: 2
};

// 升级价格增长倍率
export const PRICE_GROWTH_RATES = {
  luck: 3,
  interval: 2.25,
  shimmer: 4
};

// 全局升级价格增长倍率
export const GLOBAL_PRICE_GROWTH_RATE = 2;

// 全局升级效果
export const GLOBAL_UPGRADE_EFFECTS = {
  luck: 0.1,
  interval: 0.05,
  shimmer: 0.2
};

// 初始游戏设置
export const DEFAULT_SETTINGS: {
  language: 'zh' | 'en';
  autoRoll: boolean;
  soundEnabled: boolean;
  volume: number;
  autoSaveInterval: number;
} = {
  language: 'zh',
  autoRoll: true,
  soundEnabled: true,
  volume: 0.5,
  autoSaveInterval: 30
};

// 离线效率系数
export const OFFLINE_EFFICIENCY = 0.8;
