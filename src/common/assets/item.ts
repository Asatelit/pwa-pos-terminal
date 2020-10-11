import { Item } from 'common/types';
import { Entities } from 'common/enums';
import { getTimestamp, generateId } from 'common/utils';

export const getItemEntity = (data?: Partial<Item>): Item => ({
  id: generateId(),
  name: data?.name || '',
  barcode: data?.barcode || '',
  color: data?.color || null,
  extras: data?.extras || [],
  hasModificationsPrices: data?.hasModificationsPrices ?? false,
  modifications: data?.modifications || [],
  parentId: data?.parentId || Entities.RootCategoryId,
  picture: data?.picture || null,
  price: data?.price || 0,
  costPrice: data?.costPrice || 0,
  sortOrder: data?.sortOrder || 0,
  unit: data?.unit || '',
  isHidden: data?.isHidden ?? false,
  isNonDiscounted: data?.isNonDiscounted ?? false,
  isWeighing: data?.isWeighing ?? false,
  lastModifiedTime: getTimestamp(),
  isDeleted: false,
  cookingTime: data?.cookingTime || 0,
  taxes: data?.taxes || [],
});

export const getVisibleItems = (categoryId: string | null, items: Item[], filter?: string) => {
  const currentCategoryId = categoryId || Entities.RootCategoryId;
  const list = items.filter((item) => !item.isDeleted && !item.isHidden && item.parentId === currentCategoryId);
  return filter
    ? list.filter(
        (item) =>
          item.name.toLowerCase().includes(filter.toLowerCase()) ||
          item.barcode.toLowerCase().includes(filter.toLowerCase()),
      )
    : list;
};

export function getItemById(items: Item[], itemId: string): Item {
  const item = items.find((entity) => itemId === entity.id);
  if (!item) throw new Error('The specified item does not exist');
  return item;
}
