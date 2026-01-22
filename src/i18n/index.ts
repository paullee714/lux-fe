/**
 * Internationalization setup
 */

import { ko, type Translations } from "./ko";
import { en } from "./en";

export type LanguageCode = "ko" | "en";

const translations: Record<LanguageCode, Translations> = {
  ko,
  en,
};

export function getTranslations(lang: LanguageCode = "ko"): Translations {
  return translations[lang] || translations.ko;
}

export function t(
  lang: LanguageCode,
  key: string,
  params?: Record<string, string | number>
): string {
  const keys = key.split(".");
  let value: unknown = translations[lang] || translations.ko;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // Return the key if translation not found
    }
  }

  if (typeof value !== "string") {
    return key;
  }

  // Replace parameters
  if (params) {
    return Object.entries(params).reduce(
      (str, [paramKey, paramValue]) =>
        str.replace(new RegExp(`{{${paramKey}}}`, "g"), String(paramValue)),
      value
    );
  }

  return value;
}

export { ko, en };
export type { Translations };
