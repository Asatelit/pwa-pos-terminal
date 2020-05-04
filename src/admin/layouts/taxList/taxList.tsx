import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Routes } from 'common/const';
import { PlusTwoTone, TrashCanOutlineTwoTone } from 'common/icons';
import { Tax, AppActions } from 'common/types';
import { CommonLayout } from '..';
import styles from './taxList.module.css';

type TaxListProps = {
  taxes: Tax[];
  actions: AppActions;
};

const TaxList: React.FC<TaxListProps> = ({ taxes, actions }) => {
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
      <div className={`${styles.td}`}>{data.isEnabled ? data.precentage : 'Off'}</div>
      <button className={styles.iconBtn} onClick={(evt) => handleOnClickOnDeleteBtn(evt, data.id)}>
        <TrashCanOutlineTwoTone />
      </button>
    </Link>
  );

  const renderHead = (
    <Fragment>
      <div className={styles.itemInfo}>
        <span className={styles.itemName}>Taxes</span>
      </div>
      <Link className={styles.primaryBtn} to={Routes.AdminTaxCreate}>
        <PlusTwoTone />
        <span>New Tax</span>
      </Link>
    </Fragment>
  );

  const renderBody = (
    <Fragment>
      {list.length ? (
        list.map((item) => renderItem(item))
      ) : (
        <div className={styles.empty}>There are no items here.</div>
      )}
    </Fragment>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default TaxList;
