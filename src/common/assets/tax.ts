import { AppState, Item, Tax, TaxRecord } from 'common/types';
import { generateId } from 'common/utils';

export function getTaxEntity(tax?: Partial<Tax>): Tax {
  return {
    id: generateId(),
    name: tax?.name ?? 'Tax',
    applyToCustomAmounts: tax?.applyToCustomAmounts ?? false,
    isDeleted: tax?.isDeleted ?? false,
    isEnabled: tax?.isEnabled ?? false,
    isIncludedInPrice: tax?.isIncludedInPrice ?? false,
    precentage: tax?.precentage ?? 5,
  };
}

export function getTaxById(taxes: Tax[], taxId: string): Tax {
  const item = taxes.find((entity) => taxId === entity.id);
  if (!item) throw new Error('The specified tax does not exist');
  return item;
}

export function getAvailableTaxes(taxes: Tax[]): Tax[] {
  return taxes.filter((tax) => !tax.isDeleted && tax.isEnabled);
}

export function getTaxes(item: Item, state: AppState): TaxRecord[] {
  type TaxEntity = { id: string; includedTaxAmount: number; taxAmount: number };

  const { taxes } = state;
  const taxList = getAvailableTaxes(taxes);
  const appliedTaxes: TaxEntity[] = [];

  // iterate available taxes
  taxList.forEach((tax) => {
    // return if the item is not subject to this tax
    if (!item.taxes?.includes(tax.id)) return;
    const taxAmount = (item.price / 100) * tax.precentage;
    appliedTaxes.push({
      id: tax.id,
      includedTaxAmount: tax.isIncludedInPrice ? taxAmount : 0,
      taxAmount: tax.isIncludedInPrice ? 0 : taxAmount,
    });
  });

  return appliedTaxes;
}
