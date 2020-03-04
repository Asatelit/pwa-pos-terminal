import React, { Fragment, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { DashboardTwoTone, CardOutlineTwoTone, FolderTwoTone, TabletTwoTone } from 'icons';
import { Routes } from 'common/const';
import styles from './drawer.module.css';

const Drawer: React.FC = () => {
  return (
    <Fragment>
      <div className={styles.root}>
        <div className={styles.head} />
        <div className={styles.body}>
          <NavLink exact className={styles.menuItem} activeClassName={styles.menuItemActive} to={Routes.AdminDashboard}>
            <DashboardTwoTone className={styles.menuIcon} />
            <div className={styles.menuLabel}>Dashboard</div>
          </NavLink>
          <NavLink
            className={styles.menuItem}
            activeClassName={styles.menuItemActive}
            to={Routes.AdminCategoryList.replace(':id', 'root')}
          >
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
