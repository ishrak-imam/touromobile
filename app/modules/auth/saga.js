
import { call, put, select } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'
import {
  init,
  loginReq, loginSucs, loginFail,
  logoutReq, logoutSucs,
  forgotPassReq, forgotPassSucs, forgotPassFail,

  sendAppStatusReq, sendAppStatusSucs, sendAppStatusFail
} from './action'
import config from '../../utils/config'

import { clearImageCache } from '../../components/imageCache/action'

import { getUser, getConnection } from '../../selectors'
import { navigateToScene } from '../../navigation/action'
import localStore, { USER } from '../../utils/persist'
import { login, forgotPass, getUserDetails, sendAppStatus } from './api'

export function * watchInit () {
  yield takeFirst(init.getType(), workerInit)
}

function * workerInit () {
  try {
    const user = yield call(localStore.get, USER)
    if (user.accessToken) {
      yield put(loginSucs(user))
      yield put(sendAppStatusReq({ active: true, isNeedJwt: true }))
      yield put(navigateToScene({ routeName: 'App' }))
    } else {
      yield put(navigateToScene({ routeName: 'Auth' }))
    }
  } catch (e) {
    yield put(navigateToScene({ routeName: 'Auth' }))
  }
}

export function * watchSendAppStatus () {
  yield takeFirst(sendAppStatusReq.getType(), workerSendAppStatus)
}

function * workerSendAppStatus (action) {
  try {
    const { active, jwt } = action.payload
    const user = yield select(getUser)
    const connection = yield select(getConnection)
    const guideId = user.get('guideId')
    const appStatus = {
      active,
      phoneModel: `${config.deviceName} - ${config.deviceYear}`,
      os: `${config.platform} - ${config.systemVersion}`,
      mac: config.deviceId,
      connectivity: connection.get('type') === 'wifi' ? 2 : 1,
      appVersion: config.version
    }
    yield call(sendAppStatus, appStatus, guideId, jwt)
    yield put(sendAppStatusSucs())
  } catch (e) {
    yield put(sendAppStatusFail())
  }
}

export function * watchLogin () {
  yield takeFirst(loginReq.getType(), workerLogin)
}

const formatUserData = (user, details) => {
  return {
    id: user.id,
    guideId: user.guide_id,
    accessToken: user.access_token,
    expiresIn: user.expires_in,
    firstName: user.first_name,
    lastName: user.last_name,
    fullName: user.full_name,
    group: user.group,
    image: user.image,
    email: details.email,
    groups: details.groups,
    phone: details.phone
  }
}

function * workerLogin (action) {
  const { user, password, failMsg } = action.payload
  try {
    const result = yield call(login, user, password)
    const userId = result.id
    const jwt = result.access_token
    const userDetails = yield call(getUserDetails, userId, jwt)
    yield call(localStore.set, USER, formatUserData(result, userDetails))
    yield put(init())
  } catch (e) {
    yield put(loginFail({ msg: failMsg }))
  }
}

export function * watchForgotPass () {
  yield takeFirst(forgotPassReq.getType(), workerForgotPass)
}

function * workerForgotPass (action) {
  const { user, sucsMsg, failMsg } = action.payload
  try {
    yield call(forgotPass, user)
    yield put(forgotPassSucs({ msg: sucsMsg }))
  } catch (e) {
    yield put(forgotPassFail({ msg: failMsg }))
  }
}

export function * watchLogout () {
  yield takeFirst(logoutReq.getType(), workerLogout)
}

function * workerLogout () {
  yield put(sendAppStatusReq({ active: false, isNeedJwt: true }))
  yield call(localStore.delete, USER)
  yield put(clearImageCache())
  yield put(logoutSucs())
  yield put(init())
}
