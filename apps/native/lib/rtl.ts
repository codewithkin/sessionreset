import { useTranslation } from 'react-i18next';
import type { FlexStyle, TextStyle } from 'react-native';

/** Right-to-left locales among the ten we ship. */
const RTL_LANGUAGES = new Set(['ar']);

export function isRTLLanguage(code: string): boolean {
  return RTL_LANGUAGES.has(code);
}

export interface Direction {
  isRTL: boolean;
  /** Horizontal flow — swap to `row-reverse` so rows mirror. */
  row: Extract<FlexStyle['flexDirection'], 'row' | 'row-reverse'>;
  /** Default text alignment for body copy. */
  textAlign: Extract<TextStyle['textAlign'], 'left' | 'right'>;
  /** Opposite edge, for values that sit at the far end of a row. */
  textAlignEnd: Extract<TextStyle['textAlign'], 'left' | 'right'>;
  /** Lets the platform's bidi algorithm order mixed LTR/RTL runs correctly. */
  writingDirection: Extract<TextStyle['writingDirection'], 'ltr' | 'rtl'>;
  /** Multiply x-offsets/translations by this to mirror them. */
  sign: 1 | -1;
}

/**
 * Direction helpers derived from the active language.
 *
 * Deliberately does NOT use `I18nManager.forceRTL`. That flag only takes
 * effect after a full native restart, which would mean the language picker
 * either silently half-applies or has to kick the user out of the app
 * mid-onboarding. Mirroring explicitly costs a little more at each call site
 * but flips instantly, matching how every other language change behaves.
 *
 * Depends on `useTranslation`, so consumers re-render on language change.
 */
export function useDirection(): Direction {
  const { i18n } = useTranslation();
  const isRTL = isRTLLanguage(i18n.language);

  return {
    isRTL,
    row: isRTL ? 'row-reverse' : 'row',
    textAlign: isRTL ? 'right' : 'left',
    textAlignEnd: isRTL ? 'left' : 'right',
    writingDirection: isRTL ? 'rtl' : 'ltr',
    sign: isRTL ? -1 : 1,
  };
}
