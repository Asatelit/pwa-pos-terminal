import { isExist, getTimestamp } from 'common/utils';
import { ItemActions, Action, Item } from 'common/types';
import { getItemEntity } from 'common/assets';

function updateItem(item: Item): Item {
  const updItem = { ...item };
  item.lastModifiedTime = getTimestamp();
  return updItem;
}

export const createItemActions: Action<ItemActions> = (state, updateState) => ({
  select: (itemId) => updateState({ currentItemId: itemId }),

  add: (item) => {
    const createdItem = getItemEntity(item);
    updateState({ items: [...state.items, createdItem] });
    return createdItem;
  },

  update: (item) => {
    const restItems = [...state.items.filter((entity) => entity.id !== item.id)];
    updateState({ items: [...restItems, updateItem(item)] });
  },

  remove: (itemId) => {
    const updItems = [...state.items];
    const targetEntity = state.items.findIndex((entity) => itemId === entity.id);
    if (!isExist(targetEntity)) throw new Error('The specified item does not exist');
    let updItem = updItems[targetEntity];
    updItem.isDeleted = true;
    updItem = updateItem(updItem);
    updateState({ items: updItems });
  },
});
