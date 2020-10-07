import { useContext } from 'react';
import { format as dateFnsFormat, Locale } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { I18nContext } from 'common/hooks';

export type DateTranslation = {
  format: typeof dateFnsFormat;
  locale: Locale;
};

export function useDateTranslation(): DateTranslation {
  const { dateDnsLocales: locales } = useContext(I18nContext);
  const { i18n } = useTranslation();
  const locale = locales[i18n.language];

  return {
    locale,
    format: (date, format, options?) => dateFnsFormat(date, format, { locale, ...options }),
  };
}
