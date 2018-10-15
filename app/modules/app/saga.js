import { AppState } from 'react-native'
import { call, put, takeEvery, select } from 'redux-saga/effects'
import { takeFirst, eventEmitterChannel } from '../../utils/sagaHelpers'

import {
  startAppStateMonitor,
  setAppState
} from './action'

import {
  getCurrentTrip,
  getFutureTrips,
  getPastTrips,
  getPendingStatsUpload
} from '../trips/action'

import { getUser } from '../../selectors'

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
      const isLoggedIn = user.get('access_token')
      if (isLoggedIn) {
        yield put(getCurrentTrip())
        yield put(getFutureTrips())
        yield put(getPastTrips())
        yield put(getPendingStatsUpload({
          showWarning: false,
          msg: '',
          onOk: null
        }))
      }
    }
  })
}
