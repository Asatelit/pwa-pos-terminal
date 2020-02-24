import React, { Fragment, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CardOutlineTwoTone, FolderTwoTone, ChevronRightTwoTone, TabletTwoTone } from 'icons';
import { Routes } from 'common/const';
import styles from './drawer.module.css';

type DrawerProps = {
  onClose: () => void;
};

const Drawer: React.FC<DrawerProps> = ({ onClose }) => {
  const handleOnClickOnClose = () => onClose();

  return (
    <Fragment>
      <div className={styles.root}>
        <div className={styles.head}>

        </div>
        <div className={styles.body}>
          <NavLink className={styles.menuItem} activeClassName={styles.menuItemActive} to={Routes.AdminCategoryList}>
            <div className={styles.menuIcon}>
              <FolderTwoTone />
            </div>
            <div className={styles.menuLabel}>Categories</div>
          </NavLink>
          <NavLink className={styles.menuItem} activeClassName={styles.menuItemActive} to={Routes.AdminItemList}>
            <div className={styles.menuIcon}>
              <CardOutlineTwoTone />
            </div>
            <div className={styles.menuLabel}>Items</div>
          </NavLink>
        </div>
        <div className={styles.foot}>
          <Link className={styles.menuItem} to={Routes.Terminal}>
            <div className={styles.menuIcon}>
              <TabletTwoTone />
            </div>
            <div className={styles.menuLabel}>Back to terminal</div>
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

export default Drawer;
