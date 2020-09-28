import React, { Fragment, useEffect, useState } from 'react';
import ISO6391 from 'iso-639-1';
import { useTranslation } from 'react-i18next';
import { Settings, AppActions } from 'common/types';
import { APP_NAME } from 'config';
import { CommonLayout } from '../index';
import styles from './commonSettings.module.css';

type CommonSettingsProps = {
  settings: Settings;
  actions: AppActions;
};

const CommonSettings: React.FC<CommonSettingsProps> = ({ settings, actions }) => {
  const [t, i18n] = useTranslation();
  const [supportedLocales, setSupportedLocales] = useState([]);

  useEffect(() => {
    document.title = `${APP_NAME} | Admin | Settings`;
    // Get the list of locales that this app has been localized for
    fetch('./locales/index.json')
      .then((response) => response.json())
      .then((data) => setSupportedLocales(data));
  }, []);

  const handleOnChangeOfLanguagePreference = (isoCode: string) => {
    const lng = isoCode === 'default' ? '' : isoCode;
    i18n.changeLanguage(lng).then(() => {
      actions.settings.update({ lang: isoCode });
    });
  };

  const renderHead = (
    <Fragment>
      <div className={styles.title}>{t('admin.settings.title')}</div>
    </Fragment>
  );

  const renderBody = (
    <div className={styles.body}>
      <form className="container">
        <div className="mb-4">
          <label className="form-label" htmlFor="CommonSettingsName">
            {t('admin.settings.businessNameLabel')}
          </label>
          <div className="form-text text-muted mb-2">{t('admin.settings.businessNameDescription')}</div>
          <div className={styles.controlGroup}>
            <input
              type="text"
              id="CommonSettingsName"
              className="form-control"
              value={settings.name}
              onChange={(evt) => actions.settings.update({ name: evt.target.value })}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="CommonSettingsLanguagePreference">
            {t('admin.settings.languagePreferenceLabel')}
          </label>
          <div className="form-text text-muted mb-2">
            {t('admin.settings.languagePreferenceDescription', { name: APP_NAME })}
          </div>
          <select
            id="CommonSettingsLanguagePreference"
            className="form-select w-auto pr-5"
            value={settings.lang}
            onChange={(evt) => handleOnChangeOfLanguagePreference(evt.target.value)}
          >
            <option value="default">{t('common.default')}</option>
            {supportedLocales.map((lng) => (
              <option key={lng} value={lng}>
                {ISO6391.getNativeName(lng)}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default CommonSettings;
