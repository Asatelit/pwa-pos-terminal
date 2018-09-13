import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { AppActionTypes, StockGroup, StockItem } from './types';
import { receiveMarketData, failureMarketData, failureImage, receiveImage } from './actions';
import callApi from '../../utils/callApi';
import fetchImage from '../../utils/fetchImage';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '';

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((byte: number) => (binary += String.fromCharCode(byte)));
  return window.btoa(binary);
}

function* handleFetch() {
  try {
    // To call async functions, use redux-saga's `call()`.
    const res = yield call(callApi, 'get', API_ENDPOINT, './stock.json');
    yield put(res.error ? failureMarketData(res.error) : receiveMarketData(res));
  } catch (err) {
    yield put(failureMarketData(err instanceof Error ? err.stack! : 'An unknown error occured.'));
  }
}

function* handleFetchImage(filename: string) {
  try {
    const res = yield call(fetchImage, API_ENDPOINT, `./images/${filename}`);
    const buffer = yield res.arrayBuffer();
    yield put(
      res.error
        ? failureImage(res.error)
        : receiveImage({ [filename]: `data:image/png;base64,${arrayBufferToBase64(buffer)}` }),
    );
  } catch (err) {
    yield put(failureImage(err instanceof Error ? err.stack! : `Parsing image failed [${filename}]`));
  }
}

function* requestImages(action) {
  const data = action.payload as StockGroup[];
  let items: StockItem[] = [];

  // Extract items from categories
  data.forEach(category => {
    items = [...items, ...category.items];
  });

  // Get unique images ID
  const uniqueImages: string[] = Array.from(new Set(items.map(item => item.picture)));
  yield all(uniqueImages.map(id => handleFetchImage(id)));
}

function* watchFetchRequests() {
  yield takeEvery(AppActionTypes.REQUEST_MARKET_DATA, handleFetch);
  yield takeEvery(AppActionTypes.RECEIVE_MARKET_DATA, requestImages);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* appSaga() {
  yield all([fork(watchFetchRequests)]);
}

export default appSaga;
