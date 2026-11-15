// Dictionaries are the prototype's I18N.en / I18N.id exactly as captured in baseline/golden (3,751 keys each).
import en from './en.json';
import id from './id.json';

export type Lang = 'en' | 'id';
export const dictionaries: Record<Lang, Record<string, string>> = { en, id };

/** Same lookup as the prototype's t(): active language, then English, then the key itself. */
export const translate = (lang: Lang, key: string): string => dictionaries[lang]?.[key] || dictionaries.en[key] || key;
