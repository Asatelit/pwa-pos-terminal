import { format, startOfWeek, endOfWeek, Locale } from 'date-fns';
import { i18n, TFunction } from 'i18next';
import { AppState, Locales, SupportedLocales } from 'common/types';
import { CurrencyPosition, WeekStartDays } from 'common/enums';

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
  endOfWeek: typeof endOfWeek;
  formatDate: typeof format;
  formatFinancial: (num: number) => string;
  locale: Locale;
  startOfWeek: typeof startOfWeek;
  t: TFunction;
};

export const createTranslationHelper: CreateTranslationHelper = (state, translation) => {
  const { settings } = state;
  const { weekStartsOn } = settings;
  const { i18n, dateDnsLocales, t } = translation;
  const locale = dateDnsLocales[i18n.language];

  const rangeOptions = { locale };
  if (weekStartsOn !== WeekStartDays.Auto) Object.assign(rangeOptions, { weekStartsOn });

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
    formatDate: (date, formatStr, options?) => format(date, formatStr, { locale, ...options }),

    /** Return the start of a week for the given date. The result will be in the local timezone and may vary by locale. */
    startOfWeek: (date, options?) => startOfWeek(date, { ...rangeOptions, ...options }),

    /** Return the end of a week for the given date. The result will be in the local timezone and may vary by locale. */
    endOfWeek: (date, options?) => endOfWeek(date, { ...rangeOptions, ...options }),
  };
};
