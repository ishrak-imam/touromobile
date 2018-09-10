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

function * workerGetCurrentTrip (action) {
  try {
    const { jwt } = action
    const { data } = yield call(getCurrentTrip, jwt)
    yield put(currentTripSucs(data))
  } catch (e) {
    yield put(currentTripFail(e))
  }
}
