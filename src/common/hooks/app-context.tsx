import localForage from 'localforage';
import React, { createContext, useState, useEffect } from 'react';
import { getTimestamp } from 'common/utils';
import { Context, AppState, AppActions, AppViews } from 'common/types';
import { AppInitialState } from 'common/assets';
import * as A from '../actions';
import * as W from '../views';

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

export const AppContext = createContext<Context<AppState>>(AppInitialState);

export const AppContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<AppState>(AppInitialState[0]);

  useEffect(() => {
    (async function updateState() {
      let demoData: Partial<AppState> = {};
      if (process.env.REACT_APP_DEMO_DATA) {
        demoData = await fetch(process.env.REACT_APP_DEMO_DATA)
          .then((response) => response.json())
          .then((data) => data || {})
          .catch(() => {});
      }
      const state = await readContextFromLocalStorage(AppInitialState[0]);
      demoData = JSON.parse(JSON.stringify(demoData).replaceAll('"@{currentdate}"', `${getTimestamp()}`));
      setState({ ...state, ...demoData, isLoading: false });
    })();
  }, []);

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
    closedOrders: W.closedOrdersViews(state),
  };

  return <AppContext.Provider value={[state, actions, views]}>{children}</AppContext.Provider>;
};
