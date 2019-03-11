
import { call, put, takeEvery } from 'redux-saga/effects'

import {
  syncModifiedData,
  syncModifiedDataSucs,
  syncModifiedDataFail
} from './action'

import { syncData } from './api'

export function * watchSyncModifiedData () {
  yield takeEvery(syncModifiedData.getType(), workerSyncModifiedData)
}

function * workerSyncModifiedData (action) {
  try {
    const { guideId, lastSyncedTime, data, jwt } = action.payload
    yield call(syncData, guideId, { data, lastSyncedTime }, jwt)
    yield put(syncModifiedDataSucs(lastSyncedTime))
  } catch (e) {
    yield put(syncModifiedDataFail(e))
  }
}
