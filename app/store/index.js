import { createStore, applyMiddleware } from 'redux'
import rootReducer from './rootReducer'

import { getInitialState } from '../utils/initialState'

import Logger from '../middlewares/logger'
import AttachJwt from '../middlewares/attachJwt'

import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga'

const SagaMiddleware = createSagaMiddleware()

const middlewares = [SagaMiddleware, AttachJwt]

/* eslint-disable */
if (__DEV__) {
  middlewares.push(Logger);
}
/* eslint-disable */

const store = createStore(
  rootReducer,
  getInitialState(),
  applyMiddleware(...middlewares)
)

SagaMiddleware.run(rootSaga)
export default store
