import { AppState } from 'react-native'
import { call, put, takeEvery } from 'redux-saga/effects'
import { takeFirst, eventEmitterChannel } from '../../utils/sagaHelpers'

import {
  startAppStateMonitor,
  setAppState
} from './action'

import { getCurrentTrip, getFutureTrips } from '../trips/action'

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
      yield put(getCurrentTrip())
      yield put(getFutureTrips())
    }
  })
}
