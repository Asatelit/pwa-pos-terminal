import React, { Fragment } from 'react';
import { Settings, TerminalServices } from 'types';
import { CommonLayout } from '../index';
import styles from './commonSettings.module.css';

type CommonSettingsProps = {
  settings: Settings;
  service: TerminalServices;
};

const CommonSettings: React.FC<CommonSettingsProps> = ({ settings, service }) => {
  const renderHead = (
    <Fragment>
      <div className={styles.title}>
        Settings
      </div>
    </Fragment>
  );

  const renderBody = (
    <Fragment>

      <div className={styles.control}>
        <label className={styles.controlLabel} htmlFor="CommonSettingsName">
          Company Name
        </label>
        <div className={styles.controlGroup}>
          <input
            type="text"
            id="CommonSettingsName"
            className={styles.controlInput}
            value={settings.name}
            onChange={evt => service.updateSettings({ name: evt.target.value })}
          />
        </div>
      </div>

    </Fragment>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default CommonSettings;
