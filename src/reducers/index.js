import { combineReducers } from 'redux';
import app from './app';

// Turns an object whose values are different reducing functions into a single reducing function
// https://redux.js.org/api-reference/combinereducers
const rootReducer = combineReducers({
  app,
});

export default rootReducer;
