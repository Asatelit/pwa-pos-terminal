import { Category } from 'common/types';
import { getTimestamp } from 'common/utils';

export type NewCategory = {
  name: string;
  parentId?: number;
  color?: string | null;
  picture?: string | null;
  sortOrder?: number;
};

export const homeCategory: Category = {
  id: 0,
  name: 'Home Screen',
  parentId: 0,
  color: null,
  picture: null,
  isHidden: false,
  isDeleted: false,
  sortOrder: 0,
  lastModifiedTime: 0,
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
