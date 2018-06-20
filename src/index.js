import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
/* Routes */
import App from './App';
/* Global CSS */
import './index.css';

// Configure the app store
const { store, persistor } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<div>LOADING</div>} persistor={persistor}>
      <Router>
        <App />
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);

// This lets the app load faster on subsequent visits in production, and gives it offline capabilities
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#making-a-progressive-web-app
registerServiceWorker();
