import { Order, OrderItem, OrderStatuses, Product, TerminalState } from 'types';
import { getTimestamp } from 'utils';

export const newOrder = (state: TerminalState): Order => ({
  id: getTimestamp(),
  dateStart: getTimestamp(),
  dateClose: 0,
  dateUpdated: 0,
  datePrint: 0,
  status: OrderStatuses.Open,
  userId: state.currentUserId,
  tableId: state.currentTableId,
  items: [],
  totalAmount: 0,
  roundedAmount: 0,
  discountAmount: 0,
  isDiscounted: false,
  customerId: 0,
  customerLoyaltyType: 0,
  totalPaymentAmount: 0,
  cashPaymentAmount: 0,
  cardPaymentAmount: 0,
  certPaymentAmount: 0,
  rewardPaymentAmount: 0,
  rewardEarnedAmount: 0,
  parentId: 0,
  paymentMethodId: 0,
  isTipIncluded: false,
  tipsAmount: 0,
  tipsCash: 0,
  tipsCard: 0,
  notes: '',
  orderName: Math.max(...state.closedOrders.map(order => order.id), 0) + state.orders.length + 1,
});

export const newOrderItem = (product: Product): OrderItem => ({
  id: product.id,
  price: product.price,
  quantity: 1,
  variant: 0,
});
