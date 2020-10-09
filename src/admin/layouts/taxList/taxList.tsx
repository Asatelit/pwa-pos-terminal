import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Routes } from 'common/enums';
import { PlusTwoTone, TrashCanOutlineTwoTone } from 'common/icons';
import { Tax, AppActions } from 'common/types';
import { setDocumentTitle } from 'common/utils';
import { CommonLayout } from '../index';
import styles from './taxList.module.css';

type TaxListProps = {
  taxes: Tax[];
  actions: AppActions;
};

const TaxList: React.FC<TaxListProps> = ({ taxes, actions }) => {
  const [t] = useTranslation();

  useEffect(() => {
    const title = [t('admin.title'), t('admin.taxes.title')];
    setDocumentTitle(title);
  }, [t]);

  const list = taxes.filter((item) => !item.isDeleted);

  // Delete selected tax record
  const handleOnClickOnDeleteBtn = (event: React.MouseEvent, itemId: string) => {
    event.preventDefault();
    event.stopPropagation();
    actions.item.remove(itemId);
  };

  const renderItem = (data: Tax) => (
    <Link key={data.id} className={styles.entity} to={Routes.AdminTaxEdit.replace(':id', `${data.id}`)}>
      <div className={`${styles.td} ${styles.tdName}`}>{data.name}</div>
      <div className={`${styles.td}`}>{data.isEnabled ? `${data.precentage}%` : '---'}</div>
      <button className="btn btn-icon" onClick={(evt) => handleOnClickOnDeleteBtn(evt, data.id)}>
        <TrashCanOutlineTwoTone />
      </button>
    </Link>
  );

  const renderHead = (
    <Fragment>
      <div className={styles.title}>{t('admin.taxes.title')}</div>
      <Link className="btn btn-primary ml-2 mr-4" to={Routes.AdminTaxCreate}>
        <PlusTwoTone />
        <span>{t('admin.taxes.addItemLabel')}</span>
      </Link>
    </Fragment>
  );

  const renderBody = (
    <Fragment>
      {list.length ? (
        list.map((item) => renderItem(item))
      ) : (
        <div className={styles.empty}>{t('admin.taxes.emptyListMessage')}</div>
      )}
    </Fragment>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default TaxList;
