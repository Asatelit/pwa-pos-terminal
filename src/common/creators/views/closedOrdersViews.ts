import { pipe, filter, groupBy, prop, curry, reduce, chain, merge, indexBy, mapObjIndexed, map, Merge } from 'ramda';
import { parseJSON, startOfDay, endOfDay, isWithinInterval, eachDayOfInterval } from 'date-fns';
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

type CommonTotalResponseWithDate = CommonTotalResponse & {
  date: Date;
};

export type TotalDataByDateRangeResponse = CommonTotalResponse & {
  daily: CommonTotalResponseWithDate[];
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
  getItemsByDateRange: (dateRange: DateRange) => {
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

  getTotalDataByDateRange: (dateRange: DateRange) => {
    const orders = filterByDateRange(dateRange)(state.closedOrders);
    const getData = (day: Date) => {
      const data = filterByDateRange(getDayInterval(day))(orders);
      return {
        date: day,
        receipts: data.length,
        profit: sumByProp('profit', data),
        revenue: sumByProp('totalAmount', data),
        median: medianByProp('totalAmount', data),
      };
    };

    return {
      receipts: orders.length,
      profit: sumByProp('profit', orders),
      revenue: sumByProp('totalAmount', orders),
      median: medianByProp('totalAmount', orders),
      daily: map(getData, eachDayOfInterval(dateRange)),
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

  getDataByDateRange: (dateRange: DateRange) => {
    return filterByDateRange(dateRange)(state.closedOrders);
  },
});
