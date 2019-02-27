import { AppState } from 'react-native'
import { call, put, takeEvery, select } from 'redux-saga/effects'
import { takeFirst, eventEmitterChannel } from '../../utils/sagaHelpers'
import FileSystemStorage from '../../store/filesystem'

import {
  startAppStateMonitor,
  setAppState,
  clearLocalData
} from './action'

import { tripsActionsOnSuccess } from '../trips/action'

import { getUser } from '../../selectors'

export function * watchClearLocalData () {
  yield takeFirst(clearLocalData.getType(), workerClearLocalData)
}

function * workerClearLocalData () {
  yield call(FileSystemStorage.clearData)
}

export function * watchAppState () {
  yield takeFirst(startAppStateMonitor.getType(), createAppStateSubscription)
}

function * createAppStateSubscription (action) {
  const appStateChannel = yield call(
    eventEmitterChannel,
    AppState,
    { on: 'addEventListener', off: 'removeEventListener' },
    'change'
  )
  yield takeEvery(appStateChannel, function * (appState) {
    yield put(setAppState(appState !== 'active'))
    if (appState === 'active') {
      const user = yield select(getUser)
      const isLoggedIn = user.get('accessToken')
      if (isLoggedIn) {
        yield put(tripsActionsOnSuccess({
          pendingModal: {}
        }))
      }
    }
  })
}
