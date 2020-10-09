import { getTaxes } from 'common/assets/tax';
import { isExist, getTimestamp, calcSum, round } from 'common/utils';
import { OrdersActions, Action, ClosedOrder, Order, OrderStatuses, AppState, OrderItem, TaxRecord } from 'common/types';
import {
  getOrderEntity,
  getOrderItemEntity,
  createOrder,
  getOrderIndexById,
  getOrderItemIndexById,
} from 'common/assets/order';

function update(order: Order, state: AppState): Order {
  const updOrder = { ...order };
  const appliedTaxes: TaxRecord[] = [];
  const updOrderItems: OrderItem[] = [];

  // recalculates the order items amounts
  updOrder.items.forEach((orderItem) => {
    const item = state.items.find((entity) => entity.id === orderItem.id);
    if (!item) return;
    const { quantity, price } = orderItem;
    const taxes = getTaxes(item, state);
    const updOrderItem = { ...orderItem };
    updOrderItem.amount = quantity * price;
    updOrderItem.taxAmount = calcSum(taxes, 'taxAmount') * quantity;
    updOrderItem.includedTaxAmount = calcSum(taxes, 'includedTaxAmount') * quantity;
    updOrderItem.totalTaxAmount = updOrderItem.taxAmount + updOrderItem.includedTaxAmount;
    updOrderItem.taxes = taxes;
    taxes.forEach((tax) =>
      appliedTaxes.push({
        ...tax,
        taxAmount: tax.taxAmount * quantity,
        includedTaxAmount: tax.includedTaxAmount * quantity,
      }),
    );
    updOrderItems.push(updOrderItem);
  });

  updOrder.items = updOrderItems;

  // recalculates the order items amounts
  const unquieTaxIds: string[] = Array.from(new Set(appliedTaxes.map((item) => item.id)));
  const orderTaxes = unquieTaxIds.map((taxId: string) => {
    const taxList = appliedTaxes.filter((entity) => entity.id === taxId);
    return {
      id: taxId,
      includedTaxAmount: calcSum(taxList, 'includedTaxAmount'),
      taxAmount: calcSum(taxList, 'taxAmount'),
    };
  });

  updOrder.appliedTaxes = orderTaxes;
  updOrder.taxAmount = calcSum(updOrder.items, 'taxAmount');
  updOrder.taxRoundedAmount = round(updOrder.taxAmount);
  updOrder.subTotalAmount = calcSum(updOrder.items, 'amount');
  updOrder.subTotalRoundedAmount = round(updOrder.subTotalAmount);
  updOrder.totalAmount = updOrder.taxAmount + updOrder.subTotalAmount;
  updOrder.totalRoundedAmount = updOrder.taxRoundedAmount + updOrder.subTotalRoundedAmount;
  updOrder.totalPaymentAmount = updOrder.cardPaymentAmount + updOrder.cashPaymentAmount;
  updOrder.dateUpdated = getTimestamp(); // update the last modification time

  return updOrder;
}

export const createOrdersActions: Action<OrdersActions> = (state, updateState) => ({
  // Adds the selected item to the current order
  addItem: (orderItem) => {
    const updOrders = [...state.orders];
    let orderIndex = getOrderIndexById(updOrders, state.currentOrderId);

    // If the order does not exist create a new one
    if (!isExist(orderIndex)) {
      const order = { ...getOrderEntity(state) };
      updOrders.push(order);
      orderIndex = updOrders.length - 1;
    }

    const updOrder = updOrders[orderIndex];
    const currentItemIndex = getOrderItemIndexById(updOrder.items, orderItem.id);

    // if the order item already exists just increase the total quantity, otherwise create a new one.
    if (isExist(currentItemIndex)) {
      const currentItem = updOrder.items[currentItemIndex];
      currentItem.quantity = currentItem.quantity + 1;
    } else {
      updOrder.items.push(getOrderItemEntity(orderItem));
    }

    // recalculate order's data
    Object.assign(updOrder, update(updOrder, state));

    updateState({ orders: updOrders, currentOrderId: updOrder.id, currentItemId: null });
  },

  // Order Closing
  charge: (order, orderId) => {
    const closedOrder: ClosedOrder = { ...order, dateUpdated: getTimestamp(), dateClose: getTimestamp() };
    const currentOrder = state.orders.find((order) => order.id === orderId);
    if (!currentOrder) throw new Error('The specified order does not exist');
    const updOrders = [
      ...state.orders.filter((order) => order.id !== orderId),
      {
        ...currentOrder,
        status: OrderStatuses.Closed,
        dateClose: getTimestamp(),
        dateUpdated: getTimestamp(),
      } as Order,
    ];
    const updClosedOrders: ClosedOrder[] = [closedOrder, ...state.closedOrders];
    updateState({ orders: updOrders, closedOrders: updClosedOrders, currentItemId: null, currentOrderId: null });
  },

  // Updates current order data
  updateSelected: (order) => {
    const updOrders = [...state.orders];
    const currentOrderIndex = updOrders.findIndex((order) => state.currentOrderId === order.id);

    // if the order exists just update it
    if (isExist(currentOrderIndex)) {
      const updOrder: Order = { ...order };
      updOrders[currentOrderIndex] = update(updOrder, state);
    }

    updateState({ orders: updOrders, currentItemId: null });
  },

  add: () => {
    const [updOrders, updOrder] = createOrder(state);
    updateState({ orders: updOrders, currentOrderId: updOrder.id });
  },

  select: (orderId: string | null) => updateState({ currentOrderId: orderId }),
});
