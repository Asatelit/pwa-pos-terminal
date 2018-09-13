import { Moment } from 'moment';

export interface AppState {
  actualProductData: StockItem | {};
  actualTabIdx: number;
  cart: CartItem[];
  stock: StockGroup[];
  orderHistory: OrderHistoryItem[];
  summaryHistory: SummaryHistoryItem[];
  images: Image;
  isProductDialogOpened: boolean;
  isHistoryDialogOpened: boolean;
  columnsCount: number;
}

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  picture: string;
  quantity: number;
  sum: number;
  time: Moment;
}

export interface Image {
  [key: string]: string;
}

export interface StockGroup {
  group: string;
  items: StockItem[];
}

export interface StockItem {
  id: string;
  name: string;
  description: string;
  price: number;
  picture: string;
  quantity?: number;
  sum?: number;
}

export interface OrderHistoryItem {
  startTime: Moment;
  closeTime: Moment;
  turnaroundTime: string;
  numberOfSKU: number;
  numberOfItems: number;
  summary: number;
  status: string;
  items: StockItem[];
}

export interface SummaryHistoryItem {
  id: string;
  name: string;
  quantity: number;
  total: number;
}

// Use `const enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export const enum AppActionTypes {
  REQUEST_MARKET_DATA = '@@app/REQUEST_MARKET_DATA',
  RECEIVE_MARKET_DATA = '@@app/RECEIVE_MARKET_DATA',
  FAILURE_MARKET_DATA = '@@app/FAILURE_MARKET_DATA',

  REQUEST_IMAGE = '@@app/REQUEST_IMAGE',
  RECEIVE_IMAGE = '@@app/RECEIVE_IMAGE',
  FAILURE_IMAGE = '@@app/FAILURE_IMAGE',

  UPDATE_COLUMN_GRID = '@@app/UPDATE_COLUMN_GRID',
  CHANGE_CATEGORY_TAB = '@@app/CHANGE_CATEGORY_TAB',
  REMOVE_FROM_CART = '@@app/REMOVE_FROM_CART',
  CLEAR_CART = '@@app/CLEAR_CART',
  OPEN_HISTORY_DIALOG = '@@app/OPEN_HISTORY_DIALOG',
  CLOSE_HISTORY_DIALOG = '@@app/CLOSE_HISTORY_DIALOG',
  OPEN_PRODUCT_DIALOG = '@@app/OPEN_PRODUCT_DIALOG',
  CLOSE_PRODUCT_DIALOG = '@@app/CLOSE_PRODUCT_DIALOG',
  CLEAR_ORDER_HISTORY = '@@app/CLEAR_ORDER_HISTORY',
  UPDATE_ORDER_HISTORY = '@@app/UPDATE_ORDER_HISTORY',
}
