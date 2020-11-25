import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlusTwoTone, TrashCanOutlineTwoTone, EditSquareOutlineTwoTone } from 'common/icons';
import { Category, AppActions } from 'common/types';
import { getTextIdentifier, setDocumentTitle, exportToJsonFile } from 'common/utils';
import { Routes, Entities } from 'common/enums';
import { Breadcrumbs } from 'common/components';
import { CommonLayout } from '../index';
import styles from './categoryList.module.css';

type CreateItemFormProps = {
  categories: Category[];
  actions: AppActions;
};

const CategoryList: React.FC<CreateItemFormProps> = ({ categories, actions }) => {
  const [redirect, setRedirect] = useState('');
  const { id } = useParams<{ id: string }>();
  const [t] = useTranslation();

  useEffect(() => {
    const title = [t('admin.title'), t('admin.categories.title')];
    setDocumentTitle(title);
  }, [t]);

  // handle route params
  const selectedCategoryId = id || Entities.RootCategoryId;

  useEffect(() => {
    setRedirect('');
  }, [selectedCategoryId]);

  // handle redirect
  if (redirect) return <Redirect to={redirect} />;

  // redirect helper
  const updateRedirect = (categoryId: string | null) => {
    if (categoryId === selectedCategoryId) return;
    setRedirect(Routes.AdminCategoryList.replace(':id', categoryId ? categoryId : 'root'));
  };

  const handleOnChangeBreadCrumbs = (categoryId: string | null) => updateRedirect(categoryId);
  const handleOnClickOnCategoryListItem = (categoryId: string | null) => updateRedirect(categoryId);

  const handleOnClickOnCategoryListItemDelete = (event: React.MouseEvent, categoryId: string | null) => {
    event.stopPropagation();
    if (categoryId === null) return;
    actions.category.remove(categoryId);
  };

  const handleOnClickOnCategoryListItemEdit = (event: React.MouseEvent, categoryId: string | null) => {
    event.stopPropagation();
    setRedirect(Routes.AdminCategoryEdit.replace(':id', categoryId || 'root'));
  };

  const visibleCategories = categories.filter(
    (entity) => !entity.isDeleted && !entity.isHidden && entity.parentId === selectedCategoryId,
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
    <div key={`${item.id}`} className={styles.item} onClick={() => handleOnClickOnCategoryListItem(item.id)}>
      {renderPresenter(item)}
      <div className={styles.name}>{item.name.replace('Home Screen', t('common.homeScreen'))}</div>
      <button className="btn btn-link" onClick={(evt) => handleOnClickOnCategoryListItemEdit(evt, item.id)}>
        <EditSquareOutlineTwoTone />
      </button>
      <button className="btn btn-link" onClick={(evt) => handleOnClickOnCategoryListItemDelete(evt, item.id)}>
        <TrashCanOutlineTwoTone />
      </button>
    </div>
  );

  const renderHead = (
    <Fragment>
      <div className={styles.title}>{t('admin.categories.title')}</div>
      <Link className="btn btn-primary" to={Routes.AdminCategoryCreate.replace(':id', selectedCategoryId || 'root')}>
        <PlusTwoTone />
        <span>{t('admin.categories.addCategoryLabel')}</span>
      </Link>
      <button className="btn btn-outline-primary ml-2 mr-4" onClick={() => exportToJsonFile(categories)}>
        {t('common.exportToJSON')}
      </button>
    </Fragment>
  );

  const renderBody = (
    <Fragment>
      <Breadcrumbs
        className={styles.breadcrumbs}
        categories={categories}
        currentCategoryId={selectedCategoryId}
        onChange={handleOnChangeBreadCrumbs}
      />
      {visibleCategories.length ? (
        visibleCategories.map((item) => renderCategory(item))
      ) : (
        <div className={styles.empty}>{t('admin.categories.emptyListMessage')}</div>
      )}
    </Fragment>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default CategoryList;
