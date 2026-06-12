import { RARITIES } from '../constants';
import { t } from '../locales';

export function getRarityName(rarityId: number, lang: 'zh' | 'en'): string {
  const rarity = RARITIES.find(r => r.id === rarityId);
  if (!rarity) return '';
  return lang === 'zh' ? rarity.rarity : rarity.rarityEn;
}

export function formatGameTime(ms: number, lang: 'zh' | 'en'): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}${t('time.d', lang)} ${hours % 24}${t('time.h', lang)}`;
  if (hours > 0) return `${hours}${t('time.h', lang)} ${minutes % 60}${t('time.m', lang)}`;
  return `${minutes}${t('time.m', lang)} ${seconds % 60}${t('time.s', lang)}`;
}
