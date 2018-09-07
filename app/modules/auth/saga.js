
import { call, put } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'
import {
  init,
  loginReq, loginSucs, loginFail,
  logoutReq, logoutSucs
} from './action'
import { navigateToScene } from '../../navigation/action'
import localStore, { JWT_TOKEN } from '../../utils/persist'
import { login, getUser } from './api'
import { getPayloadFromJwt } from '../../utils/jwt'

const USER_ID_KEY = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'

export function * watchInit () {
  yield takeFirst(init.getType(), workerInit)
}

function * workerInit () {
  try {
    const token = yield call(localStore.get, JWT_TOKEN)
    if (token) {
      const payload = getPayloadFromJwt(token)
      const userId = payload[USER_ID_KEY]
      const user = yield call(getUser, userId, token)
      yield put(loginSucs(user))
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
    const user = yield call(login, action.payload)
    yield call(localStore.set, JWT_TOKEN, user.access_token)
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
