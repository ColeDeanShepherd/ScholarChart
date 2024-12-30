export interface LocalizedString {
  en: string;
  es?: string;
}

export type MaybeLocalizedString = string | LocalizedString;

export function translate(str: MaybeLocalizedString): string {
  if (typeof str === 'string') {
    return str;
  } else /* if (is LocalizedString) */ {
    return str.en;
  }
}