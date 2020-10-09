import React, { Fragment } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  DashboardTwoTone,
  CardOutlineTwoTone,
  FolderTwoTone,
  TabletTwoTone,
  SettingsTwoTone,
  TaxesTwoTone,
} from 'common/icons';
import { AppTranslationHelper } from 'common/types';
import { Routes as R } from 'common/enums';
import styles from './drawer.module.css';

type DrawerProps = { translation: AppTranslationHelper };
type DrawerNavLink = { name: string; to: string; icon: JSX.Element };

const Drawer: React.FC<DrawerProps> = ({ translation }) => {
  const { t } = translation;

  const nav: DrawerNavLink[] = [
    { name: t('admin.menu.dashboardLabel'), to: R.AdminDashboard, icon: <DashboardTwoTone /> },
    { name: t('admin.menu.categoriesLabel'), to: R.AdminCategoryList.replace(':id', 'root'), icon: <FolderTwoTone /> },
    { name: t('admin.menu.itemsLabel'), to: R.AdminItemList, icon: <CardOutlineTwoTone /> },
    { name: t('admin.menu.taxesLabel'), to: R.AdminTaxList, icon: <TaxesTwoTone /> },
    { name: t('admin.menu.settingsLabel'), to: R.AdminSettings, icon: <SettingsTwoTone /> },
  ];

  const renderNavLink = ({ name, to, icon }: DrawerNavLink) => (
    <NavLink
      key={`AdminNavLink_${name}`}
      className={styles.menuItem}
      activeClassName={styles.menuItemActive}
      exact
      to={to}
    >
      <div className={styles.menuIcon}>{icon}</div>
      <div className={styles.menuLabel}>{name}</div>
    </NavLink>
  );

  return (
    <Fragment>
      <div className={styles.root}>
        <div className={styles.head} />
        <div className={styles.body}>{nav.map((entity) => renderNavLink(entity))}</div>
        <div className={styles.foot}>
          <Link className={styles.menuItem} to={R.Terminal}>
            <div className={styles.menuIcon}>
              <TabletTwoTone />
            </div>
            <div className={styles.menuLabel}>{t('admin.menu.exitLabel')}</div>
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

export default Drawer;
