
// import { delay } from 'redux-saga'
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
  const {
    departureId, statsData, jwt,
    showToast, sucsMsg, failMsg
  } = action.payload

  try {
    yield call(uploadStats, departureId, statsData, jwt)
    // yield call(delay, 2000)
    yield put(uploadStatsSucs({
      toast: showToast,
      message: sucsMsg,
      departureId,
      time: new Date().toISOString()
    }))
    yield put(getPendingStatsUpload({
      showWarning: false,
      msg: '',
      onOk: null
    }))
  } catch (e) {
    yield put(uploadStatsFail({
      departureId,
      toast: showToast,
      message: failMsg
    }))
  }
}
