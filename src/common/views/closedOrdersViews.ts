import {
  pipe,
  filter,
  groupBy,
  prop,
  curry,
  reduce,
  chain,
  merge,
  sum,
  pluck,
  indexBy,
  mapObjIndexed,
  Merge,
  any,
} from 'ramda';
import { parseJSON, isWithinInterval } from 'date-fns';
import { View, ClosedOrder, ClosedOrderItem, Item } from 'common/types';

type DateRange = { start: number | Date; end: number | Date };
type ClosedOrderMergedItem = Item & ClosedOrderItem;

export type ClosedOrderViews = {
  getItemsByDateRange: ({ start, end }: DateRange) => {
    items: {
      [key: string]: {
        quantity: number,
        amount: number,
        roundedAmount: number,
        taxAmount: number,
      }
  };
    summary: {
      quantity: number,
      amount: number,
      roundedAmount: number,
      taxAmount: number,
    }
  };
};

// Helpers
const groupByName = groupBy(prop('name'));
const sumByProp = <T>(prop: string, list: T[]) => sum(pluck(prop, list));
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
export const closedOrdersViews: View<ClosedOrderViews> = (state) => ({
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

    const orderItems = pipe(
      filterByDateRange(dateRange),
      mapOrderItems,
    )(state.closedOrders);

    const summaryItems = pipe(
      joinInnerById(state.items),
      groupByName,
      getItemSummary,
    )(orderItems) as any;

    const summary = {
      quantity: sumByProp('quantity', orderItems),
      amount: sumByProp('amount', orderItems),
      roundedAmount: sumByProp('roundedAmount', orderItems),
      taxAmount: sumByProp('totalTaxAmount', orderItems),
    };

    console.info(summary);

    return { summary, items: summaryItems };
  },
});
