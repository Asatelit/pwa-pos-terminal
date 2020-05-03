import React, { Fragment } from 'react';
import { ChevronRightTwoTone } from 'common/icons';
import { Category } from 'common/types';
import styles from './breadcrumbs.module.css';

export type BreadcrumbsProps = {
  categories: Category[];
  currentCategoryId: number;
  onChange: (categoryId: number) => void;
  className?: string;
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ categories, currentCategoryId, onChange, className = '' }) => {
  const rootCategory = 0;
  const currentCategory = categories.find(category => currentCategoryId === category.id);
  const middleCategory = currentCategory
    ? categories.find(category => currentCategory.parentId === category.id)
    : undefined;

  const resetCurrentCategory = () => onChange(rootCategory);
  const changeCurrentCategory = (categoryId: number) => onChange(categoryId);

  const renderRootSegment = (
    <div className={styles.segment} onClick={resetCurrentCategory}>
      Home Screen
    </div>
  );

  const renderMiddleSegment = !!middleCategory && middleCategory.id !== rootCategory && (
    <Fragment>
      <div className={styles.divider}>
        <ChevronRightTwoTone fontSize="small" />
      </div>
      <div className={styles.segment} onClick={() => changeCurrentCategory(middleCategory.id)}>
        {middleCategory.parentId === rootCategory ? middleCategory.name : '...'}
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
