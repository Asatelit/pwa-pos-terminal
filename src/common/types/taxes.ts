export type Tax = {
  id: number;
  name: string;
  precentage: number;
  applyToCustomAmounts: boolean;
  isIncludedInPrice: boolean;
  isEnabled: boolean;
  isDeleted: boolean;
};

export type TaxRecord = {
  id: number;
  includedTaxAmount: number;
  taxAmount: number;
};
