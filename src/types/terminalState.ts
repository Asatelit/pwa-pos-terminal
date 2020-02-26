import { Category, Product, Order, ClosedOrder } from 'types';

export type TerminalState = {
  isLoading: boolean;
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
  addCategory: (category: Category) => void;
  addItem: (item: Product) => void;
  addItemToCurrentOrder: (product: Product) => void;
  createOrder: () => void;
  chargeOrder: (closedOrder: ClosedOrder, orderId: number) => void;
  updateCurrentOrder: (order: Order) => void;
  setCurrentCategory: (categoryId: number) => void;
  setCurrentItem: (itemId: number) => void;
  setCurrentTable: (tableId: number) => void;
  setCurrentOrder: (orderId: number) => void;
  setCurrentUser: (userId: number) => void;
  removeCategory: (categoryId: number) => void;
  updateCategory: (category: Category) => void;
  updateItem: (item: Product) => void;
  removeItem: (itemId: number) => void;
};
