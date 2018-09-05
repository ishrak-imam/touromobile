
// import {delay} from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'
import {
  init,
  loginReq, loginSucs, loginFail,
  logoutReq, logoutSucs
} from './action'
import { navigateToScene } from '../../navigation/action'
import localStore, { JWT_TOKEN } from '../../utils/persist'
import { loginRequest } from './api'

export function * watchInit () {
  yield takeFirst(init.getType(), workerInit)
}

function * workerInit () {
  try {
    const jwt = yield call(localStore.get, JWT_TOKEN)
    if (jwt) {
      // yield call(delay, 5000)
      yield put(loginSucs({ jwt }))
      yield put(navigateToScene({ routeName: 'App' }))
    } else {
      yield put(navigateToScene({ routeName: 'Auth' }))
    }
  } catch (e) {
    yield put(navigateToScene({ routeName: 'Auth' }))
  }
}

export function * watchLogin () {
  yield takeFirst(loginReq.getType(), workerLogin)
}

function * workerLogin (action) {
  try {
    const { jwt } = yield call(loginRequest, action.payload)
    yield call(localStore.set, JWT_TOKEN, jwt)
    yield put(init())
  } catch (e) {
    yield put(loginFail())
  }
}

export function * watchLogout () {
  yield takeFirst(logoutReq.getType(), workerLogout)
}

function * workerLogout () {
  yield call(localStore.delete, JWT_TOKEN)
  yield put(logoutSucs())
  yield put(init())
}
