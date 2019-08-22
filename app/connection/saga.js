
import NetInfo from '@react-native-community/netinfo'
import { call, put, takeEvery, select } from 'redux-saga/effects'
import {
  takeFirst,
  EECforNetInfo
  // eventEmitterChannel
} from '../utils/sagaHelpers'

import {
  checkConnection,
  connectionStatus,
  connectionType,
  startConnectionMonitor
} from './action'

import {
  syncPendingProfileUpdate
} from '../modules/profile/action'

import { getUser } from '../selectors'

function checkIfConnected () {
  return NetInfo.isConnected.fetch()
}

function getConnectionInfo () {
  return NetInfo.getConnectionInfo()
}

export function * watchCheckConnection () {
  yield takeFirst(checkConnection.getType(), workerCheckConnection)
}

function * workerCheckConnection () {
  const connected = yield call(checkIfConnected)
  let connection = { type: 'none' }
  if (connected) {
    connection = yield call(getConnectionInfo)
  }
  yield put(connectionStatus(connected))
  yield put(connectionType(connection.type))
}

export function * watchConnection () {
  yield takeFirst(startConnectionMonitor.getType(), createConnectionSubscription)
}

// function * createConnectionSubscription (action) {
//   const connectionChannel = yield call(
//     eventEmitterChannel,
//     NetInfo,
//     { on: 'addEventListener', off: 'removeEventListener' },
//     'connectionChange'
//   )
//   yield takeEvery(connectionChannel, function * (connection) {
//     yield put(connectionType(connection.type))
//     if (connection.type !== 'none') {
//       yield put(connectionStatus(true))
//       const user = yield select(getUser)
//       const isLoggedIn = user.get('accessToken')
//       if (isLoggedIn) {
//         yield put(syncPendingProfileUpdate())
//       }
//     } else {
//       yield put(connectionStatus(false))
//     }
//   })
// }

function * createConnectionSubscription (action) {
  const connectionChannel = yield call(
    EECforNetInfo,
    NetInfo,
    { on: 'addEventListener' }
  )
  yield takeEvery(connectionChannel, function * (connection) {
    yield put(connectionType(connection.type))
    if (connection.type !== 'none') {
      yield put(connectionStatus(true))
      const user = yield select(getUser)
      const isLoggedIn = user.get('accessToken')
      if (isLoggedIn) {
        yield put(syncPendingProfileUpdate())
      }
    } else {
      yield put(connectionStatus(false))
    }
  })
}
