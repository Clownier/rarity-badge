import zh from './zh';
import en from './en';

const locales: Record<string, Record<string, string>> = { zh, en };

export function t(key: string, language: 'zh' | 'en'): string {
  return locales[language]?.[key] ?? key;
}
