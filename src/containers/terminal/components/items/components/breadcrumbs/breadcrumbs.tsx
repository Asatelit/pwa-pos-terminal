import React, { Fragment, useContext } from 'react';
import { TerminalContext, TerminalInitialState } from 'hooks';
import { ChevronRightTwoTone } from 'icons';
import styles from './breadcrumbs.module.css';

const Breadcrumbs: React.FC = () => {
  const [terminalState, setTerminalState] = useContext(TerminalContext);
  const { categories, currentCategoryId } = terminalState;
  const rootCategory = TerminalInitialState[0].currentCategoryId;
  const currentCategory = categories.find(category => currentCategoryId === category.id);
  const middleCategory = currentCategory
    ? categories.find(category => currentCategory.parentId === category.id)
    : undefined;

  const resetCurrentCategory = () => setTerminalState({ currentCategoryId: rootCategory });
  const changeCurrentCategory = (categoryId: number) => setTerminalState({ currentCategoryId: categoryId });

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
