import React, { Fragment, useEffect, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as AppSettings, AppActions } from 'common/types';
import { CurrencyPosition, WeekStartDays } from 'common/enums';
import { setDocumentTitle, languageList } from 'common/utils';
import { I18nContext } from 'common/contexts';
import { APP_NAME } from 'config';
import { CommonLayout } from '../index';
import styles from './settings.module.css';

type SettingsProps = {
  settings: AppSettings;
  actions: AppActions;
};

type FormGroup = {
  id: string;
  label: string;
  c: React.ReactElement;
  description?: string;
  placeholder?: string;
  title?: string;
};

const Settings: React.FC<SettingsProps> = ({ settings, actions }) => {
  const [t, i18n] = useTranslation();
  const [formFilter, setFormFilter] = useState('');
  const { supportedLocales } = useContext(I18nContext);

  useEffect(() => {
    const title = [t('admin.title'), t('admin.settings.title')];
    setDocumentTitle(title);
  }, [t]);

  const handleOnChangeOfLanguagePreference = (isoCode: string) => {
    const lng = isoCode === 'default' ? '' : isoCode;
    i18n.changeLanguage(lng).then((e) => {
      actions.settings.update({ lang: isoCode });
    });
  };

  const formGroups: FormGroup[] = [
    {
      id: 'SettingsName',
      label: t('admin.settings.businessNameLabel'),
      description: t('admin.settings.businessNameDescription'),
      c: (
        <input
          type="text"
          className="form-control"
          value={settings.name}
          onChange={(evt) => actions.settings.update({ name: evt.target.value })}
        />
      ),
    },
    {
      id: 'SettingsPrintReceipt',
      label: t('admin.settings.printReceiptLabel'),
      c: (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="SettingsPrintReceiptSwitch"
            checked={settings.printReceiptByDefault}
            onChange={(evt) => actions.settings.update({ printReceiptByDefault: evt.target.checked })}
          />
          <label className="form-check-label" htmlFor="SettingsPrintReceiptSwitch">
            <small>{t('admin.settings.printReceiptDescription')}</small>
          </label>
        </div>
      ),
    },
    {
      id: 'SettingsPrintGuestCheck',
      label: t('admin.settings.disablePrintingGuestChecksLabel'),
      c: (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="SettingsPrintGuestCheckSwitch"
            checked={settings.isDeniedPrintingGuestChecks}
            onChange={(evt) => actions.settings.update({ isDeniedPrintingGuestChecks: evt.target.checked })}
          />
          <label className="form-check-label" htmlFor="SettingsPrintGuestCheckSwitch">
            <small>{t('admin.settings.disablePrintingGuestChecksDescription')}</small>
          </label>
        </div>
      ),
    },
    {
      id: 'SettingsLanguagePreference',
      label: t('admin.settings.languagePreferenceLabel'),
      description: t('admin.settings.languagePreferenceDescription', { name: APP_NAME }),
      c: (
        <select
          className="form-select w-auto pr-5"
          value={settings.lang}
          onChange={(evt) => handleOnChangeOfLanguagePreference(evt.target.value)}
        >
          <option value="default">{t('common.browserDefault')}</option>
          {supportedLocales.map((lng) => (
            <option key={lng} value={lng}>
              {languageList[lng].nativeName}
            </option>
          ))}
        </select>
      ),
    },
    {
      id: 'SettingsFirstDayOfTheWeek',
      label: t('admin.settings.firstDayOfTheWeekLabel'),
      c: (
        <select
          className="form-select w-auto pr-5"
          value={settings.weekStartsOn}
          onChange={(evt) => actions.settings.update({ weekStartsOn: parseInt(evt.target.value, 10) })}
        >
          <option value={WeekStartDays.Auto}>{t('common.browserDefault')}</option>
          <option value={WeekStartDays.Sunday}>{t('common.weekdays.sunday')}</option>
          <option value={WeekStartDays.Monday}>{t('common.weekdays.monday')}</option>
          <option value={WeekStartDays.Saturday}>{t('common.weekdays.saturday')}</option>
        </select>
      ),
    },
    {
      id: 'SettingsCurrency',
      label: t('admin.settings.currencyLabel'),
      c: (
        <input
          type="text"
          className="form-control w-auto pr-5"
          value={settings.currency}
          onChange={(evt) => actions.settings.update({ currency: evt.target.value })}
        />
      ),
    },
    {
      id: 'SettingsCurrencyPosition',
      label: t('admin.settings.currencyPositionLabel'),
      c: (
        <select
          className="form-select w-auto pr-5"
          value={settings.currencyPosition}
          onChange={(evt) => actions.settings.update({ currencyPosition: evt.target.value as CurrencyPosition })}
        >
          <option value={CurrencyPosition.Left}>{`${settings.currency} 123.00`}</option>
          <option value={CurrencyPosition.Right}>{`123.00 ${settings.currency}`}</option>
        </select>
      ),
    },
  ];

  const renderFormGroup = ({ c, id, label, description = '', title = '', placeholder = '' }: FormGroup) => (
    <div className="mb-4" key={id} title={title}>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      {description && <div className="form-text text-muted mb-2">{description}</div>}
      {{ ...c, props: { ...c.props, id, placeholder } }}
    </div>
  );

  // Filter form fields if required.
  const formData = formFilter
    ? formGroups.filter(
        (entity) =>
          entity.label.toLocaleLowerCase().includes(formFilter.toLocaleLowerCase()) ||
          entity.description?.toLocaleLowerCase().includes(formFilter.toLocaleLowerCase()),
      )
    : formGroups;

  const renderHead = (
    <Fragment>
      <div className={styles.title}>{t('admin.settings.title')}</div>
    </Fragment>
  );

  const renderBody = <form>{formData.map((el) => renderFormGroup(el))}</form>;

  return (
    <CommonLayout
      isFilterable
      head={renderHead}
      body={renderBody}
      filterValue={formFilter}
      onChangeFilterValue={setFormFilter}
    />
  );
};

export default Settings;
