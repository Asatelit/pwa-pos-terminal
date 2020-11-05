import { subDays, eachDayOfInterval, addHours } from 'date-fns';
import { Entities } from 'common/enums';
import { INIT_STATE } from 'common/assets';
import { getRandomInt, sumByProp, getTimestamp } from 'common/utils';
import { AppState, Item, OrderClosingReasons } from 'common/types';
import { createItemActions, createCategoryActions, createTaxActions, createOrdersActions } from 'common/creators';
import * as I from './images';

export function getDemoData(): AppState {
  const initialState: AppState = {
    ...INIT_STATE,
    settings: {
      ...INIT_STATE.settings,
      name: 'My Cafeteria',
    },
  };

  function getFakeState(initialValue: AppState): { state: () => AppState; setState: (newValue: AppState) => void } {
    let value = initialValue;
    return {
      state: () => value,
      setState: (newValue: AppState) => {
        value = newValue;
      },
    };
  }

  const { state, setState } = getFakeState(initialState);

  const updateState = (value: Partial<AppState>) => {
    const newState = { ...state(), ...value };
    setState(newState); // update state
  };

  const categories = () => createCategoryActions(state(), updateState);
  const taxes = () => createTaxActions(state(), updateState);
  const items = () => createItemActions(state(), updateState);
  const orders = () => createOrdersActions(state(), updateState);

  const subcat = categories().add({
    name: 'Burgers And Sandwiches',
    parentId: 'root',
    color: 'gold',
  });

  taxes().add({
    name: 'Tax',
    applyToCustomAmounts: false,
    isEnabled: true,
    isIncludedInPrice: false,
    precentage: 5,
  });

  const taxList = state()
    .taxes.filter((tax) => tax.isEnabled && !tax.isDeleted)
    .map((tax) => tax.id);

  const itemsList: Partial<Item>[] = [
    {
      name: 'Lemon lime Water',
      barcode: '',
      color: null,
      parentId: Entities.RootCategoryId,
      picture: null,
      price: 0.75,
      costPrice: 0.5,
      taxes: taxList,
    },
    {
      name: 'Espresso',
      barcode: '',
      color: null,
      parentId: Entities.RootCategoryId,
      picture: I.espresso,
      price: 5,
      costPrice: 3.5,
      taxes: taxList,
    },
    {
      name: 'Caffe Americano',
      barcode: '',
      color: null,
      parentId: Entities.RootCategoryId,
      picture: I.caffeAmericano,
      price: 7,
      costPrice: 5.5,
      taxes: taxList,
    },
    {
      name: 'Cappucino',
      barcode: '',
      color: null,
      parentId: Entities.RootCategoryId,
      picture: I.cappucino,
      price: 6,
      costPrice: 5,
      taxes: taxList,
    },
    {
      name: 'Earl Grey',
      barcode: '',
      color: null,
      parentId: Entities.RootCategoryId,
      picture: I.earlGrey,
      price: 6,
      costPrice: 3,
      taxes: taxList,
    },
    {
      name: 'Caffe Mocha',
      barcode: '',
      color: null,
      parentId: Entities.RootCategoryId,
      picture: I.caffeMocha,
      price: 6,
      costPrice: 4.2,
      taxes: taxList,
    },
    {
      name: 'Chicken Burger',
      barcode: '',
      color: 'orange',
      parentId: subcat.id,
      picture: null,
      price: 6,
      costPrice: 4.2,
      taxes: taxList,
    },
    {
      name: 'Fish Sandwich',
      barcode: '',
      color: 'salmon',
      parentId: subcat.id,
      picture: null,
      price: 12,
      costPrice: 7,
      taxes: taxList,
    },
  ];

  itemsList.forEach((entity) => items().add(entity));

  const dateRange = { start: subDays(new Date(), 180), end: new Date() };
  const rangeDays = eachDayOfInterval(dateRange);

  rangeDays.forEach((day) => {
    const itemsList = state().items;
    const itemsCount = itemsList.length - 1;
    const itemIds = Array.from({ length: getRandomInt(1, itemsCount) }, () => getRandomInt(0, itemsCount));

    for (let i = 1; i < getRandomInt(1, 30); i += 1) {
      const order = orders().add();

      itemIds.forEach((itemId) => orders().addItem(itemsList[itemId], order.id));

      const paymentAmount = sumByProp('amount', order.items);

      orders().charge(
        {
          cardPaymentAmount: 0,
          cashChange: 0,
          cashPaymentAmount: paymentAmount,
          closingReason: OrderClosingReasons.Default,
          customerId: 0,
          isDiscounted: false,
          totalPaymentAmount: paymentAmount,
          dateClose: getTimestamp(addHours(day, getRandomInt(0, 23))),
        },
        order.id,
      );
    }
  });

  return state();
}
