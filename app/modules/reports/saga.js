
import { call, put, takeEvery } from 'redux-saga/effects'

import {
  uploadStatsReq,
  uploadStatsSucs,
  uploadStatsFail
} from './action'

import { getPendingStatsUpload } from '../trips/action'

import { uploadStats, uploadOrderStats } from './api'

export function * watchUploadState () {
  yield takeEvery(uploadStatsReq.getType(), workerUploadStats)
}

function * workerUploadStats (action) {
  const {
    departureId, isFlight, statsData, orderStats, jwt,
    showToast, sucsMsg, failMsg
  } = action.payload

  try {
    yield call(uploadStats, departureId, statsData, jwt)
    if (!isFlight) yield call(uploadOrderStats, departureId, orderStats, jwt)
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
