import { isExist, getTimestamp } from 'common/utils';
import { ItemActions, Action, Item } from 'common/types';

function update(item: Item): Item {
  const updItem = { ...item };
  item.lastModifiedTime = getTimestamp();
  return updItem;
}

const itemActions: Action<ItemActions> = (state, updateState) => ({
  select: (itemId: number) => updateState({ currentItemId: itemId }),

  add: (product) => updateState({ products: [...state.products, update(product)] }),

  update: (item) => {
    const restItems = [...state.products.filter((entity) => entity.id !== item.id)];
    updateState({ products: [...restItems, update(item)] });
  },

  remove: (itemId) => {
    const updItems = [...state.products];
    const targetEntity = state.products.findIndex((entity) => itemId === entity.id);
    if (!isExist(targetEntity)) throw new Error('The specified item does not exist');
    let updItem = updItems[targetEntity];
    updItem.isDeleted = true;
    updItem = update(updItem);
    updateState({ products: updItems });
  },
});

export default itemActions;
