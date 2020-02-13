import { Category, Product, Order, ClosedOrder } from 'types';

export type TerminalState = {
  chargingOrderId: number;
  currentCategoryId: number; // Current category identifier
  currentOrderId: number; // Current order identifier
  currentUserId: number; // Current user identifier
  currentTableId: number; // Current table identifier
  currentItemId: number; // Current item identifier
  products: Product[]; // Products list
  categories: Category[]; // Categories list
  orders: Order[]; // Orders list
  closedOrders: Order[]; // Closed orders list
};

export type TerminalServices = {
  addItemToCurrentOrder: (product: Product) => void;
  createOrder: () => void;
  chargeOrder: (closedOrder: ClosedOrder, orderId: number) => void;
  updateCurrentOrder: (order: Order) => void;
  setCurrentCategory: (categoryId: number) => void;
  setCurrentItem: (itemId: number) => void;
  setCurrentTable: (tableId: number) => void;
  setCurrentOrder: (orderId: number) => void;
  setCurrentUser: (userId: number) => void;
  setChargingOrder: (userId: number) => void;
};
