import React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from 'common/const';
import { PlusTwoTone, TrashCanOutlineTwoTone } from 'icons';
import { Product, TerminalServices} from 'types';
import { getTextIdentifier, financial } from 'utils';
import styles from './itemList.module.css';

type ItemListProps = {
  items: Product[];
  services: TerminalServices;
};

const ItemList: React.FC<ItemListProps> = ({ items, services }) => {

  const handleOnClickOnDeleteBtn = (event: React.MouseEvent, itemId: number) => {
    event.preventDefault();
    event.stopPropagation();
    services.removeItem(itemId);
  };

  const renderPresenter = (data: Product) => {
    const { picture, color, name } = data;
    const style = picture ? { backgroundImage: `url(${picture})` } : { backgroundColor: color || 'inherit' };
    return (
      <div className={styles.presenter} style={style}>
        {!data.picture && getTextIdentifier(name)}
      </div>
    );
  };

  const renderItem = (data: Product) => (
    <Link key={data.id} className={styles.entity} to={Routes.AdminItemEdit.replace(':id', `${data.id}`)}>
      {renderPresenter(data)}
      <div className={styles.name}>{data.name}</div>
      <div className={styles.td}>{data.parentId}</div>
      <div className={styles.td}>{financial(data.costPrice)}</div>
      <div className={styles.td}>{financial(data.price)}</div>
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
        {itemList.length
          ? itemList.map(item => renderItem(item))
          : <div className={styles.empty}>There are no items here.</div>
        }
      </div>
    </div>
  );
};

export default ItemList;
