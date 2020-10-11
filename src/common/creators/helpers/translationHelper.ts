import { format as dateFnsFormat, Locale } from 'date-fns';
import { i18n, TFunction } from 'i18next';
import { AppState, Locales, SupportedLocales } from 'common/types';
import { CurrencyPosition } from 'common/enums';

export type CreateTranslationHelper = (
  state: AppState,
  translation: {
    i18n: i18n;
    dateDnsLocales: Locales;
    supportedLocales: SupportedLocales;
    t: TFunction;
  },
) => TranslationHelper;

export type TranslationHelper = {
  formatDate: typeof dateFnsFormat;
  formatFinancial: (num: number) => string;
  locale: Locale;
  t: TFunction;
};

export const createTranslationHelper: CreateTranslationHelper = (state, translation) => {
  const { settings } = state;
  const { i18n, dateDnsLocales, t } = translation;
  const locale = dateDnsLocales[i18n.language];

  return {
    /** The t function is the main function in i18next to translate content.   */
    t,

    /** The locale code */
    locale,

    /** Formats a number using fixed-point notation. The result may vary by locale. */
    formatFinancial: (num = 0) => {
      const { currency, currencyPosition } = settings;
      const amount = num.toFixed(2);
      return currencyPosition === CurrencyPosition.Right ? `${amount} ${currency}` : `${currency} ${amount}`;
    },

    /** Return the formatted date string in the given format. The result may vary by locale. */
    formatDate: (date, format, options?) => dateFnsFormat(date, format, { locale, ...options }),
  };
};
