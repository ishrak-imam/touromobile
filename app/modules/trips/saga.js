
import { delay } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'

import {
  tripsReq,
  tripsSucs,
  tripsFail,

  getCurrentTrip,
  setCurrentTrip,

  getFutureTrips,
  setFutureTrips,

  getPastTrips,
  setPastTrips,

  getPendingStatsUpload,
  setPendingStatsUpload
} from './action'

import {
  acceptTripReq,
  acceptTripFail,
  acceptTripSucs
} from '../modifiedData/action'

import { showModal } from '../../modal/action'

import {
  getTripsApi, acceptTrip
} from './api'

import {
  getCurrentTrip as gctSelector,
  getFutureTrips as gftSelector,
  getPastTrips as gptSelector,
  pendingStatsUpload
} from '../../selectors'

export function * watchGetTrips () {
  yield takeFirst(tripsReq.getType(), workerGetTrips)
}

function * workerGetTrips (action) {
  try {
    const { guideId, jwt } = action.payload
    const data = yield call(getTripsApi, guideId, jwt)
    yield put(tripsSucs(data))
    yield put(getCurrentTrip())
    yield put(getFutureTrips())
    yield put(getPastTrips())
    yield put(getPendingStatsUpload({
      showWarning: false,
      msg: '',
      onOk: null
    }))
  } catch (e) {
    yield put(tripsFail(e))
  }
}

export function * watchGetCurrentTrip () {
  yield takeFirst(getCurrentTrip.getType(), workerGetCurrentTrip)
}

function * workerGetCurrentTrip (action) {
  const trip = yield select(gctSelector)
  yield put(setCurrentTrip(trip))
}

export function * watchGetFutureTrips () {
  yield takeFirst(getFutureTrips.getType(), workerGetFutureTrips)
}

function * workerGetFutureTrips (action) {
  const trips = yield select(gftSelector)
  yield put(setFutureTrips(trips))
}

export function * watchGetPastTrips () {
  yield takeFirst(getPastTrips.getType(), workerGetPastTrips)
}

function * workerGetPastTrips (action) {
  const trips = yield select(gptSelector)
  yield put(setPastTrips(trips))
}

export function * watchGetPendingStatsUpload () {
  yield takeFirst(getPendingStatsUpload.getType(), workerGetPendingStatsUpload)
}

function * workerGetPendingStatsUpload (action) {
  const { showWarning, msg, onOk } = action.payload
  const count = yield select(pendingStatsUpload)
  yield put(setPendingStatsUpload({ count }))

  if (count > 0 && showWarning) {
    yield put(showModal({
      type: 'warning',
      text: `${count} ${msg}`,
      onOk
    }))
  }
}

export function * watchAcceptTrip () {
  yield takeFirst(acceptTripReq.getType(), workerAcceptTrip)
}

function * workerAcceptTrip (action) {
  const {
    guideId, departureId, jwt,
    showToast, sucsMsg, failMsg
  } = action.payload
  try {
    yield call(acceptTrip, guideId, jwt)
    yield call(delay, 2000)
    yield put(acceptTripSucs({
      toast: showToast,
      message: sucsMsg,
      departureId,
      time: new Date().toISOString()
    }))
  } catch (e) {
    yield put(acceptTripFail({
      toast: showToast,
      message: failMsg,
      departureId
    }))
  }
}
