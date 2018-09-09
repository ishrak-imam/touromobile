
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'
import {
  init,
  loginReq, loginSucs, loginFail,
  logoutReq, logoutSucs
} from './action'
import { navigate } from '../../navigation/action'
import localStore, { JWT_TOKEN } from '../../utils/persist'
import { login, getUser } from './api'

export function * watchInit () {
  yield takeFirst(init.getType(), workerInit)
}

function * workerInit () {
  try {
    const { access_token, id } = yield call(localStore.get, JWT_TOKEN)
    if (access_token) {
      let user = yield call(getUser, id, access_token)
      user.token = access_token
      yield call(delay, 1000) // need only api data are mocked, as they are served from json files
      yield put(loginSucs(user))
      yield put(navigate({ routeName: 'App' }))
    } else {
      yield put(navigate({ routeName: 'Auth' }))
    }
  } catch (e) {
    yield put(navigate({ routeName: 'Auth' }))
  }
}

export function * watchLogin () {
  yield takeFirst(loginReq.getType(), workerLogin)
}

function * workerLogin (action) {
  try {
    const { access_token, id } = yield call(login, action.payload)
    yield call(localStore.set, JWT_TOKEN, { access_token, id })
    yield put(init())
  } catch (e) {
    yield put(loginFail({ msg: e }))
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
