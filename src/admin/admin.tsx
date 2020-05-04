import React, { Fragment, useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { AppContext } from 'common/hooks';
import { Routes as R } from 'common/const';
import { LoadScreen } from 'common/components';
import { Drawer } from './components';
import {
  Dashboard,
  CommonSettings,
  CategoryEditor,
  CategoryList,
  ItemList,
  ItemEditor,
  TaxList,
  TaxEditor,
} from './layouts';
import styles from './admin.module.css';

const Admin: React.FC = () => {
  const [context, actions] = useContext(AppContext);
  const { isLoading, categories, settings, items: products, closedOrders, taxes } = context;

  if (isLoading) return <LoadScreen />;

  const routes = [
    { path: R.AdminDashboard, c: <Dashboard closedOrders={closedOrders} /> },
    { path: R.AdminCategoryList, c: <CategoryList categories={categories} actions={actions} /> },
    { path: R.AdminCategoryEdit, c: <CategoryEditor categories={categories} actions={actions} /> },
    { path: R.AdminCategoryCreate, c: <CategoryEditor createMode categories={categories} actions={actions} /> },
    { path: R.AdminItemList, c: <ItemList categories={categories} items={products} actions={actions} /> },
    { path: R.AdminItemEdit, c: <ItemEditor items={products} categories={categories} taxes={taxes} actions={actions} /> },
    { path: R.AdminItemCreate, c: <ItemEditor items={products} categories={categories} taxes={taxes} actions={actions} /> },
    { path: R.AdminSettings, c: <CommonSettings settings={settings} actions={actions} /> },
    { path: R.AdminTaxList, c: <TaxList taxes={taxes} actions={actions} /> },
    { path: R.AdminTaxEdit, c: <TaxEditor taxes={taxes} actions={actions} /> },
    { path: R.AdminTaxCreate, c: <TaxEditor taxes={taxes} actions={actions} /> },
  ];

  return (
    <div className={styles.root}>
      <Switch>
        <Fragment>
          <div className={styles.nav}>
            <Drawer />
          </div>
          <div className={styles.content}>
            {routes.map((route) => (
              <Route key={route.path} exact path={route.path}>
                {route.c}
              </Route>
            ))}
          </div>
        </Fragment>
      </Switch>
    </div>
  );
};

export default Admin;
