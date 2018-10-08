
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'

import {
  uploadStatsReq,
  uploadStatsSucs,
  uploadStatsFail
} from './action'

import { uploadStats } from './api'

export function * watchUploadState () {
  yield takeFirst(uploadStatsReq.getType(), workerUploadStats)
}

function * workerUploadStats (action) {
  try {
    const { departureId, data, jwt } = action.payload
    yield call(uploadStats, departureId, data, jwt)
    yield call(delay, 2000)
    yield put(uploadStatsSucs())
  } catch (e) {
    yield put(uploadStatsFail())
  }
}
