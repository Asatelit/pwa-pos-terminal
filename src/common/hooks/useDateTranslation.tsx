import { useContext } from 'react';
import { format as dateFnsFormat } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { I18nContext } from 'common/hooks';

export type DateTranslation = {
  format: typeof dateFnsFormat;
};

export function useDateTranslation(): DateTranslation {
  const { dateDnsLocales: locales } = useContext(I18nContext);
  const { i18n } = useTranslation();

  return {
    format: (date, format, options?) => dateFnsFormat(date, format, { locale: locales[i18n.language], ...options }),
  };
}
