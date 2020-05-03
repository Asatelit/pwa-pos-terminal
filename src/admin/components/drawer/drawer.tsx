import React, { Fragment } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { DashboardTwoTone, CardOutlineTwoTone, FolderTwoTone, TabletTwoTone, SettingsTwoTone, TaxesTwoTone } from 'common/icons';
import { Routes } from 'common/const';
import styles from './drawer.module.css';

type DrawerNavLink = { name: string, to: string, icon: JSX.Element };

const Drawer: React.FC = () => {
  const nav: DrawerNavLink[] = [
    { to: Routes.AdminDashboard, name: 'Dashboard', icon: <DashboardTwoTone /> },
    { to: Routes.AdminCategoryList.replace(':id', 'root'), name: 'Categories', icon: <FolderTwoTone /> },
    { to: Routes.AdminItemList, name: 'Items', icon: <CardOutlineTwoTone /> },
    { to: Routes.AdminTaxList, name: 'Taxes', icon: <TaxesTwoTone /> },
    { to: Routes.AdminSettings, name: 'Settings', icon: <SettingsTwoTone /> },
  ];

  const renderNavLink = ({ name, to, icon }: DrawerNavLink) => (
    <NavLink key={`AdminNavLink_${name}`} className={styles.menuItem} activeClassName={styles.menuItemActive} exact to={to}>
      <div className={styles.menuIcon}>{icon}</div>
      <div className={styles.menuLabel}>{name}</div>
    </NavLink>
  );

  return (
    <Fragment>
      <div className={styles.root}>
        <div className={styles.head} />
        <div className={styles.body}>
          {nav.map(entity => renderNavLink(entity))}
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
