import { Category, Order, OrderItem, Item, AppState, Tax, TaxRecord } from 'common/types';
import { NewOrder, homeCategory } from 'common/prototypes';

// CATEGORY

export function getCategoryById(categories: Category[], categoryId: number): Category {
  const category = categoryId === 0 ? homeCategory : categories.find((entity) => categoryId === entity.id);
  if (!category) throw new Error('The specified category does not exist');
  return category;
}

// ITEM

export function getItemById(items: Item[], itemId: number): Item {
  const item = items.find((entity) => itemId === entity.id);
  if (!item) throw new Error('The specified item does not exist');
  return item;
}

// TAX

export function getTaxById(taxes: Tax[], taxId: number): Tax {
  const item = taxes.find((entity) => taxId === entity.id);
  if (!item) throw new Error('The specified tax does not exist');
  return item;
}

export function getAvailableTaxes(taxes: Tax[]): Tax[] {
  return taxes.filter((tax) => !tax.isDeleted && tax.isEnabled);
}

export function getTaxes(item: Item, state: AppState): TaxRecord[] {
  type TaxEntity = {id: number, includedTaxAmount: number, taxAmount: number};

  const { taxes } = state;
  const taxList = getAvailableTaxes(taxes);
  const appliedTaxes: TaxEntity[] = [];

  // iterate available taxes
  taxList.forEach((tax) => {
    // return if the item is not subject to this tax
    if (!item.taxes?.includes(tax.id)) return;
    const taxAmount = (item.price / 100) * tax.precentage;
    appliedTaxes.push({
      id: tax.id,
      includedTaxAmount: tax.isIncludedInPrice ? taxAmount : 0,
      taxAmount: tax.isIncludedInPrice ? 0 : taxAmount,
    });
  });

  return appliedTaxes;
}

// ORDER

export function createOrder(state: AppState): [Order[], Order, number] {
  const updOrders: Order[] = [...state.orders];
  const order = { ...NewOrder(state) };
  updOrders.push(order);
  const orderIndex = updOrders.length - 1;
  const updOrder = updOrders[orderIndex];
  return [updOrders, updOrder, orderIndex];
}

export function getOrderById(orders: Order[], orderId: number): Order {
  const order = orders.find((entity) => orderId === entity.id);
  if (!order) throw new Error('The specified order does not exist');
  return order;
}

export function getOrderIndexById(orders: Order[], orderId: number): number {
  return orders.findIndex((order) => orderId === order.id);
}

export function getOrderItemIndexById(orderItems: OrderItem[], orderId: number) {
  return orderItems.findIndex((item) => orderId === item.id);
}
