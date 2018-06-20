import ActionTypes from '../constants/ActionTypes';

export function updateMarketData(data) {
  return {
    type: ActionTypes.RECEIVE_MARKET_DATA,
    payload: data,
  };
}

export function requestImages(data) {
  return dispatch => {
    const newStock = [];
    const arrayBufferToBase64 = buffer => {
      let binary = '';
      const bytes = [].slice.call(new Uint8Array(buffer));
      bytes.forEach(function (byte) {
        binary += String.fromCharCode(byte);
      });
      return window.btoa(binary);
    };
    Promise.all(
      ...data.map((category, categoryIndex) => {
        newStock.push({ ...category });
        return [
          ...category.items.map((item, itemIndex) =>
            fetch(`./images/${item.picture}`)
              .then(response => response.arrayBuffer())
              .then(buffer => {
                newStock[categoryIndex].items[itemIndex] = {
                  ...item,
                  picture: `data:image/png;base64,${arrayBufferToBase64(buffer)}`,
                };
                return Promise.resolve();
              })
              .catch(ex => console.error(`Parsing image failed [${item.picture}]`, ex)),
          ),
        ];
      }),
    ).then(() => {
      dispatch(updateMarketData(newStock));
    });
  };
}

export function requestMarketData() {
  return dispatch => {
    fetch('./stock.json')
      .then(response => response.json())
      .then(data => dispatch(requestImages(data)))
      .catch(ex => console.error('Parsing failed', ex));
  };
}

export const updateColumnGrid = columns => ({
  type: ActionTypes.UPDATE_COLUMN_GRID,
  payload: columns,
});

export const changeCategoryTab = index => ({
  type: ActionTypes.CHANGE_CATEGORY_TAB,
  payload: index,
});

export const openHistoryDialog = () => ({
  type: ActionTypes.OPEN_HISTORY_DIALOG,
});

export const closeHistoryDialog = () => ({
  type: ActionTypes.CLOSE_HISTORY_DIALOG,
});

export const openProductDialog = productItem => ({
  type: ActionTypes.OPEN_PRODUCT_DIALOG,
  payload: productItem,
});

export const closeProductDialog = cartItem => ({
  type: ActionTypes.CLOSE_PRODUCT_DIALOG,
  payload: cartItem,
});

export const removeItemFromCart = itemIndex => ({
  type: ActionTypes.REMOVE_FROM_CART,
  payload: itemIndex,
});

export const clearOrderHistory = () => ({
  type: ActionTypes.CLEAR_ORDER_HISTORY,
});

export const updateOrderHistory = isCompleted => ({
  type: ActionTypes.UPDATE_ORDER_HISTORY,
  payload: isCompleted,
});
