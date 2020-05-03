import { Item } from 'common/types';
import { getTimestamp } from 'common/utils';

export type NewItem = {
  name: string;
  price: number;
  costPrice?: number;
  parentId?: number;
  color?: string | null;
  picture?: string | null;
  sortOrder?: number;
};

export const newItem = (data: NewItem): Item => ({
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
  costPrice: data.costPrice || 0,
  sortOrder: data.sortOrder || 0,
  unit: '',
  isHidden: false,
  isNonDiscounted: false,
  isWeighing: false,
  lastModifiedTime: getTimestamp(),
  isDeleted: false,
  cookingTime: 0,
  taxes: [],
});
