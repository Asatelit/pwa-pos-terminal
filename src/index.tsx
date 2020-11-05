import ReactDOM from 'react-dom';
import React, { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { AppContextProvider, I18nContextProvider } from 'common/contexts';
import { Routes } from 'common/enums';
import { LoadScreen } from 'common/components';
import Terminal from './terminal/terminal';
import Admin from './admin/admin';
import * as serviceWorker from './serviceWorker';
import './i18n';
import './bootstrap.scss';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'react-toastify/dist/ReactToastify.css';
import './colors.scss';
import './index.css';

const NoMatch = () => (
  <div>
    <h1>404</h1>
    Page Not Found
  </div>
);

ReactDOM.render(
  <Suspense fallback={<LoadScreen />}>
    <I18nContextProvider>
      <AppContextProvider>
        <ToastContainer position="bottom-left" limit={3} />
        <HashRouter>
          <Switch>
            <Route path={Routes.Terminal}>
              <Terminal />
            </Route>
            <Route path={Routes.AdminDashboard}>
              <Admin />
            </Route>
            <Redirect strict from="/" to={Routes.Terminal} />
            <Route path="*" render={NoMatch} />
          </Switch>
        </HashRouter>
      </AppContextProvider>
    </I18nContextProvider>
  </Suspense>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
