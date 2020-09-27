import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { AppContextProvider } from 'common/hooks';
import { Routes } from 'common/const';
import Terminal from './terminal/terminal';
import Admin from './admin/admin';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './colors.css';
import './index.css';

const NoMatch = () => (
  <div>
    <h1>404</h1>
    Page Not Found
  </div>
);

ReactDOM.render(
  <AppContextProvider>
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
  </AppContextProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
