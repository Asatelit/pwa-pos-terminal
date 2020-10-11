import { AppState } from 'common/types';
import { INIT_CONTEXT } from '../../assets';
import { createTaxActions } from './tax';

describe('Test Tax Actions', () => {
  const initialState = INIT_CONTEXT[0];
  const state: AppState = { ...initialState };

  const updateState = (value: Partial<AppState>) => {
    Object.assign(state, value);
  };

  const actions = createTaxActions(state, updateState);

  // сreate a default tax entry
  actions.add();
  // сreate a custom tax entry
  actions.add({
    name: 'Custom Tax',
    applyToCustomAmounts: true,
    isEnabled: true,
    isIncludedInPrice: true,
    precentage: 10,
  });
  // delete the first tax entry
  actions.remove(state.taxes[0].id);
  // update the second tax entry
  actions.update({ ...state.taxes[1], precentage: 15, name: 'Upd Custom Tax' });


  describe('The added default tax is correct', () => {
    test.each`
      prop                      | value
      ${'name'}                 | ${'Tax'}
      ${'applyToCustomAmounts'} | ${false}
      ${'isDeleted'}            | ${true}
      ${'isEnabled'}            | ${false}
      ${'isIncludedInPrice'}    | ${false}
      ${'precentage'}           | ${5}
    `('Property "$prop" is equal to "$value"', ({ prop, value }) => {
      expect(state).toHaveProperty(['taxes', 0, prop], value);
    });
  });

  describe('The added custom tax is correct', () => {
    test.each`
      prop                      | value
      ${'name'}                 | ${'Upd Custom Tax'}
      ${'applyToCustomAmounts'} | ${true}
      ${'isDeleted'}            | ${false}
      ${'isEnabled'}            | ${true}
      ${'isIncludedInPrice'}    | ${true}
      ${'precentage'}           | ${15}
    `('Property "$prop" is equal to "$value"', ({ prop, value }) => {
      expect(state).toHaveProperty(['taxes', 1, prop], value);
    });
  });

  describe('No redundant elements', () => {
    expect(state.taxes.length).toBe(2);
    expect(state.categories.length).toBe(0);
    expect(state.orders.length).toBe(0);
    expect(state.closedOrders.length).toBe(0);
    expect(state.items.length).toBe(0);
  });

});
