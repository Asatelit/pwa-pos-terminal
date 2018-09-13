import { action } from 'typesafe-actions';
import { AppActionTypes as ActionTypes, StockGroup, StockItem, CartItem, Image } from './types';

// Here we use the `action` helper function provided by `typesafe-actions`.
// This library provides really useful helpers for writing Redux actions in a type-safe manner.
// For more info: https://github.com/piotrwitek/typesafe-actions

export const requestMarketData = () => action(ActionTypes.REQUEST_MARKET_DATA);
export const receiveMarketData = (data: StockGroup[]) => action(ActionTypes.RECEIVE_MARKET_DATA, data);
export const failureMarketData = (message: string) => action(ActionTypes.FAILURE_MARKET_DATA, message);

export const requestImage = () => action(ActionTypes.REQUEST_IMAGE);
export const receiveImage = (data: Image) => action(ActionTypes.RECEIVE_IMAGE, data);
export const failureImage = (message: string) => action(ActionTypes.FAILURE_IMAGE, message);

export const changeCategoryTab = (index: number) => action(ActionTypes.CHANGE_CATEGORY_TAB, index);
export const clearOrderHistory = () => action(ActionTypes.CLEAR_ORDER_HISTORY);
export const closeHistoryDialog = () => action(ActionTypes.CLOSE_HISTORY_DIALOG);
export const closeProductDialog = (cartItem: CartItem) => action(ActionTypes.CLOSE_PRODUCT_DIALOG, cartItem);
export const openHistoryDialog = () => action(ActionTypes.OPEN_HISTORY_DIALOG);
export const openProductDialog = (productItem: StockItem) => action(ActionTypes.OPEN_PRODUCT_DIALOG, productItem);
export const removeItemFromCart = (itemIndex: number) => action(ActionTypes.REMOVE_FROM_CART, itemIndex);
export const updateColumnGrid = (columns: number) => action(ActionTypes.UPDATE_COLUMN_GRID, columns);
export const updateOrderHistory = (isCompleted: boolean) => action(ActionTypes.UPDATE_ORDER_HISTORY, isCompleted);
