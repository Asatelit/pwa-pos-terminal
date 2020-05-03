import React, { useState, useEffect } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { PlusTwoTone, TrashCanOutlineTwoTone, EditSquareOutlineTwoTone } from 'common/icons';
import { Category, AppActions } from 'common/types';
import { getTextIdentifier } from 'common/utils';
import { Routes } from 'common/const';
import { Breadcrumbs } from 'common/components';
import styles from './categoryList.module.css';

type CreateItemFormProps = {
  categories: Category[];
  actions: AppActions;
};

const CategoryList: React.FC<CreateItemFormProps> = ({ categories, actions }) => {
  const [redirect, setRedirect] = useState('');

  // handle route params
  const { id } = useParams();
  const selectedCategoryId = Number(id) || 0;

  useEffect(() => {
    setRedirect('');
  }, [selectedCategoryId]);

  // handle redirect
  if (redirect) return <Redirect to={redirect} />;

  // redirect helper
  const updateRedirect = (categoryId: number) => {
    if (categoryId === selectedCategoryId) return;
    setRedirect(Routes.AdminCategoryList.replace(':id', categoryId ? categoryId.toString() : 'root'))
  };

  const handleOnChangeBreadCrumbs = (categoryId: number) => updateRedirect(categoryId);
  const handleOnClickOnCategoryListItem = (categoryId: number) => updateRedirect(categoryId);

  const handleOnClickOnCategoryListItemDelete = (event: React.MouseEvent, categoryId: number) => {
    event.stopPropagation();
    actions.category.remove(categoryId);
  };

  const handleOnClickOnCategoryListItemEdit = (event: React.MouseEvent, categoryId: number) => {
    event.stopPropagation();
    setRedirect(Routes.AdminCategoryEdit.replace(':id', categoryId.toString()));
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
    <div key={item.id} className={styles.item} onClick={() => handleOnClickOnCategoryListItem(item.id)}>
      {renderPresenter(item)}
      <div className={styles.name}>{item.name}</div>
      <button className={styles.iconBtn} onClick={evt => handleOnClickOnCategoryListItemEdit(evt, item.id)}>
        <EditSquareOutlineTwoTone />
      </button>
      <button className={styles.iconBtn} onClick={evt => handleOnClickOnCategoryListItemDelete(evt, item.id)}>
        <TrashCanOutlineTwoTone />
      </button>
    </div>
  );

  // render component
  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <div className={styles.itemInfo}>
          <span className={styles.itemName}>Category</span>
        </div>
        <Link className={styles.primaryBtn} to={Routes.AdminCategoryCreate.replace(':id', selectedCategoryId.toString())}>
          <PlusTwoTone />
          <span>New Category</span>
        </Link>
      </div>
      <div className={styles.body}>
        <Breadcrumbs
          className={styles.breadcrumbs}
          categories={categories}
          currentCategoryId={Number(selectedCategoryId)}
          onChange={handleOnChangeBreadCrumbs}
        />
        {visibleCategories.length ? (
          visibleCategories.map(item => renderCategory(item))
        ) : (
          <div className={styles.empty}>There are no items here.</div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
