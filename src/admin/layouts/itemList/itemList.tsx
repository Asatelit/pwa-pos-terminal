import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Routes } from 'common/enums';
import { getCategoryById } from 'common/assets';
import { CommonLayout } from '../index';
import { Category, Item, AppActions, AppTranslationHelper } from 'common/types';
import { PlusTwoTone, TrashCanOutlineTwoTone } from 'common/icons';
import { getTextIdentifier, setDocumentTitle, exportToJsonFile } from 'common/utils';

import styles from './itemList.module.css';

type ItemListProps = {
  actions: AppActions;
  categories: Category[];
  translation: AppTranslationHelper;
  items: Item[];
};

const ItemList: React.FC<ItemListProps> = ({ categories, items, actions, translation }) => {
  const { formatFinancial, t } = translation;

  useEffect(() => {
    const title = [t('admin.title'), t('admin.items.title')];
    setDocumentTitle(title);
  }, [t]);

  const handleOnClickOnDeleteBtn = (event: React.MouseEvent, itemId: string) => {
    event.preventDefault();
    event.stopPropagation();
    actions.item.remove(itemId);
  };

  const renderPresenter = (data: Item) => {
    const { picture, color, name } = data;
    const style = picture ? { backgroundImage: `url(${picture})` } : { backgroundColor: color || 'inherit' };
    return (
      <div className={styles.presenter} style={style}>
        {!data.picture && getTextIdentifier(name)}
      </div>
    );
  };

  const renderItem = (data: Item) => {
    const categoryName = getCategoryById(categories, data.parentId).name;
    return (
      <Link key={data.id} className={styles.entity} to={Routes.AdminItemEdit.replace(':id', `${data.id}`)}>
        {renderPresenter(data)}
        <div className={`${styles.td} ${styles.tdName}`}>{data.name}</div>
        <div className={`${styles.td} ${styles.tdCategory}`}>
          {categoryName.replace('Home Screen', t('common.homeScreen'))}
        </div>
        <div className={`${styles.td}`}>{formatFinancial(data.costPrice)}</div>
        <div className={`${styles.td}`}>{formatFinancial(data.price)}</div>
        <button className="btn btn-link" onClick={(evt) => handleOnClickOnDeleteBtn(evt, data.id)}>
          <TrashCanOutlineTwoTone />
        </button>
      </Link>
    );
  };

  const itemList = items.filter((item) => !item.isDeleted);

  const renderHead = (
    <Fragment>
      <div className={styles.title}>{t('admin.items.title')}</div>
      <Link className="btn btn-primary ml-2" to={Routes.AdminItemCreate}>
        <PlusTwoTone />
        <span>{t('admin.items.addItemLabel')}</span>
      </Link>
      <button className="btn btn-outline-primary ml-2 mr-4" onClick={() => exportToJsonFile(items)}>
        {t('common.exportToJSON')}
      </button>
    </Fragment>
  );

  const renderBody = (
    <Fragment>
      {itemList.length ? (
        itemList.map((item) => renderItem(item))
      ) : (
        <div className={styles.empty}>{t('admin.items.emptyListMessage')}</div>
      )}
    </Fragment>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default ItemList;
