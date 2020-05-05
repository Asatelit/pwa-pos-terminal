import { Context, AppState } from 'common/types';
import { Entities } from 'common/const';

export const AppInitialSettings = {
  currency: '$',
  currencyCodeIso: 'USD',
  currencySymbol: '$',
  isAllowPrintCheck: false,
  lang: window.navigator.language,
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

// initial state
export const AppInitialState: Context<AppState> = [
  {
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
    settings: AppInitialSettings,
    taxes: [],
  },
  null as any,
];
