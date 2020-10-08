import localForage from 'localforage';
import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getTimestamp } from 'common/utils';
import { AppContext, AppState, AppActions, AppViews, AppHelpers } from 'common/types';
import { INIT_CONTEXT, INIT_STATE } from 'common/assets';
import { DEMO_DATA_PATH } from 'config';
import * as A from '../actions';
import { closedOrdersViews } from '../views';
import { helpers as contextHelpers } from '../helpers';

const store = localForage.createInstance({
  driver: localForage.INDEXEDDB,
  name: 'AsatelitPOS',
});

const readContextFromLocalStorage = (initState: AppState): Promise<AppState> => {
  // get parsed state from local storage
  return store
    .getItem('state')
    .then((state) => (state ? { ...initState, ...JSON.parse(state as string) } : initState))
    .catch((err) => {
      throw new Error(`Cannot read storage data. Error: ${err}`);
    });
};

export const appContext = createContext<AppContext>(INIT_CONTEXT);

export const AppContextProvider: React.FC = ({ children }) => {
  const { i18n } = useTranslation();
  const [state, setState] = useState<AppState>(INIT_STATE);

  useEffect(() => {
    (async function updateState() {
      let demoData: Partial<AppState> = {};
      // Load data to display the application in demo mode
      if (DEMO_DATA_PATH) {
        demoData = await fetch(DEMO_DATA_PATH)
          .then((response) => response.json())
          .then((data) => data || {})
          .catch(() => {});
      }
      // Demo mode data parsing
      demoData = JSON.parse(JSON.stringify(demoData).replaceAll('"@{currentdate}"', `${getTimestamp()}`));
      // Rehydrate the app state
      const state = await readContextFromLocalStorage(INIT_CONTEXT[0]);
      // Setting up user preference settings
      if (state.settings.lang !== 'default') i18n.changeLanguage(state.settings.lang);
      // Update the app state
      setState({ ...demoData, ...state, isLoading: false });
    })();
  }, [i18n]);

  const updateContext = (value: Partial<AppState>) => {
    try {
      const newState = { ...state, ...value };
      setState(newState); // update state
      store.setItem('state', JSON.stringify(newState)); // save state to local storage
    } catch (error) {
      throw new Error('Error writing data to offline storage.');
    }
  };

  const actions: AppActions = {
    category: A.categoryAction(state, updateContext),
    orders: A.ordersAction(state, updateContext),
    item: A.itemAction(state, updateContext),
    settings: A.settingsAction(state, updateContext),
    taxes: A.taxAction(state, updateContext),
  };

  const views: AppViews = {
    closedOrders: closedOrdersViews(state),
  };

  const helpers: AppHelpers = contextHelpers(state);

  const argsArr: [AppState, AppActions, AppViews, AppHelpers] = [state, actions, views, helpers];
  const value: AppContext = Object.assign(argsArr, { state, actions, views, helpers });

  return <appContext.Provider value={value}>{children}</appContext.Provider>;
};
