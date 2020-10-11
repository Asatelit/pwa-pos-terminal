import React, { Fragment, useContext } from 'react';
import { appContext } from 'common/contexts';
import { INIT_STATE } from 'common/assets';
import { ChevronRightTwoTone } from 'common/icons';
import styles from './breadcrumbs.module.css';

const Breadcrumbs: React.FC = () => {
  const [terminalState, service] = useContext(appContext);
  const { categories, currentCategoryId } = terminalState;
  const rootCategory = INIT_STATE.currentCategoryId;
  const currentCategory = categories.find(category => currentCategoryId === category.id);
  const middleCategory = currentCategory
    ? categories.find(category => currentCategory.parentId === category.id)
    : undefined;

  const resetCurrentCategory = () => service.category.select(rootCategory);
  const changeCurrentCategory = (categoryId: string) => service.category.select(categoryId);

  const renderRootSegment = (
    <div className={styles.segment} onClick={resetCurrentCategory}>
      All Items
    </div>
  );

  const renderMiddleSegment = !!middleCategory &&
    middleCategory.id !== rootCategory && (
      <Fragment>
        <div className={styles.divider}><ChevronRightTwoTone /></div>
        <div className={styles.segment} onClick={() => changeCurrentCategory(middleCategory.id)}>
          {middleCategory.parentId === rootCategory ? middleCategory.name : '...'}
        </div>
      </Fragment>
    );

  const renderLastSegment = !!currentCategory && (
    <Fragment>
      <div className={styles.divider}><ChevronRightTwoTone /></div>
      <div className={styles.segment}>{currentCategory.name}</div>
    </Fragment>
  );

  return (
    <div className={styles.root}>
      {renderRootSegment}
      {renderMiddleSegment}
      {renderLastSegment}
    </div>
  );
};

export default Breadcrumbs;
