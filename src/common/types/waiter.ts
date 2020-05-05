export type Waiter = {
  id: string;
  name: string;
  pinCode: string;
  activeOrderId: number;
  activeHallId: number;
  isLogged: boolean;
  isAdmin: boolean;
  lastModifiedTime: number;
  isDeleted?: boolean;
};
