import { AppState } from 'common/types';
import { Entities } from 'common/enums';
import { INIT_CONTEXT } from '../../assets';
import { createItemActions } from './item';

describe('Test Item Actions', () => {
  const initialState = INIT_CONTEXT[0];
  const state: AppState = { ...initialState };

  const updateState = (value: Partial<AppState>) => {
    Object.assign(state, value);
  };

  const actions = createItemActions(state, updateState);

  // сreate a default tax entry
  actions.add();
  // сreate a custom tax entry
  actions.add({
    name: 'Custom Item',
    barcode: '123456789',
    color: 'black',
    parentId: '1234-45678-7897-4563',
    picture: './image.png',
    price: 100.5,
    costPrice: 80,
  });
  actions.select(state.items[1].id);
  // delete the first item entry
  actions.remove(state.items[0].id);
  // update the second item entry
  actions.update({ ...state.items[1], isHidden: true, name: 'Upd Custom Item' });

  describe('The added default item is correct', () => {
    test.each`
      prop                        | value
      ${'name'}                   | ${''}
      ${'barcode'}                | ${''}
      ${'color'}                  | ${null}
      ${'extras'}                 | ${[]}
      ${'hasModificationsPrices'} | ${false}
      ${'modifications'}          | ${[]}
      ${'parentId'}               | ${Entities.RootCategoryId}
      ${'picture'}                | ${null}
      ${'price'}                  | ${0}
      ${'costPrice'}              | ${0}
      ${'sortOrder'}              | ${0}
      ${'unit'}                   | ${''}
      ${'isHidden'}               | ${false}
      ${'isNonDiscounted'}        | ${false}
      ${'isWeighing'}             | ${false}
      ${'isDeleted'}              | ${true}
      ${'cookingTime'}            | ${0}
    `('Property "$prop" is equal to "$value"', ({ prop, value }) => {
      expect(state).toHaveProperty(['items', 0, prop], value);
    });
  });

  describe('The added custom item is correct', () => {
    test.each`
      prop                        | value
      ${'name'}                   | ${'Upd Custom Item'}
      ${'barcode'}                | ${'123456789'}
      ${'color'}                  | ${'black'}
      ${'extras'}                 | ${[]}
      ${'hasModificationsPrices'} | ${false}
      ${'modifications'}          | ${[]}
      ${'parentId'}               | ${'1234-45678-7897-4563'}
      ${'picture'}                | ${'./image.png'}
      ${'price'}                  | ${100.5}
      ${'costPrice'}              | ${80}
      ${'sortOrder'}              | ${0}
      ${'unit'}                   | ${''}
      ${'isHidden'}               | ${true}
      ${'isNonDiscounted'}        | ${false}
      ${'isWeighing'}             | ${false}
      ${'isDeleted'}              | ${false}
      ${'cookingTime'}            | ${0}
    `('Property "$prop" is equal to "$value"', ({ prop, value }) => {
      expect(state).toHaveProperty(['items', 1, prop], value);
    });
  });

  describe('The selected item is correct', () => {
    expect(state.currentItemId).toBe(state.items[1].id);
  });

  describe('No redundant elements', () => {
    expect(state.taxes.length).toBe(0);
    expect(state.categories.length).toBe(0);
    expect(state.orders.length).toBe(0);
    expect(state.closedOrders.length).toBe(0);
    expect(state.items.length).toBe(2);
  });
});
