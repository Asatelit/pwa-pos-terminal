export type Product = {
  id: number;
  name: string;
  barcode: string;
  color: string | null;
  extras: string[];
  hasModificationsPrices: boolean;
  modifications: ProductModification[];
  parentId: number;
  picture: string | null;
  price: number;
  costPrice: number;
  sortOrder: number;
  unit: string;
  isHidden: boolean;
  isNonDiscounted: boolean;
  isWeighing: boolean;
  lastModifiedTime: number;
  isDeleted?: boolean;
  cookingTime?: number;
  taxId?: number;
  taxName?: string;
  taxType?: number;
  taxValue?: number;
  taxItemType?: number;
};

export type ProductModification = {
  id: number;
  name: string;
  price: number;
  barcode: string;
  modifierProductCode: string; // SKU
  isHidden: boolean;
  isDeleted?: boolean;
};
