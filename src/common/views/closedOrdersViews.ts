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
} from 'ramda';
import { parseJSON, isWithinInterval } from 'date-fns';
import { View, ClosedOrder, ClosedOrderItem, Item } from 'common/types';

type DateRange = { start: number | Date; end: number | Date };
type ClosedOrderMergedItem = Item & ClosedOrderItem;

export type ClosedOrderViews = {
  getItemsByDateRange: ({ start, end }: DateRange) => any;
};

// Helpers
const groupByName = groupBy(prop('name'));
const sumByProp = (prop: string, list: ClosedOrderMergedItem[]) => sum(pluck(prop, list));
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
    const getSummary = mapObjIndexed((num: number, key: string, obj: any) => {
      const data = obj[key];
      return {
        quantity: sumByProp('quantity', data),
        amount: sumByProp('amount', data),
        roundedAmount: sumByProp('roundedAmount', data),
        taxAmount: sumByProp('totalTaxAmount', data),
      };
    }) as any;

    return pipe(
      filterByDateRange(dateRange),
      mapOrderItems,
      joinInnerById(state.items),
      groupByName,
      getSummary,
    )(state.closedOrders);
  },
});
