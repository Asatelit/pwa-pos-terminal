import React, { Fragment, useState } from 'react';
import { Item, Category, AppActions, AppTranslationHelper } from 'common/types';
import { Breadcrumbs } from 'common/components';
import { getVisibleCategories, getVisibleItems } from 'common/assets';
import { Card, Search } from './components';
import styles from './itemList.module.css';

type ItemListProps = {
  categories: Category[];
  currentCategoryId: string;
  translation: AppTranslationHelper;
  items: Item[];
  services: AppActions;
};

const ItemList: React.FC<ItemListProps> = ({ translation, categories, items, currentCategoryId, services }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = translation;

  // helpers
  const visibleCategories = getVisibleCategories(currentCategoryId, categories);
  const visibleItems = getVisibleItems(currentCategoryId, items, searchTerm);

  // handlers
  const changeCurrentCategory = (categoryId: string) => services.category.select(categoryId);

  // render items
  const renderItems = (items: Item[]) => {
    if (!items.length) {
      return <div className={styles.empty}>{t('admin.items.emptyListMessage')}</div>;
    }
    return (
      <Fragment>
        {items.map((product) => (
          <Card
            color={product.color}
            translation={translation}
            key={`product-${product.id}`}
            label={product.name}
            onClick={() => services.orders.addItem(product)}
            picture={product.picture}
            price={product.price}
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
      {visibleCategories.map((category) => (
        <Card
          color={category.color}
          translation={translation}
          key={`category-${category.id}`}
          label={category.name}
          onClick={() => changeCurrentCategory(category.id)}
          picture={category.picture}
        />
      ))}
      {!!visibleCategories.length && <div className={styles.divider} />}
      {renderItems(visibleItems)}
    </Fragment>
  );

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <Breadcrumbs categories={categories} currentCategoryId={currentCategoryId} onChange={changeCurrentCategory} />
        <Search onChange={setSearchTerm} />
      </div>
      <div className={styles.body}>{!searchTerm ? renderContent() : renderFilteredItems()}</div>
    </div>
  );
};

export default ItemList;
