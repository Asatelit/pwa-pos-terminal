export enum OrderStatuses {
  Open = 1,
  Closed = 2,
}

export enum OrderClosingReasons {
  Default = 0,
  CustomerIsGone = 1,
  OnTheHouse = 2,
  Mistake = 3,
}

export type Order = {
  id: number;
  dateStart: number;
  dateClose: number;
  dateUpdated: number;
  datePrint: number;
  status: OrderStatuses;
  userId: number;
  tableId?: number;
  guestsCount?: number;
  isSplited?: boolean;
  splitItems?: OrderItem[];
  items: OrderItem[];
  totalAmount: number;
  roundedAmount: number;
  discountAmount: number;
  isDiscounted: boolean;
  customerId: number;
  customerLoyaltyType?: number;
  totalPaymentAmount: number;
  cashPaymentAmount: number;
  cardPaymentAmount: number;
  certPaymentAmount: number;
  rewardPaymentAmount: number;
  rewardEarnedAmount: number;
  platformDiscount?: number;
  parentId: number;
  paymentMethodId: number;
  isTipIncluded: boolean;
  tipsAmount: number;
  tipsCash: number;
  tipsCard: number;
  notes: string;
  orderName: number;
};

export type ClosedOrder = Order & {
  usedPromotions?: number[];
  childOrders?: number[];
  closingReason: OrderClosingReasons;
  cashChange: number;
};

export type OrderItem = {
  id: number;
  variant: number;
  quantity: number;
  price: number;
};

export type ClosedOrderItem = OrderItem & {
  amount: number;
  roundedAmount: number;
  taxId: number;
  taxValue: number;
  taxType: number;
  isWeighing: boolean;
  isNonDiscounted: boolean;
};
