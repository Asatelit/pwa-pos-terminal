import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRightTwoTone } from 'common/icons';
import { Category } from 'common/types';
import { Entities } from 'common/enums';
import styles from './breadcrumbs.module.css';

export type BreadcrumbsProps = {
  categories: Category[];
  currentCategoryId: string;
  onChange: (categoryId: string) => void;
  className?: string;
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ categories, currentCategoryId, onChange, className = '' }) => {
  const [t] = useTranslation();
  const currentCategory = categories.find(category => currentCategoryId === category.id);
  const middleCategory = currentCategory
    ? categories.find(category => currentCategory.parentId === category.id)
    : undefined;

  const resetCurrentCategory = () => onChange(Entities.RootCategoryId);
  const changeCurrentCategory = (categoryId: string) => onChange(categoryId);

  const renderRootSegment = (
    <div className={styles.segment} onClick={resetCurrentCategory}>
      {t('common.homeScreen')}
    </div>
  );

  const renderMiddleSegment = !!middleCategory && middleCategory.id !== Entities.RootCategoryId && (
    <Fragment>
      <div className={styles.divider}>
        <ChevronRightTwoTone fontSize="small" />
      </div>
      <div className={styles.segment} onClick={() => changeCurrentCategory(middleCategory.id)}>
        {middleCategory.parentId === Entities.RootCategoryId ? middleCategory.name : '...'}
      </div>
    </Fragment>
  );

  const renderLastSegment = !!currentCategory && (
    <Fragment>
      <div className={styles.divider}>
        <ChevronRightTwoTone fontSize="small" />
      </div>
      <div className={styles.segment}>{currentCategory.name}</div>
    </Fragment>
  );

  return (
    <div className={`${styles.root} ${className}`}>
      {renderRootSegment}
      {renderMiddleSegment}
      {renderLastSegment}
    </div>
  );
};

export default Breadcrumbs;
