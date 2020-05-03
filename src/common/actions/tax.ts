import { isExist } from 'common/utils';
import { TaxActions, Action } from 'common/types';
import { NewTax } from 'common/prototypes';

const categoryActions: Action<TaxActions> = (state, updateState) => ({
  // add a tax
  add: (data) => updateState({ taxes: [...state.taxes, NewTax(data)] }),

  // remove a tax
  remove: (taxId) => {
    const updTaxes = [...state.taxes];
    const targetEntity = state.taxes.findIndex((entity) => taxId === entity.id);
    if (!isExist(targetEntity)) throw new Error('The specified tax does not exist');
    updTaxes[targetEntity].isDeleted = true;
    updateState({ taxes: updTaxes });
  },

  // update a tax
  update: (taxData) => {
    const updTaxes = [...state.taxes.filter((entity) => entity.id !== taxData.id)];
    updateState({ taxes: [...updTaxes, { ...taxData }] });
  },
});

export default categoryActions;
