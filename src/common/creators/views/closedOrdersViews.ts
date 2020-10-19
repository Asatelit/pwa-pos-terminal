import { pipe, filter, groupBy, prop, curry, reduce, chain, merge, indexBy, mapObjIndexed, map, Merge } from 'ramda';
import {
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  format,
  getDay,
  getHours,
  isWithinInterval,
  parseJSON,
  startOfDay,
} from 'date-fns';
import { View, ClosedOrder, ClosedOrderItem, Item } from 'common/types';
import { medianByProp, sumByProp } from 'common/utils/ramda';

type DateRange = { start: number | Date; end: number | Date };

type ItemData = {
  quantity: number;
  amount: number;
  roundedAmount: number;
  taxAmount: number;
};

type CommonTotalResponse = {
  sales: number;
  grossSales: number;
  netSales: number;
  averageSale: number;
};

// prettier-ignore
type HeatmapByWeekdayAndHour = {
  weekday: string;
  hour_00_averageSale: number; hour_00_grossSales: number; hour_00_netSales: number; hour_00_sales: number;
  hour_01_averageSale: number; hour_01_grossSales: number; hour_01_netSales: number; hour_01_sales: number;
  hour_02_averageSale: number; hour_02_grossSales: number; hour_02_netSales: number; hour_02_sales: number;
  hour_03_averageSale: number; hour_03_grossSales: number; hour_03_netSales: number; hour_03_sales: number;
  hour_04_averageSale: number; hour_04_grossSales: number; hour_04_netSales: number; hour_04_sales: number;
  hour_05_averageSale: number; hour_05_grossSales: number; hour_05_netSales: number; hour_05_sales: number;
  hour_06_averageSale: number; hour_06_grossSales: number; hour_06_netSales: number; hour_06_sales: number;
  hour_07_averageSale: number; hour_07_grossSales: number; hour_07_netSales: number; hour_07_sales: number;
  hour_08_averageSale: number; hour_08_grossSales: number; hour_08_netSales: number; hour_08_sales: number;
  hour_09_averageSale: number; hour_09_grossSales: number; hour_09_netSales: number; hour_09_sales: number;
  hour_10_averageSale: number; hour_10_grossSales: number; hour_10_netSales: number; hour_10_sales: number;
  hour_11_averageSale: number; hour_11_grossSales: number; hour_11_netSales: number; hour_11_sales: number;
  hour_12_averageSale: number; hour_12_grossSales: number; hour_12_netSales: number; hour_12_sales: number;
  hour_13_averageSale: number; hour_13_grossSales: number; hour_13_netSales: number; hour_13_sales: number;
  hour_14_averageSale: number; hour_14_grossSales: number; hour_14_netSales: number; hour_14_sales: number;
  hour_15_averageSale: number; hour_15_grossSales: number; hour_15_netSales: number; hour_15_sales: number;
  hour_16_averageSale: number; hour_16_grossSales: number; hour_16_netSales: number; hour_16_sales: number;
  hour_17_averageSale: number; hour_17_grossSales: number; hour_17_netSales: number; hour_17_sales: number;
  hour_18_averageSale: number; hour_18_grossSales: number; hour_18_netSales: number; hour_18_sales: number;
  hour_19_averageSale: number; hour_19_grossSales: number; hour_19_netSales: number; hour_19_sales: number;
  hour_20_averageSale: number; hour_20_grossSales: number; hour_20_netSales: number; hour_20_sales: number;
  hour_21_averageSale: number; hour_21_grossSales: number; hour_21_netSales: number; hour_21_sales: number;
  hour_22_averageSale: number; hour_22_grossSales: number; hour_22_netSales: number; hour_22_sales: number;
  hour_23_averageSale: number; hour_23_grossSales: number; hour_23_netSales: number; hour_23_sales: number;
};

type CommonTotalResponseWithDate = CommonTotalResponse & { date: Date };
type CommonTotalResponseWithHour = CommonTotalResponse & { hour: string };
type CommonTotalResponseWithWeekday = CommonTotalResponse & { weekday: string };

export type TotalDataByDateRangeResponse = CommonTotalResponse & {
  groupedByDay: CommonTotalResponseWithDate[];
  groupedByHour: CommonTotalResponseWithHour[];
  groupedByWeekday: CommonTotalResponseWithWeekday[];
  heatmapByWeekdayAndHour: HeatmapByWeekdayAndHour[];
};

export type ClosedOrderViews = {
  getItemsByDateRange: (
    dataRange: DateRange,
  ) => {
    items: { [key: string]: ItemData };
    summary: ItemData;
  };
  getTotalDataByDateRange: (dataRange: DateRange) => TotalDataByDateRangeResponse;
  getDataByDateRange: (dataRange: DateRange) => ClosedOrder[];
  getDailyTotal: (day: Date) => CommonTotalResponse;
};

// Helpers
const groupByName = groupBy(prop('name'));
const getDayInterval = (day: Date) => ({ start: startOfDay(day), end: endOfDay(day) });
const mapOrderItems = reduce((acc: ClosedOrderItem[], { items }) => acc.concat(items), []);

const filterByDateRange = ({ start, end }: DateRange) =>
  filter<ClosedOrder>(({ dateClose }) => isWithinInterval(parseJSON(dateClose), { start, end }));

const filterByHour = (date: Date) =>
  filter<ClosedOrder>(({ dateClose }) => getHours(parseJSON(dateClose)) === getHours(date));

const filterByWeekday = (weekday: number) =>
  filter<ClosedOrder>(({ dateClose }) => getDay(parseJSON(dateClose)) === weekday);

const joinInnerById = (target: Item[]) =>
  curry((source: ClosedOrderItem[]): Merge<ClosedOrderItem, Item>[] => {
    const byId = prop('id');
    const indexed = indexBy(byId, target);
    return chain((t2row) => {
      const corresponding = indexed[byId(t2row)];
      return corresponding ? [merge(t2row, corresponding)] : [];
    }, source);
  });

// Main
export const createClosedOrdersViews: View<ClosedOrderViews> = (state) => ({
  getItemsByDateRange: (dateRange) => {
    const getItemSummary = mapObjIndexed((num: number, key: string, obj: any) => {
      const data = obj[key];
      return {
        quantity: sumByProp('quantity', data),
        amount: sumByProp('amount', data),
        roundedAmount: sumByProp('roundedAmount', data),
        taxAmount: sumByProp('totalTaxAmount', data),
      };
    }) as any;

    const orderItems = pipe(filterByDateRange(dateRange), mapOrderItems)(state.closedOrders);

    const summaryItems = pipe(joinInnerById(state.items), groupByName, getItemSummary)(orderItems) as any;

    const summary = {
      quantity: sumByProp('quantity', orderItems),
      amount: sumByProp('amount', orderItems),
      roundedAmount: sumByProp('roundedAmount', orderItems),
      taxAmount: sumByProp('totalTaxAmount', orderItems),
    };

    return { summary, items: summaryItems };
  },

  getTotalDataByDateRange: (dateRange) => {
    const weekdays = [0, 1, 2, 3, 4, 5, 6]; // the day of week
    const orders = filterByDateRange(dateRange)(state.closedOrders);

    const getIntervalOfEachHour = eachHourOfInterval(getDayInterval(new Date()));

    const getCommonData = (data: ClosedOrder[]): CommonTotalResponse => ({
      sales: data.length,
      grossSales: sumByProp('totalAmount', data),
      netSales: sumByProp('profit', data),
      averageSale: medianByProp('totalAmount', data),
    });

    const groupByDay = (day: Date) => {
      const data = filterByDateRange(getDayInterval(day))(orders);
      return {
        date: day,
        ...getCommonData(data),
      };
    };

    const groupByHour = ({ date, sales = orders }: { date: Date; sales?: ClosedOrder[] }) => {
      const data = filterByHour(date)(sales);
      return {
        hour: format(date, 'H'),
        ...getCommonData(data),
      };
    };

    const groupByWeekday = (weekday: number) => {
      const data = filterByWeekday(weekday)(orders);
      return {
        weekday: weekday.toString(10),
        ...getCommonData(data),
      };
    };

    const groupByWeekdayAndHour = (weekday: number): HeatmapByWeekdayAndHour => {
      const data = {};
      const weekdaySales = filterByWeekday(weekday)(orders);
      const hoursSales = map(
        groupByHour,
        getIntervalOfEachHour.map((date) => ({ date, sales: weekdaySales })),
      );
      hoursSales.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (key !== 'hour') {
            Object.assign(data, { ...data, [`hour_${item.hour}_${key}`]: item[key] });
          }
        });
      });
      return { ...data, weekday: weekday.toString(10)} as any;
    };

    return {
      sales: orders.length,
      grossSales: sumByProp('profit', orders),
      netSales: sumByProp('totalAmount', orders),
      averageSale: medianByProp('totalAmount', orders),
      groupedByDay: map(groupByDay, eachDayOfInterval(dateRange)),
      groupedByHour: map(
        groupByHour,
        getIntervalOfEachHour.map((date) => ({ date })),
      ),
      groupedByWeekday: map(groupByWeekday, weekdays),
      heatmapByWeekdayAndHour: map(groupByWeekdayAndHour, weekdays),
    };
  },

  getDailyTotal: (day) => {
    const data = filterByDateRange(getDayInterval(day))(state.closedOrders);
    return {
      sales: data.length,
      grossSales: sumByProp('profit', data),
      netSales: sumByProp('totalAmount', data),
      averageSale: medianByProp('totalAmount', data),
    };
  },

  getDataByDateRange: (dateRange) => {
    return filterByDateRange(dateRange)(state.closedOrders);
  },
});
