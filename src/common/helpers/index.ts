import { Helper, SettingsCurrencyPosition } from 'common/types';

export type Helpers = {
  formatFinancial: (num: number) => string;
};

export const helpers: Helper<Helpers> = ({ settings }) => ({
  // Formats a number using fixed-point notation.
  formatFinancial: (num = 0) => {
    const { currency, currencyPosition } = settings;
    const amount = num.toFixed(2);
    return currencyPosition === SettingsCurrencyPosition.Right ? `${amount} ${currency}` : `${currency} ${amount}`;
  },
});
