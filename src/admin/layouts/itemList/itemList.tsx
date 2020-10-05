import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Routes } from 'common/const';
import { getCategoryById } from 'common/assets';
import { Category, Item, AppActions } from 'common/types';
import { PlusTwoTone, TrashCanOutlineTwoTone } from 'common/icons';
import { getTextIdentifier, financial, setDocumentTitle } from 'common/utils';

import styles from './itemList.module.css';

type ItemListProps = {
  items: Item[];
  categories: Category[];
  actions: AppActions;
};

const ItemList: React.FC<ItemListProps> = ({ categories, items, actions }) => {
  const [t] = useTranslation();

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
        <div className={`${styles.td}`}>{financial(data.costPrice)}</div>
        <div className={`${styles.td}`}>{financial(data.price)}</div>
        <button className="btn btn-link" onClick={(evt) => handleOnClickOnDeleteBtn(evt, data.id)}>
          <TrashCanOutlineTwoTone />
        </button>
      </Link>
    );
  };

  const itemList = items.filter((item) => !item.isDeleted);

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <div className={styles.title}>{t('admin.items.title')}</div>
        <Link className="btn btn-primary ml-2 mr-4" to={Routes.AdminItemCreate}>
          <PlusTwoTone />
          <span>{t('admin.items.addItemLabel')}</span>
        </Link>
      </div>
      <div className={styles.body}>
        {itemList.length ? (
          itemList.map((item) => renderItem(item))
        ) : (
          <div className={styles.empty}>{t('admin.items.emptyListMessage')}</div>
        )}
      </div>
    </div>
  );
};

export default ItemList;
