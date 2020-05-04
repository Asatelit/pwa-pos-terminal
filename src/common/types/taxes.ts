export type Tax = {
  id: string;
  name: string;
  precentage: number;
  applyToCustomAmounts: boolean;
  isIncludedInPrice: boolean;
  isEnabled: boolean;
  isDeleted: boolean;
};

export type TaxRecord = {
  id: string;
  includedTaxAmount: number;
  taxAmount: number;
};
