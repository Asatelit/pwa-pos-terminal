import { Category, Item, Order, ClosedOrder, Settings, Tax } from 'common/types';

export type AppState = {
  categories: Category[]; // Categories list
  closedOrders: ClosedOrder[]; // Closed orders list
  currentCategoryId: number; // Current category identifier
  currentItemId: number; // Current item identifier
  currentOrderId: number; // Current order identifier
  currentTableId: number; // Current table identifier
  currentUserId: number; // Current user identifier
  isLoading: boolean;
  orders: Order[]; // Orders list
  products: Item[]; // Products list
  settings: Settings;
  taxes: Tax[];
};

export type AppActions = {
  category: CategoryActions;
  item: ItemActions;
  orders: OrdersActions;
  settings: SettingsActions;
  taxes: TaxActions;
};

export type CategoryActions = {
  add: (category: Category) => void;
  remove: (categoryId: number) => void;
  select: (categoryId: number) => void;
  update: (category: Category) => void;
};

export type OrdersActions = {
  add: () => void;
  addItem: (product: Item) => void;
  charge: (closedOrder: ClosedOrder, orderId: number) => void;
  select: (orderId: number) => void;
  updateSelected: (order: Order) => void;
};

export type ItemActions = {
  add: (item: Item) => void;
  remove: (itemId: number) => void;
  select: (itemId: number) => void;
  update: (item: Item) => void;
};

export type TaxActions = {
  add: (itemData?: Tax) => void;
  remove: (itemId: number) => void;
  update: (itemData: Tax) => void;
};

export type SettingsActions = {
  update: (settings: Partial<Settings>) => void;
};
