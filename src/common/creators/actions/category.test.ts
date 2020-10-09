import { AppState } from 'common/types';
import { Entities } from 'common/enums';
import { INIT_CONTEXT } from '../../assets';
import  { createCategoryActions } from './category';

describe('Test Category Actions', () => {
  const initialState = INIT_CONTEXT[0];
  const state: AppState = { ...initialState };

  const updateState = (value: Partial<AppState>) => {
    Object.assign(state, value);
  };

  const actions = createCategoryActions(state, updateState);

  // сreate a default tax entry
  actions.add();
  // сreate a custom tax entry
  actions.add({
    name: 'Custom Category',
    color: 'black',
    parentId: state.categories[0].id,
    picture: './image.png',
    isHidden: true,
  });
  // сreate a default tax entry
  actions.add();
  actions.select(state.categories[1].id);
  // delete the first item entry
  actions.remove(state.categories[0].id);
  // update the second item entry
  actions.update({ ...state.categories[1], isHidden: true, name: 'Upd Custom Category' });

  describe('The first added default category is correct', () => {
    test.each`
      prop                        | value
      ${'name'}                   | ${''}
      ${'color'}                  | ${null}
      ${'parentId'}               | ${Entities.RootCategoryId}
      ${'picture'}                | ${null}
      ${'sortOrder'}              | ${0}
      ${'isHidden'}               | ${false}
      ${'isDeleted'}              | ${true}
    `('Property "$prop" is equal to "$value"', ({ prop, value }) => {
      expect(state).toHaveProperty(['categories', 0, prop], value);
    });
  });

  describe('The added custom category is correct', () => {
    test.each`
      prop                        | value
      ${'name'}                   | ${'Upd Custom Category'}
      ${'color'}                  | ${'black'}
      ${'parentId'}               | ${state.categories[0].id}
      ${'picture'}                | ${'./image.png'}
      ${'sortOrder'}              | ${0}
      ${'isHidden'}               | ${true}
      ${'isDeleted'}              | ${true}
    `('Property "$prop" is equal to "$value"', ({ prop, value }) => {
      expect(state).toHaveProperty(['categories', 1, prop], value);
    });
  });

  describe('The last added default category is correct', () => {
    test.each`
      prop                        | value
      ${'name'}                   | ${''}
      ${'color'}                  | ${null}
      ${'parentId'}               | ${Entities.RootCategoryId}
      ${'picture'}                | ${null}
      ${'sortOrder'}              | ${0}
      ${'isHidden'}               | ${false}
      ${'isDeleted'}              | ${false}
    `('Property "$prop" is equal to "$value"', ({ prop, value }) => {
      expect(state).toHaveProperty(['categories', 2, prop], value);
    });
  });

  describe('The selected category is correct', () => {
    expect(state.currentCategoryId).toBe(state.categories[1].id);
  });

  describe('No redundant elements', () => {
    expect(state.taxes.length).toBe(0);
    expect(state.categories.length).toBe(3);
    expect(state.orders.length).toBe(0);
    expect(state.closedOrders.length).toBe(0);
    expect(state.items.length).toBe(0);
  });
});
