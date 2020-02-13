export type Category = {
  id: number;
  name: string;
  parentId: number;
  color: string | null;
  picture: string | null;
  isHidden: boolean;
  isDeleted: boolean;
  sortOrder: number;
  subCategories: number[];
  lastModifiedTime: number;
};
