export type Category = {
  id: string;
  name: string;
  parentId: string | null;
  color: string | null;
  picture: string | null;
  isHidden: boolean;
  isDeleted: boolean;
  sortOrder: number;
  lastModifiedTime: number;
};
