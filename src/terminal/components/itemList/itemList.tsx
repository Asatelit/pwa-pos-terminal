import React, { Fragment, useState } from 'react';
import { Item, Category, AppActions } from 'common/types';
import { Breadcrumbs } from 'common/components';
import { Card, Search } from './components';
import styles from './itemList.module.css';

type ItemListProps = {
  categories: Category[];
  products: Item[];
  currentCategoryId: number;
  services: AppActions;
};

const ItemList: React.FC<ItemListProps> = ({ categories, products, currentCategoryId, services }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const hasSearchTerm = !!searchTerm;

  const visibleCategories = categories.filter(
    cat => !cat.isDeleted && !cat.isHidden && cat.parentId === currentCategoryId,
  );

  const visibleItems = products.filter(
    product => !product.isDeleted && !product.isHidden && product.parentId === currentCategoryId,
  );

  const filteredItems = hasSearchTerm
    ? products.filter(
        product =>
          !product.isDeleted && !product.isHidden &&
          (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.barcode.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : [];

  const changeCurrentCategory = (categoryId: number) => services.category.select(categoryId);

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

  const renderFilteredItems = () => <Fragment>{renderItems(filteredItems)}</Fragment>;

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
      <div className={styles.body}>{hasSearchTerm ? renderFilteredItems() : renderContent()}</div>
    </div>
  );
};

export default ItemList;
