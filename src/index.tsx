import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';
import { Terminal, Admin } from 'containers';
import { AppContextProvider } from 'hooks';
import { Routes } from 'common/const';
import * as serviceWorker from './serviceWorker';
import './index.css';

const hashHistory = createHashHistory();

const NoMatch = () => (
  <div>
    <h1>404</h1>
    Page Not Found
  </div>
);

ReactDOM.render(
    <AppContextProvider>
      <Router history={hashHistory}>
        <Switch>
          <Route path={Routes.Terminal}>
            <Terminal />
          </Route>
          <Route path={Routes.AdminDashboard}>
            <Admin />
          </Route>
          <Redirect strict from='/' to={Routes.Terminal} />
          <Route render={NoMatch} />
        </Switch>
      </Router>
    </AppContextProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
