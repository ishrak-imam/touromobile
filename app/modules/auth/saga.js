
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'
import {
  init,
  loginReq, loginSucs, loginFail,
  logoutReq, logoutSucs,
  forgotPassReq, forgotPassSucs, forgotPassFail
} from './action'
// import { clearImageCache } from '../../components/imageCache/action'
import { navigateToScene } from '../../navigation/action'
import localStore, { USER } from '../../utils/persist'
import { login, forgotPass } from './api'

export function * watchInit () {
  yield takeFirst(init.getType(), workerInit)
}

function * workerInit () {
  try {
    const user = yield call(localStore.get, USER)
    if (user.accessToken) {
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

const formatUserData = user => {
  return {
    id: user.id,
    guideId: user.guide_id,
    accessToken: user.access_token,
    expiresIn: user.expires_in,
    firstName: user.first_name,
    lastName: user.last_name,
    fullName: user.full_name,
    group: user.group,
    image: user.image
  }
}

function * workerLogin (action) {
  const { user, password, failMsg } = action.payload
  try {
    const result = yield call(login, user, password)
    yield call(localStore.set, USER, formatUserData(result))
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
    yield call(delay, 2000)
    yield put(forgotPassSucs({ msg: sucsMsg }))
  } catch (e) {
    yield put(forgotPassFail({ msg: failMsg }))
  }
}

export function * watchLogout () {
  yield takeFirst(logoutReq.getType(), workerLogout)
}

function * workerLogout () {
  yield call(localStore.delete, USER)
  // yield put(clearImageCache())
  yield put(logoutSucs())
  yield put(init())
}
