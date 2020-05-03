import { isExist, getTimestamp } from 'common/utils';
import { CategoryActions, Action } from 'common/types';

const categoryActions: Action<CategoryActions> = (state, updateState) => ({
  // add a category
  add: (category) => updateState({ categories: [...state.categories, category] }),

  // remove a category
  remove: (categoryId) => {
    const updCategories = [...state.categories];
    const targetEntity = state.categories.findIndex((entity) => categoryId === entity.id);
    if (!isExist(targetEntity)) throw new Error('The specified category does not exist');
    updCategories[targetEntity].isDeleted = true;
    updateState({ categories: updCategories });
  },

  // update a category
  update: (category) => {
    const updCategories = [...state.categories.filter((entity) => entity.id !== category.id)];
    updateState({ categories: [...updCategories, { ...category, lastModifiedTime: getTimestamp() }] });
  },

  // set active category
  select: (categoryId: number) => updateState({ currentCategoryId: categoryId }),
});

export default categoryActions;
