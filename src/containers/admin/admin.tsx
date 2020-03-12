import React, { Fragment, useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { AppContext } from 'hooks';
import { Routes } from 'common/const';
import { LoadScreen } from 'common/components';
import { CategoryEditor, CategoryList, ItemList, ItemEditor, Dashboard, CommonSettings } from './layouts';
import { Drawer } from './components';
import styles from './admin.module.css';

const Admin: React.FC = () => {
  const [context, updateContext, services] = useContext(AppContext);
  const { isLoading, categories, settings, products, closedOrders } = context;

  if (isLoading) return <LoadScreen />;

  return (
    <div className={styles.root}>
      <Switch>
        <Fragment>
          <div className={styles.nav}>
            <Drawer />
          </div>
          <div className={styles.content}>
            <Route exact path={Routes.AdminDashboard}>
              <Dashboard closedOrders={closedOrders} />
            </Route>
            <Route exact path={Routes.AdminCategoryList}>
              <CategoryList categories={categories} services={services} />
            </Route>
            <Route exact path={Routes.AdminCategoryEdit}>
              <CategoryEditor categories={categories} services={services} />
            </Route>
            <Route exact path={Routes.AdminCategoryCreate}>
              <CategoryEditor createMode categories={categories} services={services} />
            </Route>
            <Route path={Routes.AdminItemList}>
              <ItemList categories={categories} items={products} services={services} />
            </Route>
            <Route exact path={Routes.AdminItemEdit}>
              <ItemEditor items={products} categories={categories} service={services} />
            </Route>
            <Route exact path={Routes.AdminItemCreate}>
              <ItemEditor items={products} categories={categories} service={services} />
            </Route>
            <Route exact path={Routes.AdminSettings}>
              <CommonSettings settings={settings} service={services} />
            </Route>
          </div>
        </Fragment>
      </Switch>
    </div>
  );
};

export default Admin;
