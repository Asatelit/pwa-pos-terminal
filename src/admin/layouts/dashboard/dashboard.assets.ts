import { startOfDay, subDays, addDays, differenceInDays } from 'date-fns';
import { AppTranslationHelper, DateRange } from 'common/types';
import { Serie } from '@nivo/line';

export type DashboardChartType = 'netSales' | 'grossSales' | 'sales' | 'averageSale';

export type DashboardRangeType = 'currentWeek' | 'lastWeek' | 'd7' | 'd14' | 'd28' | 'd30';
//  | 'd90'
//  | 'm12'
//  | 'lastYear'
//  | 'currentYear'

export type RangesData = (
  translation: AppTranslationHelper,
) => {
  [key in DashboardRangeType]: { label: string; currentPeriodRange: DateRange; previousPeriodRange: DateRange };
};

type PeriodData = {
  date: Date;
  sales: number;
  grossSales: number;
  netSales: number;
  averageSale: number;
};

export type SeriesData = (
  translation: AppTranslationHelper,
  currentPeriodData: PeriodData[],
  previousPeriodData?: PeriodData[],
) => {
  [key in DashboardChartType]: Serie[];
};

export const getRangesList: RangesData = ({ t, startOfWeek }) => {
  const today = new Date();
  const startOfPreviosWeek = (date: Date) => subDays(startOfWeek(date), 7);
  const endOfPreviosWeek = (date: Date) => subDays(startOfWeek(date), 1);

  return {
    currentWeek: {
      label: t('common.dateRanges.thisWeek'),
      currentPeriodRange: { start: startOfDay(startOfWeek(today)), end: today },
      previousPeriodRange: {
        start: startOfDay(startOfPreviosWeek(today)),
        end: addDays(startOfPreviosWeek(today), differenceInDays(today, startOfWeek(today))),
      },
    },
    lastWeek: {
      label: t('common.dateRanges.lastWeek'),
      currentPeriodRange: { start: startOfDay(subDays(startOfWeek(today), 7)), end: endOfPreviosWeek(today) },
      previousPeriodRange: { start: startOfDay(subDays(startOfWeek(today), 14)), end: subDays(startOfWeek(today), 8) },
    },
    d7: {
      label: t('common.dateRanges.7days'),
      currentPeriodRange: { start: startOfDay(subDays(today, 6)), end: today },
      previousPeriodRange: { start: startOfDay(subDays(today, 14)), end: subDays(today, 8) },
    },
    d14: {
      label: t('common.dateRanges.14days'),
      currentPeriodRange: { start: startOfDay(subDays(today, 13)), end: today },
      previousPeriodRange: { start: startOfDay(subDays(today, 28)), end: subDays(today, 15) },
    },
    d28: {
      label: t('common.dateRanges.28days'),
      currentPeriodRange: { start: startOfDay(subDays(today, 27)), end: today },
      previousPeriodRange: { start: startOfDay(subDays(today, 56)), end: subDays(today, 29) },
    },
    d30: {
      label: t('common.dateRanges.30days'),
      currentPeriodRange: { start: startOfDay(subDays(today, 29)), end: today },
      previousPeriodRange: { start: startOfDay(subDays(today, 60)), end: subDays(today, 31) },
    },
    // d90: {
    //   label: t('common.dateRanges.90days'),
    //   currentPeriodRange: { start: startOfDay(subDays(today, 89)), end: today },
    //   previousPeriodRange: { start: startOfDay(subDays(today, 180)), end: subDays(today, 91) },
    // },
    // m12: {
    //   label: t('common.dateRanges.12months'),
    //   currentPeriodRange: { start: startOfDay(subDays(today, getDaysInYear(today))), end: today },
    //   previousPeriodRange: { start: startOfDay(subDays(today, getDaysInYear(today) * 2)), end: subDays(today, getDaysInYear(today)) },
    // },
    // lastYear: {
    //   label: t('common.dateRanges.thisYear'),
    //   currentPeriodRange: { start: startOfDay(startOfYear(today)), end: endOfYear(today) },
    //   previousPeriodRange: { start: startOfDay(subDays(startOfYear(today), getDaysInYear(today))), end: subDays(endOfYear(today), getDaysInYear(today)) },
    // },
    // currentYear: {
    //   label: t('common.dateRanges.lastYear'),
    //   currentPeriodRange: { start: startOfDay(startOfYear(today)), end: today },
    //   previousPeriodRange: { start: startOfDay(subDays(startOfYear(today), getDaysInYear(today))), end: subDays(today, getDaysInYear(today)) },
    // },
  };
};

export const getSeriesData: SeriesData = ({ t, formatFinancial }, currentPeriodData, previousPeriodData = []) => {
  const currentPeriodLabel = t('common.dateRanges.currentPeriod');
  const previosPeriodLabel = t('common.dateRanges.previousPeriod');

  return {
    grossSales: [
      {
        key: 'current',
        id: currentPeriodLabel,
        data: currentPeriodData.map((order) => ({
          x: order.date,
          y: formatFinancial(order.grossSales),
        })),
      },
      {
        key: 'previous',
        id: previosPeriodLabel,
        data: previousPeriodData.map((order, index) => ({
          x: currentPeriodData[index].date,
          y: formatFinancial(order.grossSales),
        })),
      },
    ],
    netSales: [
      {
        key: 'current',
        id: currentPeriodLabel,
        data: currentPeriodData.map((order) => ({
          x: order.date,
          y: formatFinancial(order.netSales),
        })),
      },
      {
        key: 'previous',
        id: previosPeriodLabel,
        data: previousPeriodData.map((order, index) => ({
          x: currentPeriodData[index].date,
          y: formatFinancial(order.netSales),
        })),
      },
    ],
    averageSale: [
      {
        key: 'current',
        id: currentPeriodLabel,
        data: currentPeriodData.map((order) => ({
          x: order.date,
          y: formatFinancial(order.averageSale),
        })),
      },
      {
        key: 'previous',
        id: previosPeriodLabel,
        data: previousPeriodData.map((order, index) => ({
          x: currentPeriodData[index].date,
          y: formatFinancial(order.averageSale),
        })),
      },
    ],
    sales: [
      {
        key: 'current',
        id: currentPeriodLabel,
        data: currentPeriodData.map((order) => ({
          x: order.date,
          y: order.sales,
        })),
      },
      {
        key: 'previous',
        id: previosPeriodLabel,
        data: previousPeriodData.map((order, index) => ({
          x: currentPeriodData[index].date,
          y: formatFinancial(order.sales),
        })),
      },
    ],
  };
};
