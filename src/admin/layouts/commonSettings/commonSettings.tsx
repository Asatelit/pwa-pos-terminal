import React, { Fragment } from 'react';
import { Settings, AppActions } from 'common/types';
import { CommonLayout } from '../index';
import styles from './commonSettings.module.css';

type CommonSettingsProps = {
  settings: Settings;
  actions: AppActions;
};

const CommonSettings: React.FC<CommonSettingsProps> = ({ settings, actions }) => {
  const renderHead = (
    <Fragment>
      <div className={styles.title}>
        Settings
      </div>
    </Fragment>
  );

  const renderBody = (
    <div className={styles.body}>
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
            onChange={evt => actions.settings.update({ name: evt.target.value })}
          />
        </div>
      </div>
    </div>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default CommonSettings;
