import React, { Fragment, useState, useEffect } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTaxEntity, getTaxById } from 'common/assets';
import { setDocumentTitle } from 'common/utils';
import { ArrowLeftTwoTone } from 'common/icons';
import { Tax, AppActions } from 'common/types';
import { Routes } from 'common/enums';
import { CommonLayout } from '../../layouts';
import styles from './taxEditor.module.css';

type TaxEditorProps = {
  taxes: Tax[];
  actions: AppActions;
};

const TaxEditor: React.FC<TaxEditorProps> = ({ taxes, actions }) => {
  const { id } = useParams<{ id: string }>();
  const [t] = useTranslation();

  useEffect(() => {
    const title = [t('admin.title'), t(id ? 'admin.taxEditor.editItemTitle' : 'admin.taxEditor.addItemTitle')];
    setDocumentTitle(title);
  }, [t, id]);

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
      <Link className="btn btn-link" to={Routes.AdminTaxList}>
        <ArrowLeftTwoTone />
      </Link>
      <div className={styles.title}>
        {currentTaxRecord ? t('admin.taxEditor.editItemTitle') : t('admin.taxEditor.addItemTitle')}
      </div>
    </Fragment>
  );

  const renderBody = (
    <div className={styles.body}>
      <div className="form-check form-switch mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="TaxEditorIsEnabled"
          checked={taxRecord.isEnabled}
          onChange={(evt) => updateTaxRecord({ isEnabled: evt.target.checked })}
        />
        <label className="form-check-label" htmlFor="TaxEditorIsEnabled">
          {t('common.enabled')}
        </label>
      </div>

      <div className="mb-4">
        <label className="form-label" htmlFor="taxEditorName">
          {t('admin.taxEditor.nameLabel')}
        </label>
        <input
          id="taxEditorName"
          type="text"
          className="form-control"
          value={taxRecord.name}
          onChange={(evt) => updateTaxRecord({ name: evt.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="form-label" htmlFor="TaxEditorPrice">
          {t('admin.taxEditor.precentageLabel')}
        </label>
        <input
          type="number"
          className="form-control w-auto"
          id="TaxEditorPrecentage"
          placeholder={t('admin.taxEditor.precentageLabel')}
          value={taxRecord.precentage}
          onChange={(evt) => updateTaxRecord({ precentage: parseInt(evt.target.value, 10) })}
        />
      </div>

      <div className="mb-4">
        <label className="form-label" htmlFor="TaxEditorPrice">
          {t('admin.taxEditor.itemPricingLabel')}
        </label>
        <select
          className="form-select w-auto pr-5"
          id="TaxEditorPrecentage"
          value={`${taxRecord.isIncludedInPrice}`}
          onChange={(evt) => updateTaxRecord({ isIncludedInPrice: evt.target?.value === 'true' })}
        >
          <option value={'false'}>{t('admin.taxEditor.addTaxToItemPrice')}</option>
          <option value={'true'}>{t('admin.taxEditor.includeTaxInItemPrice')}</option>
        </select>
      </div>

      <label className="form-label" htmlFor="TaxEditorPrice">
        {t('admin.taxEditor.applyTaxToLabel')}
      </label>

      <div className="form-check form-switch mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="TaxEditorApplyToCustomAmounts"
          checked={taxRecord.applyToCustomAmounts}
          onChange={(evt) => updateTaxRecord({ applyToCustomAmounts: evt.target.checked })}
        />
        <label className="form-check-label" htmlFor="TaxEditorApplyToCustomAmounts">
          {t('admin.taxEditor.applyToCustomAmounts')}
        </label>
      </div>

      <button className="btn btn-primary" disabled={isInvalid} onClick={handleOnClickOnPrimaryBtn}>
        {currentTaxRecord ? t('common.update') : t('common.add')}
      </button>
    </div>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default TaxEditor;
