export type Waiter = {
  id: number;
  name: string;
  pinCode: string;
  activeOrderId: number;
  activeHallId: number;
  isLogged: boolean;
  isAdmin: boolean;
  lastModifiedTime: number;
  isDeleted?: boolean;
};
