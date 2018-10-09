
import { delay } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'

import {
  uploadStatsReq,
  uploadStatsSucs,
  uploadStatsFail
} from './action'

import { getPendingStatsUpload } from '../trips/action'

import { uploadStats } from './api'

export function * watchUploadState () {
  yield takeEvery(uploadStatsReq.getType(), workerUploadStats)
}

function * workerUploadStats (action) {
  try {
    const { departureId, statsData, jwt } = action.payload
    yield call(uploadStats, departureId, statsData, jwt)
    yield call(delay, 2000)
    yield put(uploadStatsSucs({
      departureId,
      time: new Date().toISOString()
    }))
    yield put(getPendingStatsUpload())
  } catch (e) {
    yield put(uploadStatsFail())
  }
}
