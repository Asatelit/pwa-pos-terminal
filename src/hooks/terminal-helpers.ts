import { Order, OrderItem, TerminalState } from 'types';
import { isExist } from 'utils';
import { newOrder } from 'hooks/terminal-assets';

export function createOrder(state: TerminalState): [Order[], Order, number] {
  const updOrders: Order[] = [...state.orders];
  const order = { ...newOrder(state) };
  updOrders.push(order);
  const orderIndex = updOrders.length - 1;
  const updOrder = updOrders[orderIndex];
  return [updOrders, updOrder, orderIndex];
}

export function getOrderIndexById(orders: Order[], orderId: number): number {
  return orders.findIndex(order => orderId === order.id);
}

export function getOrderItemIndexById(orderItems: OrderItem[], orderId: number) {
  return orderItems.findIndex(item => orderId === item.id);
}

export function getOrderData(state: TerminalState, orderId?: number): [Order[], Order, number] {
  const updOrders: Order[] = [...state.orders];
  const id = orderId ? orderId : state.currentOrderId; // if ID is not specified, try to find the current order.
  let orderIndex = getOrderIndexById(state.orders, id);

  // If the order does not exist create a new one
  if (!isExist(orderIndex)) {
    const order = { ...newOrder(state) };
    updOrders.push(order);
    orderIndex = updOrders.length - 1;
  }

  const updOrder = updOrders[orderIndex];
  return [updOrders, updOrder, orderIndex];
}
