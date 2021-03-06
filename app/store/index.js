/* eslint-disable */

import { getInitialState } from '../utils/initialState'
import { mergeMapShallow } from '../utils/immutable'


/**
 * Redux
 */
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './rootReducer'


/**
 * Middlewares
 */
import Middlewares from '../middlewares'
import Logger from '../middlewares/logger'


/**
 * Saga
 */
import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga'
const SagaMiddleware = createSagaMiddleware()
const middlewares = [SagaMiddleware, ...Middlewares]
if (__DEV__) {
  middlewares.push(Logger)
}


const stateReconciler = (inboundState, originalState, reducedState, _ref) => {
  const newState = Object.assign({}, reducedState);
  const needsMerge = _ref.needsMerge
  if (inboundState && typeof inboundState === 'object') {
    Object.keys(inboundState).forEach(function (key) {
      if (key === '_persist') return;
      if (originalState[key] !== reducedState[key]) return;
      if(needsMerge.includes(key)) {
        newState[key] = mergeMapShallow(reducedState[key], inboundState[key])
      } else {
        newState[key] = inboundState[key];
      }
    });
  }
  return newState;
}


/**
 * Persist
 */
import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// import storage from './sqlite'
import storage from './filesystem'
import immutableTransform from 'redux-persist-transform-immutable'
import { reduce } from 'rxjs/operators';
const persistConfig = {
  transforms: [immutableTransform()],
  key: 'root',
  storage,
  blacklist: ['login', 'navigation', 'connection', 'modal'],
  needsMerge: ['profile', 'trips'],
  stateReconciler
}
const persistedReducer = persistReducer(persistConfig, rootReducer)



/**
 * Exports
 */
export const store = createStore(
  persistedReducer,
  getInitialState(),
  applyMiddleware(...middlewares)
)
export const persistor = persistStore(store)


/**
 * Run saga middleware after apply middleware
 */
SagaMiddleware.run(rootSaga)
