import accounting from 'accounting';
import localForage from 'localforage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppContext,
  AppState,
  AppActions,
  AppViews,
  AppHelpers,
  AppContextResponseArray,
  AppContextResponseObject,
} from 'common/types';
import { INIT_CONTEXT, INIT_STATE } from 'common/assets';
import { I18nContext } from 'common/contexts';
import { IS_DEMO_MODE } from 'config';
import * as A from '../creators/actions';
import { createClosedOrdersViews, createTranslationHelper } from '../creators';
import { getDemoData } from 'common/utils/demo';
import { CurrencyPosition } from 'common/enums';

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
  const { dateDnsLocales, supportedLocales } = useContext(I18nContext);
  const { i18n, t } = useTranslation();

  const [state, setState] = useState<AppState>(INIT_STATE);

  useEffect(() => {
    (async function updateState() {
      let demoData: Partial<AppState> = {};
      // Load data to display the application in demo mode
      if (IS_DEMO_MODE) demoData = getDemoData();
      // Rehydrate the app state
      const state = await readContextFromLocalStorage(INIT_STATE);
      // Setting up user preference settings
      if (state.settings.lang !== 'default') i18n.changeLanguage(state.settings.lang);
      accounting.settings = {
        currency: {
          symbol: state.settings.currency, // default currency symbol is '$'
          format: state.settings.currencyPosition === CurrencyPosition.Left ? '%s %v' : '%v %s', // controls output: %s = symbol, %v = value/number
          decimal: '.', // decimal point separator
          thousand: ',', // thousands separator
          precision: 2, // decimal places
        },
        number: {
          precision: 2,
          thousand: ',',
          decimal: '.',
        },
      };
      // Update the app state
      setState({ ...state, ...demoData, isLoading: false });
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
    category: A.createCategoryActions(state, updateContext),
    orders: A.createOrdersActions(state, updateContext),
    item: A.createItemActions(state, updateContext),
    settings: A.createSettingsActions(state, updateContext),
    taxes: A.createTaxActions(state, updateContext),
  };

  const views: AppViews = {
    closedOrders: createClosedOrdersViews(state),
  };

  const helpers: AppHelpers = {
    translation: createTranslationHelper(state, { i18n, t, dateDnsLocales, supportedLocales }),
  };

  const responseArray: AppContextResponseArray = [state, actions, views, helpers];
  const responseObject: AppContextResponseObject = { state, actions, views, helpers };

  return <appContext.Provider value={Object.assign(responseArray, responseObject)}>{children}</appContext.Provider>;
};
