import { Category, Order, OrderItem, OrderStatuses, Product, ProductModification, TerminalState } from 'types';
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
  orderName: Math.max(...state.closedOrders.map(order => order.orderName), 0) + state.orders.length + 1,
});

export const newOrderItem = (product: Product): OrderItem => ({
  id: product.id,
  price: product.price,
  quantity: 1,
  variant: 0,
});

export type NewCategory = {
  name: string;
  parentId?: number;
  color?: string | null;
  picture?: string | null;
  sortOrder?: number;
};

export const newCategory = (data: NewCategory): Category => ({
  id: getTimestamp(),
  name: data.name,
  parentId: data.parentId || 0,
  color: data.color || null,
  picture: data.picture || null,
  isHidden: false,
  isDeleted: false,
  sortOrder: data.sortOrder || 0,
  lastModifiedTime: getTimestamp(),
});

export type NewItem = {
  name: string;
  price: number;
  costPrice?: number;
  parentId?: number;
  color?: string | null;
  picture?: string | null;
  sortOrder?: number;
};

export const newItem = (data: NewItem): Product => ({
  id: getTimestamp(),
  name: data.name,
  barcode: '',
  color: data.color || null,
  extras: [],
  hasModificationsPrices: false,
  modifications: [],
  parentId: data.parentId || 0,
  picture: data.picture || null,
  price: data.price,
  costPrice: data.price || 0,
  sortOrder: data.sortOrder || 0,
  unit: '',
  isHidden: false,
  isNonDiscounted: false,
  isWeighing: false,
  lastModifiedTime: getTimestamp(),
  isDeleted: false,
  cookingTime: 0,
  taxId: 0,
  taxName: '',
  taxType: 0,
  taxValue: 0,
  taxItemType: 0,
});
