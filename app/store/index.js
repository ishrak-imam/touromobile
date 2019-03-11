/* eslint-disable */

import { getInitialState } from '../utils/initialState'


/**
 * Redux
 */
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './rootReducer'


/**
 * Middlewares
 */
import Logger from '../middlewares/logger'
import AttachJwt from '../middlewares/attachJwt'
import Toast from '../middlewares/toast'
import ClearTransferCity from '../middlewares/clearTransferCity'
import ClearBag from '../middlewares/clearBag'
import SetSentryUser from '../middlewares/setSentryUser'
import SyncData from '../middlewares/syncData'


/**
 * Saga
 */
import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga'
const SagaMiddleware = createSagaMiddleware()
const middlewares = [
  SagaMiddleware, AttachJwt, Toast, ClearTransferCity, ClearBag,
  SetSentryUser, SyncData
]
if (__DEV__) {
  middlewares.push(Logger)
}


/**
 * Persist
 */
import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// import storage from './sqlite'
import storage from './filesystem'
import immutableTransform from 'redux-persist-transform-immutable'
const persistConfig = {
  transforms: [immutableTransform()],
  key: 'root',
  storage,
  blacklist: ['login', 'navigation', 'app', 'connection', 'modal'],
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
