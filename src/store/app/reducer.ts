import * as moment from 'moment';
import { createReducer } from '../../utils/createReducer';
import { AppActionTypes as Action, AppState, OrderHistoryItem, SummaryHistoryItem } from './types';

const initialState: AppState = {
  actualProductData: {},
  actualTabIdx: 0,
  cart: [],
  stock: [],
  orderHistory: [],
  summaryHistory: [],
  isProductDialogOpened: false,
  isHistoryDialogOpened: false,
  images: {},
  columnsCount: 3,
};

const reducer = createReducer(initialState, {
  [Action.RECEIVE_IMAGE]: (state, data) => ({ ...state, images: { ...state.images, ...data } }),

  [Action.RECEIVE_MARKET_DATA]: (state, stock) => ({ ...state, stock }),

  [Action.UPDATE_COLUMN_GRID]: (state, columnsCount) => ({ ...state, columnsCount }),

  [Action.CHANGE_CATEGORY_TAB]: (state, actualTabIdx) => ({ ...state, actualTabIdx }),

  [Action.REMOVE_FROM_CART]: (state, index) => ({
    ...state,
    cart: state.cart.filter((item, itemIdx: number) => index !== itemIdx),
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
    actualProductData,
    isProductDialogOpened: true,
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
    const startTime = state.cart[0].time;
    const orderData: OrderHistoryItem = {
      startTime,
      closeTime: moment(),
      turnaroundTime: `${moment().diff(startTime, 'minutes')} m.`,
      numberOfSKU: state.cart.length,
      numberOfItems: state.cart.map(el => (el.quantity || 0)).reduce((acc, qty) => acc + qty),
      summary: state.cart.reduce((acc, obj) => acc + (obj.sum || 0), 0),
      status: isCompleted,
      items: state.cart,
    };

    const orderHistory = [...state.orderHistory, orderData];

    const summaryHistory: SummaryHistoryItem[] = [];

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

export { reducer as appReducer };
