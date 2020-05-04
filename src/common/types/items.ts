export type Item = {
  barcode: string;
  color: string | null;
  cookingTime: number;
  costPrice: number;
  extras: string[];
  hasModificationsPrices: boolean;
  id: string;
  isDeleted: boolean;
  isHidden: boolean;
  isNonDiscounted: boolean;
  isWeighing: boolean;
  lastModifiedTime: number;
  modifications: ItemModification[];
  name: string;
  parentId: string | null;
  picture: string | null;
  price: number;
  sortOrder: number;
  taxes: string[];
  unit: string;
};

export type ItemModification = {
  id: string;
  name: string;
  price: number;
  barcode: string;
  modifierProductCode: string; // SKU
  isHidden: boolean;
  isDeleted: boolean;
};
