import React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from 'common/const';
import { PlusTwoTone, TrashCanOutlineTwoTone } from 'common/icons';
import { getCategoryById } from 'common/assets';
import { Category, Item, AppActions } from 'common/types';
import { getTextIdentifier, financial } from 'common/utils';
import styles from './itemList.module.css';

type ItemListProps = {
  items: Item[];
  categories: Category[];
  actions: AppActions;
};

const ItemList: React.FC<ItemListProps> = ({ categories, items, actions }) => {
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

  const renderItem = (data: Item) => (
    <Link key={data.id} className={styles.entity} to={Routes.AdminItemEdit.replace(':id', `${data.id}`)}>
      {renderPresenter(data)}
      <div className={`${styles.td} ${styles.tdName}`}>{data.name}</div>
      <div className={`${styles.td} ${styles.tdCategory}`}>{getCategoryById(categories, data.parentId).name}</div>
      <div className={`${styles.td}`}>{financial(data.costPrice)}</div>
      <div className={`${styles.td}`}>{financial(data.price)}</div>
      <button className={styles.iconBtn} onClick={evt => handleOnClickOnDeleteBtn(evt, data.id)}>
        <TrashCanOutlineTwoTone />
      </button>
    </Link>
  );

  const itemList = items.filter(item => !item.isDeleted);

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <div className={styles.itemInfo}>
          <span className={styles.itemName}>Items</span>
        </div>
        <Link className={styles.primaryBtn} to={Routes.AdminItemCreate}>
          <PlusTwoTone />
          <span>New Item</span>
        </Link>
      </div>
      <div className={styles.body}>
        {itemList.length ? (
          itemList.map(item => renderItem(item))
        ) : (
          <div className={styles.empty}>There are no items here.</div>
        )}
      </div>
    </div>
  );
};

export default ItemList;
