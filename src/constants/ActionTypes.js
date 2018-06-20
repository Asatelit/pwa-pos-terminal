import keyMirror from '../utils/keyMirror';

const ActionTypes = keyMirror({
  RECEIVE_MARKET_DATA: null,
  REQUEST_MARKET_DATA: null,
  FAILURE_MARKET_DATA: null,
  CHANGE_CATEGORY_TAB: null,
  OPEN_HISTORY_DIALOG: null,
  CLOSE_HISTORY_DIALOG: null,
  OPEN_PRODUCT_DIALOG: null,
  CLOSE_PRODUCT_DIALOG: null,
  REMOVE_FROM_CART: null,
  CLEAR_CART: null,
  CLEAR_ORDER_HISTORY: null,
  UPDATE_ORDER_HISTORY: null,
  UPDATE_COLUMN_GRID: null,
});

export default ActionTypes;
