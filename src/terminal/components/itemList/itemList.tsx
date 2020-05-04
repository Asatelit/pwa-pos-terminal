import React, { Fragment, useState } from 'react';
import { Item, Category, AppActions } from 'common/types';
import { Breadcrumbs } from 'common/components';
import { getVisibleCategories, getVisibleItems } from 'common/assets';
import { Card, Search } from './components';
import styles from './itemList.module.css';

type ItemListProps = {
  categories: Category[];
  items: Item[];
  currentCategoryId: string | null;
  services: AppActions;
};

const ItemList: React.FC<ItemListProps> = ({ categories, items, currentCategoryId, services }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // helpers
  const visibleCategories = getVisibleCategories(currentCategoryId, categories);
  const visibleItems = getVisibleItems(currentCategoryId, items, searchTerm);

  // handlers
  const changeCurrentCategory = (categoryId: string | null) => services.category.select(categoryId);

  // render items
  const renderItems = (items: Item[]) => {
    if (!items.length) {
      return <div className={styles.empty}>There are no items in this category</div>;
    }
    return (
      <Fragment>
        {items.map(product => (
          <Card
            key={`product-${product.id}`}
            label={product.name}
            price={product.price}
            picture={product.picture}
            color={product.color}
            onClick={() => services.orders.addItem(product)}
          />
        ))}
      </Fragment>
    );
  };

  // render filtered content
  const renderFilteredItems = () => <Fragment>{renderItems(visibleItems)}</Fragment>;

  // render visible categories and items
  const renderContent = () => (
    <Fragment>
      {visibleCategories.map(category => (
        <Card
          key={`category-${category.id}`}
          label={category.name}
          color={category.color}
          picture={category.picture}
          onClick={() => changeCurrentCategory(category.id)}
        />
      ))}
      {!!visibleCategories.length && <div className={styles.divider} />}
      {renderItems(visibleItems)}
    </Fragment>
  );

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <Breadcrumbs
          categories={categories}
          currentCategoryId={currentCategoryId}
          onChange={changeCurrentCategory}
        />
        <Search onChange={setSearchTerm} />
      </div>
      <div className={styles.body}>{!searchTerm ? renderContent() : renderFilteredItems()}</div>
    </div>
  );
};

export default ItemList;
