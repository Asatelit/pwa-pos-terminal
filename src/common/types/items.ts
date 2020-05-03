export type Item = {
  barcode: string;
  color: string | null;
  cookingTime?: number;
  costPrice: number;
  extras: string[];
  hasModificationsPrices: boolean;
  id: number;
  isDeleted?: boolean;
  isHidden: boolean;
  isNonDiscounted: boolean;
  isWeighing: boolean;
  lastModifiedTime: number;
  modifications: ItemModification[];
  name: string;
  parentId: number;
  picture: string | null;
  price: number;
  sortOrder: number;
  taxes: number[];
  unit: string;
};

export type ItemModification = {
  id: number;
  name: string;
  price: number;
  barcode: string;
  modifierProductCode: string; // SKU
  isHidden: boolean;
  isDeleted?: boolean;
};
