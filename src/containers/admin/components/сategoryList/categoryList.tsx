import React, { useState } from 'react';
import { PlusTwoTone, TrashCanOutlineTwoTone, EditSquareOutlineTwoTone } from 'icons';
import { Category, TerminalServices } from 'types';
import { getTextIdentifier } from 'utils';
import { Breadcrumbs } from 'common/components';
import { CreateCategoryForm } from '../index';
import styles from './categoryList.module.css';

type CreateItemFormProps = {
  categories: Category[];
  services: TerminalServices;
};

const CategoryList: React.FC<CreateItemFormProps> = ({ categories, services }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [openEditDialog, toggleEditDialog] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(0);

  const handleOnClickOnDeleteBtn = (event: React.MouseEvent, categoryId: number) => {
    event.stopPropagation();
    services.removeCategory(categoryId);
  };

  const handleOnClickOnEditBtn = (event: React.MouseEvent, categoryId: number) => {
    event.stopPropagation();
    setEditCategoryId(categoryId);
  };

  const visibleCategories = categories.filter(
    entity => !entity.isDeleted && !entity.isHidden && entity.parentId === selectedCategoryId,
  );

  const renderPresenter = (category: Category) => {
    const { picture, color, name } = category;
    const style = picture ? { backgroundImage: `url(${picture})` } : { backgroundColor: color || 'inherit' };
    return (
      <div className={styles.presenter} style={style}>
        {!category.picture && getTextIdentifier(name)}
      </div>
    );
  };

  const renderCategory = (item: Category) => (
    <div key={item.id} className={styles.item} onClick={() => setSelectedCategoryId(item.id)}>
      {renderPresenter(item)}
      <div className={styles.name}>{item.name}</div>
      <button className={styles.iconBtn} onClick={evt => handleOnClickOnEditBtn(evt, item.id)}>
        <EditSquareOutlineTwoTone />
      </button>
      <button className={styles.iconBtn} onClick={evt => handleOnClickOnDeleteBtn(evt, item.id)}>
        <TrashCanOutlineTwoTone />
      </button>
    </div>
  );

  // create a new category
  if (openEditDialog)
    return <CreateCategoryForm categories={categories} services={services} onClose={() => toggleEditDialog(false)} />;

  // edit an existing category
  if (editCategoryId)
    return (
      <CreateCategoryForm
        itemId={editCategoryId}
        categories={categories}
        services={services}
        onClose={() => setEditCategoryId(0)}
      />
    );

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <div className={styles.itemInfo}>
          <span className={styles.itemName}>Category</span>
        </div>
        <button className={styles.primaryBtn} onClick={() => toggleEditDialog(true)}>
          <PlusTwoTone />
          <span>New Category</span>
        </button>
      </div>
      <div className={styles.body}>
        <Breadcrumbs
          className={styles.breadcrumbs}
          categories={categories}
          currentCategoryId={selectedCategoryId}
          onChange={setSelectedCategoryId}
        />
        {visibleCategories.length
          ? visibleCategories.map(item => renderCategory(item))
          : <div className={styles.empty}>There are no items here.</div>
        }
      </div>
    </div>
  );
};

export default CategoryList;
