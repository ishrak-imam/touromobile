import { call, put } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'

import {
  currentTripReq,
  currentTripSucs,
  currentTripFail
} from './action'

import {
  getCurrentTrip
} from './api'

export function * watchGetCurrentTrip () {
  yield takeFirst(currentTripReq.getType(), workerGetCurrentTrip)
}

function * workerGetCurrentTrip () {
  try {
    const { data } = yield call(getCurrentTrip)
    yield put(currentTripSucs(data))
  } catch (e) {
    yield put(currentTripFail(e))
  }
}
