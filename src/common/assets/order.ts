import { AppState, Order, OrderItem, OrderStatuses } from 'common/types';
import { getTimestamp, generateId } from 'common/utils';

export function getOrderEntity(state: AppState): Order {
  return {
    cardPaymentAmount: 0,
    cashPaymentAmount: 0,
    certPaymentAmount: 0,
    customerId: 0,
    customerLoyaltyType: 0,
    dateClose: 0,
    datePrint: 0,
    dateStart: getTimestamp(),
    dateUpdated: 0,
    discountAmount: 0,
    id: generateId(),
    isDiscounted: false,
    isTipIncluded: false,
    items: [],
    notes: '',
    orderName: Math.max(...state.orders.map(order => order.orderName), 0) + 1,
    parentId: null,
    paymentMethodId: 0,
    rewardEarnedAmount: 0,
    rewardPaymentAmount: 0,
    status: OrderStatuses.Open,
    subTotalAmount: 0,
    subTotalRoundedAmount: 0,
    tableId: state.currentTableId,
    taxAmount: 0,
    taxRoundedAmount: 0,
    tipsAmount: 0,
    tipsCard: 0,
    tipsCash: 0,
    totalAmount: 0,
    totalPaymentAmount: 0,
    totalRoundedAmount: 0,
    userId: state.currentUserId,
    appliedTaxes: [],
  };
}

export function createOrder(state: AppState): [Order[], Order, number] {
  const updOrders: Order[] = [...state.orders];
  const order = { ...getOrderEntity(state) };
  updOrders.push(order);
  const orderIndex = updOrders.length - 1;
  const updOrder = updOrders[orderIndex];
  return [updOrders, updOrder, orderIndex];
}

export function getOrderById(orders: Order[], orderId: string | null): Order {
  const order = orders.find((entity) => orderId === entity.id);
  if (!order) throw new Error('The specified order does not exist');
  return order;
}

export function getOrderIndexById(orders: Order[], orderId: string | null): number {
  return orders.findIndex((order) => orderId === order.id);
}

export function getOrderItemIndexById(orderItems: OrderItem[], orderId: string) {
  return orderItems.findIndex((item) => orderId === item.id);
}
