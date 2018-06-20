import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { persistStore, persistReducer } from 'redux-persist';
import localforage from 'localforage';
import thunk from 'redux-thunk';
import reducer from '../reducers';

/**
 * Creates a redux store with middleware and reducers using an initial state
 * @return {object} store - The created store
 */
export default function configureStore() {
  // Redux DevTools Extension. Hot Reloading with Time Travel helps to boost
  // the developer’s productivity significantly and makes the development fun.
  // https://github.com/zalmoxisus/redux-devtools-extension
  const composeEnhancers = composeWithDevTools({});

  const persistConfig = { key: 'root', storage: localforage };

  const persistedReducer = persistReducer(persistConfig, reducer);

  const enhancer = composeEnhancers(
    // Middleware is the suggested way to extend Redux with custom functionality.
    // Middleware lets you wrap the store's dispatch method for fun and profit.
    // https://redux.js.org/api-reference/applymiddleware
    applyMiddleware(
      // Redux Thunk middleware allows you to write action creators that return a function instead of an action.
      // The thunk can be used to delay the dispatch of an action, or to dispatch only if a certain condition is met.
      // The inner function receives the store methods dispatch and getState as parameters.
      // https://github.com/gaearon/redux-thunk
      thunk,
      // other middleware if any
    ),

    // other store enhancers if any
  );

  const store = createStore(persistedReducer, enhancer);
  const persistor = persistStore(store);

  if (module.hot) {
    module.hot.accept(() => {
      // This fetch the new state of the above reducers.
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(persistReducer(persistConfig, nextRootReducer));
    });
  }

  return { store, persistor };
}
