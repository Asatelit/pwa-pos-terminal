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
  receipts: number;
  profit: number;
  revenue: number;
  median: number;
};

type CommonTotalResponseWithDate = CommonTotalResponse & { date: Date };
type CommonTotalResponseWithHour = CommonTotalResponse & { date: string };
type CommonTotalResponseWithWeekday = CommonTotalResponse & { weekday: number };

export type TotalDataByDateRangeResponse = CommonTotalResponse & {
  groupedByDay: CommonTotalResponseWithDate[];
  groupedByHour: CommonTotalResponseWithHour[];
  groupedByWeekday: CommonTotalResponseWithWeekday[];
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
    const weekdays = [0, 1, 2, 3, 4, 5, 6]; // the day of week, 0 represents Sunday
    const orders = filterByDateRange(dateRange)(state.closedOrders);

    const getCommonData = (data: ClosedOrder[]): CommonTotalResponse => ({
      receipts: data.length,
      profit: sumByProp('profit', data),
      revenue: sumByProp('totalAmount', data),
      median: medianByProp('totalAmount', data),
    });

    const groupByDay = (day: Date) => {
      const data = filterByDateRange(getDayInterval(day))(orders);
      return {
        date: day,
        ...getCommonData(data),
      };
    };

    const groupByHour = (date: Date) => {
      const data = filterByHour(date)(orders);
      return {
        date: format(date, 'HH:mm'),
        ...getCommonData(data),
      };
    };

    const groupByWeekday = (weekday: number) => {
      const data = filterByWeekday(weekday)(orders);
      return {
        weekday,
        ...getCommonData(data),
      };
    };

    return {
      receipts: orders.length,
      profit: sumByProp('profit', orders),
      revenue: sumByProp('totalAmount', orders),
      median: medianByProp('totalAmount', orders),
      groupedByDay: map(groupByDay, eachDayOfInterval(dateRange)),
      groupedByHour: map(groupByHour, eachHourOfInterval(getDayInterval(new Date()))),
      groupedByWeekday: map(groupByWeekday, weekdays),
    };
  },

  getDailyTotal: (day) => {
    const data = filterByDateRange(getDayInterval(day))(state.closedOrders);
    return {
      receipts: data.length,
      profit: sumByProp('profit', data),
      revenue: sumByProp('totalAmount', data),
      median: medianByProp('totalAmount', data),
    };
  },

  getDataByDateRange: (dateRange) => {
    return filterByDateRange(dateRange)(state.closedOrders);
  },
});
