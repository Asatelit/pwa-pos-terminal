import { getTimestamp } from 'common/utils';
import { Category, CategoryActions, Action } from 'common/types';
import { getCategoryEntity } from 'common/assets';

export const createCategoryActions: Action<CategoryActions> = (state, updateState) => ({
  // add a category
  add: (category) => {
    const newCategory = getCategoryEntity(category);
    updateState({ categories: [...state.categories, newCategory] });
    return newCategory;
  },

  // remove the selected category recursively
  remove: (categoryId) => {
    const updCategories: Category[] = state.categories.map((category) => {
      const updCategory = { ...category };
      if (category.id === categoryId || category.parentId === categoryId) {
        updCategory.isDeleted = true;
        updCategory.lastModifiedTime = getTimestamp();
      }
      return updCategory;
    });
    updateState({ categories: updCategories });
  },

  // update a category
  update: (category) => {
    const updCategories = state.categories.map((entity) => {
      let updEntity = { ...entity };
      if (entity.id === category.id) updEntity = getCategoryEntity(category);
      return updEntity;
    });
    updateState({ categories: updCategories });
  },

  // set active category
  select: (categoryId) => updateState({ currentCategoryId: categoryId }),
});

