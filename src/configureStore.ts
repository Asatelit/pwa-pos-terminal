import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { persistStore, persistReducer } from 'redux-persist';
import * as localforage from 'localforage';
import reduxSaga from 'redux-saga';
import { rootReducer, rootSaga } from './store';

/**
 * Creates a redux store with middleware and reducers using an initial state
 * @return {object} store - The created store
 */
export default function configureStore() {
  // Redux DevTools Extension. Hot Reloading with Time Travel helps to boost
  // the developer’s productivity significantly and makes the development fun.
  // https://github.com/zalmoxisus/redux-devtools-extension
  const composeEnhancers = composeWithDevTools({});

  // Create the redux-saga middleware
  const sagaMiddleware = reduxSaga();

  const persistConfig = { key: 'root', storage: localforage };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const enhancer = composeEnhancers(
    // Middleware is the suggested way to extend Redux with custom functionality.
    // Middleware lets you wrap the store's dispatch method for fun and profit.
    // https://redux.js.org/api-reference/applymiddleware
    applyMiddleware(
      // Creates a Redux middleware and connects the Sagas to the Redux Store.
      // Note: passing middleware as the last argument to createStore requires redux@>=3.1.0
      // https://github.com/redux-saga/redux-saga/tree/master/docs/api#createsagamiddlewareoptions
      sagaMiddleware,
    ),

    // other store enhancers if any
  );

  const store = createStore(persistedReducer, enhancer);
  const persistor = persistStore(store);

  if (module.hot) {
    module.hot.accept(() => {
      // This fetch the new state of the above reducers.
      const nextRootReducer = require('./store/index');
      store.replaceReducer(persistReducer(persistConfig, nextRootReducer));
    });
  }

  sagaMiddleware.run(rootSaga);

  return { store, persistor };
}
