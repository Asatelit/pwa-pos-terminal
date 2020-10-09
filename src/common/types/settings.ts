import { FirstDayOfTheWeek, CurrencyPosition } from 'common/enums';

export type Settings = {
  currency: string;
  currencyPosition: CurrencyPosition;
  firstDayOfTheWeek: FirstDayOfTheWeek;
  isDeniedPrintingGuestChecks: boolean;
  lang: 'default' | string;
  logo: string;
  logoUrl: string;
  name: string;
  paymentMethods: PaymentMethod[];
  predictions: string[];
  printAddress: boolean;
  printPrediction: boolean;
  printReceipt: boolean;
  printReceiptByDefault: boolean;
  printReceiptComment: boolean;
  printReceiptDuplicate: boolean;
  printReceiptNumber: boolean;
  printSumWeightOnReceipt: boolean;
  printWifi: boolean;
  timezone: string;
  tipAmount: number;
  useFastPay: boolean;
  useFiscalization: boolean;
  useKitchen: boolean;
  usePromotions: boolean;
  useTables: boolean;
  wifiName: string;
  wifiPass: string;
};

export type PaymentMethod = {
  paymentMethodId: number;
  title: string;
  icon: string;
  color: string;
  isActive: boolean;
};
