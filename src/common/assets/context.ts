import { Entities } from 'common/const';
import {
  AppContext,
  AppContextResponseArray,
  AppContextResponseObject,
  AppState,
  AppViews,
  AppActions,
  AppHelpers,
  SettingsCurrencyPosition,
} from 'common/types';

export const INIT_SETTINGS = {
  currency: '$',
  currencyPosition: SettingsCurrencyPosition.Right,
  isAllowPrintCheck: false,
  lang: 'default',
  logo: '',
  logoUrl: '',
  name: '',
  paymentMethods: [],
  predictions: [],
  printAddress: false,
  printCheckDuplicate: false,
  printPrediction: false,
  printReceipt: false,
  printReceiptByDefault: false,
  printReceiptComment: false,
  printReceiptDuplicate: false,
  printReceiptNumber: false,
  printSumWeightOnReceipt: false,
  printWifi: false,
  timezone: '',
  tipAmount: 0,
  useFastPay: false,
  useFiscalization: false,
  useKitchen: false,
  usePromotions: false,
  useTables: false,
  wifiName: '',
  wifiPass: '',
};

export const INIT_STATE: AppState = {
  categories: [],
  closedOrders: [],
  currentCategoryId: Entities.RootCategoryId,
  currentItemId: null,
  currentOrderId: null,
  currentTableId: null,
  currentUserId: null,
  isLoading: true,
  orders: [],
  items: [],
  settings: INIT_SETTINGS,
  taxes: [],
};

const INIT_ACTIONS = {} as AppActions;
const INIT_VIEWS = {} as AppViews;
const INIT_HELPERS = {} as AppHelpers;

const responseArray: AppContextResponseArray = [INIT_STATE, INIT_ACTIONS, INIT_VIEWS, INIT_HELPERS];

const responseObject: AppContextResponseObject = {
  state: INIT_STATE,
  actions: INIT_ACTIONS,
  views: INIT_VIEWS,
  helpers: INIT_HELPERS,
};

export const INIT_CONTEXT: AppContext = Object.assign(responseArray, responseObject);
