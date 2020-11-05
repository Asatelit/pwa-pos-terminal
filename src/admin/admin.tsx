import React, { Fragment, useContext, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { appContext } from 'common/contexts';
import { Routes as R } from 'common/enums';
import { LoadScreen } from 'common/components';
import { setDocumentTitle } from 'common/utils';
import { Drawer } from './components';
import { Dashboard, Settings, CategoryEditor, CategoryList, ItemList, ItemEditor, TaxList, TaxEditor } from './layouts';
import styles from './admin.module.css';

const Admin: React.FC = () => {
  const { state: context, actions, helpers, views } = useContext(appContext);
  const { isLoading, categories, settings, items, taxes } = context;
  const { translation } = helpers;
  const { t } = translation;

  useEffect(() => {
    const title = [t('admin.title')];
    setDocumentTitle(title);
  }, [t]);

  if (isLoading) return <LoadScreen />;

  // prettier-ignore
  const routes = [
    { path: R.AdminDashboard, c: <Dashboard translation={translation} views={views} /> },
    { path: R.AdminCategoryList, c: <CategoryList categories={categories} actions={actions} /> },
    { path: R.AdminCategoryEdit, c: <CategoryEditor categories={categories} actions={actions} /> },
    { path: R.AdminCategoryCreate, c: <CategoryEditor createMode categories={categories} actions={actions} /> },
    { path: R.AdminItemList, c: <ItemList categories={categories} items={items} actions={actions} translation={translation} /> },
    { path: R.AdminItemEdit, c: <ItemEditor items={items} categories={categories} taxes={taxes} actions={actions} /> },
    { path: R.AdminItemCreate, c: <ItemEditor items={items} categories={categories} taxes={taxes} actions={actions} /> },
    { path: R.AdminSettings, c: <Settings settings={settings} actions={actions} /> },
    { path: R.AdminTaxList, c: <TaxList taxes={taxes} actions={actions} /> },
    { path: R.AdminTaxEdit, c: <TaxEditor taxes={taxes} actions={actions} /> },
    { path: R.AdminTaxCreate, c: <TaxEditor taxes={taxes} actions={actions} /> },
  ];

  return (
    <div className={styles.root}>
      <Switch>
        <Fragment>
          <div className={styles.nav}>
            <Drawer translation={translation} />
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
