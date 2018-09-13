import { combineReducers, Dispatch, Action, AnyAction } from 'redux';
import { all, fork } from 'redux-saga/effects';

// Import state types and reducers
import { AppState, appReducer } from './app';
import appSaga from './app/sagas';

// The top-level state object
export interface ApplicationState {
  app: AppState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
export const rootReducer = combineReducers<ApplicationState>({
  app: appReducer,
});

// Here we use `redux-saga` to trigger actions asynchronously.
export function* rootSaga() {
  yield all([fork(appSaga)]);
}
