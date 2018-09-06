
import { NetInfo } from 'react-native'
import { call, put, takeEvery } from 'redux-saga/effects'
import { takeFirst, eventEmitterChannel } from '../utils/sagaHelpers'

import {
  checkConnection,
  connectionStatus,
  connectionType,
  startConnectionMonitor
} from './action'

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

function * createConnectionSubscription (action) {
  const connectionChannel = yield call(
    eventEmitterChannel,
    NetInfo,
    { on: 'addEventListener', off: 'removeEventListener' },
    'connectionChange'
  )
  yield takeEvery(connectionChannel, function * (connection) {
    yield put(connectionType(connection.type))
    if (connection.type !== 'none') {
      yield put(connectionStatus(true))
    } else {
      yield put(connectionStatus(false))
    }
  })
}
