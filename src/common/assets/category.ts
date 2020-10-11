import { Category } from 'common/types';
import { Entities } from 'common/enums';
import { getTimestamp, generateId } from 'common/utils';

export const categoryRootEntity: Category = {
  id: Entities.RootCategoryId,
  name: 'Home Screen',
  parentId: null,
  color: null,
  picture: null,
  isHidden: false,
  isDeleted: false,
  sortOrder: 0,
  lastModifiedTime: 0,
};

export const getCategoryEntity = (data?: Partial<Category>): Category => ({
  id: data?.id || generateId(),
  name: data?.name || '',
  parentId: data?.parentId || Entities.RootCategoryId,
  color: data?.color || null,
  picture: data?.picture || null,
  isHidden: data?.isHidden ?? false,
  isDeleted: data?.isDeleted ?? false,
  sortOrder: data?.sortOrder || 0,
  lastModifiedTime: getTimestamp(),
});

export function getCategoryById(categories: Category[], categoryId: string | null): Category {
  if (!categoryId || categoryId === Entities.RootCategoryId) return categoryRootEntity;
  const category = categories.find((entity) => categoryId === entity.id);
  if (!category) throw new Error(`The specified category does not exist: ${categoryId}`);
  return category;
}

export const getVisibleCategories = (categoryId: string | null, categories: Category[]) => {
  const currentCategoryId = categoryId || Entities.RootCategoryId;
  return categories.filter((cat) => !cat.isDeleted && !cat.isHidden && cat.parentId === currentCategoryId);
};
