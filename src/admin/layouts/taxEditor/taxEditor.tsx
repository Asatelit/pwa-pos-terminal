import React, { Fragment, useState, useEffect } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { Routes } from 'common/const';
import { getTaxEntity, getTaxById } from 'common/assets';
import { ArrowLeftTwoTone } from 'common/icons';
import { Tax, AppActions } from 'common/types';
import { APP_NAME } from 'config';
import { CommonLayout } from '../../layouts';
import styles from './taxEditor.module.css';

type TaxEditorProps = {
  taxes: Tax[];
  actions: AppActions;
};

const TaxEditor: React.FC<TaxEditorProps> = ({ taxes, actions }) => {
  useEffect(() => {
    document.title = `${APP_NAME} | Admin | Tax Editor`;
  }, []);

  const { id } = useParams<{id: string}>();
  const currentTaxRecord = id ? getTaxById(taxes, id) : null;
  const initialTaxRecord: Tax = currentTaxRecord ? currentTaxRecord : getTaxEntity();

  const [taxRecord, setTaxRecord] = useState<Tax>(initialTaxRecord);
  const [redirect, setRedirect] = useState('');

  // Helpers
  const updateTaxRecord = (data: Partial<Tax>) => {
    setTaxRecord({ ...taxRecord, ...data });
  };
  const isInvalid = !taxRecord.name;

  const handleOnClickOnPrimaryBtn = () => {
    if (currentTaxRecord) {
      actions.taxes.update({ ...currentTaxRecord, ...taxRecord }); // update an existing item
    } else {
      actions.taxes.add(taxRecord); // create a new item
    }
    setRedirect(Routes.AdminTaxList);
  };

  if (redirect) return <Redirect to={redirect} />;

  const renderHead = (
    <Fragment>
      <Link className={styles.closeBtn} to={Routes.AdminTaxList}>
        <ArrowLeftTwoTone />
      </Link>
      <div className={styles.itemInfo}>
        <span className={styles.itemName}>{currentTaxRecord ? 'Edit Tax' : 'Create Tax'}</span>
      </div>
    </Fragment>
  );

  const renderBody = (
    <div className={styles.body}>
      <div className={styles.switch}>
        <div className={styles.controlLabel} />
        <input
          type="checkbox"
          id="TaxEditorIsEnabled"
          checked={taxRecord.isEnabled}
          onChange={(evt) => updateTaxRecord({ isEnabled: evt.target.checked })}
        />
        <label htmlFor="TaxEditorIsEnabled">Enabled</label>
      </div>
      <div className={styles.control}>
        <label className={styles.controlLabel} htmlFor="taxEditorName">
          Name
        </label>
        <input
          id="taxEditorName"
          type="text"
          className={styles.controlInput}
          value={taxRecord.name}
          onChange={(evt) => updateTaxRecord({ name: evt.target.value })}
        />
      </div>
      <div className={styles.control}>
        <label className={styles.controlLabel} htmlFor="TaxEditorPrice">
          Precentage
        </label>
        <input
          type="number"
          className={styles.controlInput}
          id="TaxEditorPrecentage"
          placeholder="Precentage"
          value={taxRecord.precentage}
          onChange={(evt) => updateTaxRecord({ precentage: parseInt(evt.target.value, 10) })}
        />
      </div>
      <div className={styles.control}>
        <label className={styles.controlLabel} htmlFor="TaxEditorPrice">
          Precentage
        </label>
        <select
          className={styles.controlInput}
          id="TaxEditorPrecentage"
          value={`${taxRecord.isIncludedInPrice}`}
          onChange={(evt) => updateTaxRecord({ isIncludedInPrice: evt.target?.value === 'true' })}
        >
          <option value={'false'}>Add Tax to Price</option>
          <option value={'true'}>Include Tax in Item Price</option>
        </select>
      </div>
      <div className={styles.switch}>
        <div className={styles.controlLabel} />
        <input
          type="checkbox"
          id="TaxEditorApplyToCustomAmounts"
          checked={taxRecord.applyToCustomAmounts}
          onChange={(evt) => updateTaxRecord({ applyToCustomAmounts: evt.target.checked })}
        />
        <label htmlFor="TaxEditorApplyToCustomAmounts">Apply To Custom Amounts</label>
      </div>
      <div className={styles.control}>
        <div className={styles.controlLabel} />
        <button className={styles.primaryAction} disabled={isInvalid} onClick={handleOnClickOnPrimaryBtn}>
          {currentTaxRecord ? 'Update' : 'Add'}
        </button>
      </div>
    </div>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default TaxEditor;
