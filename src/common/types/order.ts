import { TaxRecord } from './taxes';

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
  appliedTaxes: TaxRecord[];
  cardPaymentAmount: number;
  cashPaymentAmount: number;
  certPaymentAmount: number;
  customerId: number;
  customerLoyaltyType?: number;
  dateClose: number;
  datePrint: number;
  dateStart: number;
  dateUpdated: number;
  discountAmount: number;
  guestsCount?: number;
  id: string;
  isDiscounted: boolean;
  isSplited?: boolean;
  isTipIncluded: boolean;
  items: OrderItem[];
  notes: string;
  orderName: number;
  parentId: string | null;
  paymentMethodId: number;
  platformDiscount?: number;
  rewardEarnedAmount: number;
  rewardPaymentAmount: number;
  splitItems?: OrderItem[];
  status: OrderStatuses;
  subTotalAmount: number;
  subTotalRoundedAmount: number;
  tableId?: string | null;
  taxAmount: number;
  taxRoundedAmount: number;
  tipsAmount: number;
  tipsCard: number;
  tipsCash: number;
  totalAmount: number;
  totalPaymentAmount: number;
  totalRoundedAmount: number;
  userId: string | null;
};

export interface ClosedOrder extends Order {
  usedPromotions?: string[];
  childOrders?: string[];
  closingReason: OrderClosingReasons;
  cashChange: number;
  profit: number;
  items: ClosedOrderItem[];
}

export type OrderItem = {
  id: string;
  variant: number;
  quantity: number;
  price: number;
  amount: number;
  taxAmount: number;
  includedTaxAmount: number;
  totalTaxAmount: number;
  taxes: TaxRecord[];
};

export interface ClosedOrderItem extends OrderItem {
  costPrice: number;
  profit: number;
  roundedAmount: number;
  isWeighing: boolean;
  isNonDiscounted: boolean;
}
