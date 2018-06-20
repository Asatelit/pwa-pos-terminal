import moment from 'moment';
import Action from '../constants/ActionTypes';
import createReducer from '../utils/createReducer';
import { updateMarketData } from '../actions/appActions';

const initialState = {
  actualProductData: {},
  actualTabIdx: 0,
  cart: [],
  stock: [],
  orderHistory: [],
  summaryHistory: [],
  isProductDialogOpened: false,
  isHistoryDialogOpened: false,
  columnsCount: 3,
};

/**
 * ## App Reducers
 */
export default createReducer(initialState, {
  [Action.RECEIVE_MARKET_DATA]: (state, stock) => ({ ...state, stock }),

  [Action.UPDATE_COLUMN_GRID]: (state, columnsCount) => ({ ...state, columnsCount }),

  [Action.CHANGE_CATEGORY_TAB]: (state, actualTabIdx) => ({ ...state, actualTabIdx }),

  [Action.REMOVE_FROM_CART]: (state, index) => ({
    ...state,
    cart: state.cart.filter((item, itemIdx) => index !== itemIdx),
  }),

  [Action.CLEAR_CART]: state => ({
    ...state,
    cart: initialState.cart,
  }),

  [Action.OPEN_HISTORY_DIALOG]: state => ({
    ...state,
    isHistoryDialogOpened: true,
  }),

  [Action.CLOSE_HISTORY_DIALOG]: state => ({
    ...state,
    isHistoryDialogOpened: false,
  }),

  [Action.OPEN_PRODUCT_DIALOG]: (state, actualProductData) => ({
    ...state,
    isProductDialogOpened: true,
    actualProductData,
  }),

  [Action.CLOSE_PRODUCT_DIALOG]: (state, productData) => ({
    ...state,
    isProductDialogOpened: false,
    actualProductData: initialState.actualProductData,
    cart: productData ? [...state.cart, productData] : state.cart,
  }),

  [Action.CLEAR_ORDER_HISTORY]: state => ({
    ...state,
    orderHistory: initialState.orderHistory,
    summaryHistory: initialState.summaryHistory,
  }),

  [Action.UPDATE_ORDER_HISTORY]: (state, isCompleted) => {
    const orderData = {
      startTime: state.cart[0].time,
      closeTime: moment(),
      turnaroundTime: moment().diff(state.cart[0].time),
      numberOfSKU: state.cart.length,
      numberOfItems: parseFloat(
        state.cart.map(el => el.quantity).reduce((acc, qty) => acc + qty),
        10,
      ),
      summary: state.cart.reduce((acc, obj) => acc + obj.sum, 0),
      status: isCompleted,
      items: state.cart,
    };
    const orderHistory = [...state.orderHistory, orderData];
    const summaryHistory = [];

    // collect all the sku from order history
    const sku = orderHistory.reduce((acc, item) => [...acc, ...item.items], []);

    sku.reduce((res, value) => {
      if (!res[value.id]) {
        res[value.id] = { id: value.id, name: value.name, quantity: 0, total: 0 };
        summaryHistory.push(res[value.id]);
      }
      res[value.id].quantity += value.quantity;
      res[value.id].total += value.sum;
      return res;
    }, {});

    return {
      ...state,
      summaryHistory,
      orderHistory,
      cart: initialState.cart, // reset basket
    };
  },
});
