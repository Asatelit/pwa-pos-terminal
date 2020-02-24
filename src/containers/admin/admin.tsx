import React, { Fragment, useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { AppContext } from 'hooks';
import { Routes } from 'common/const';
import { CategoryList, ItemList, ItemEditor, Drawer } from './components';
import styles from './admin.module.css';

const Admin: React.FC = () => {
  const [context, updateContext, services] = useContext(AppContext);
  const { categories, products } = context;

  return (
    <div className={styles.root}>
      <Switch>
        <Fragment>
          <div className={styles.nav}>
            <Drawer onClose={() => null} />
          </div>
          <div className={styles.content}>
            <Route path={Routes.AdminCategoryList}>
              <CategoryList categories={categories} services={services} />
            </Route>
            <Route path={Routes.AdminItemList}>
              <ItemList items={products} services={services} />
            </Route>
            <Route exact path={Routes.AdminItemEdit}>
              <ItemEditor items={products} categories={categories} service={services} />
            </Route>
            <Route exact path={Routes.AdminItemCreate}>
              <ItemEditor items={products} categories={categories} service={services} />
            </Route>
          </div>
        </Fragment>
      </Switch>
    </div>
  );
};

export default Admin;
