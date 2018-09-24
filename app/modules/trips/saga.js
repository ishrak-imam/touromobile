
import { call, put, select } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'

import {
  tripsReq,
  tripsSucs,
  tripsFail,

  getCurrentTrip,
  setCurrentTrip,

  getFutureTrips,
  setFutureTrips
} from './action'

import {
  getTripsApi
} from './api'

import {
  getCurrentTrip as gctSelector,
  getFutureTrips as gftSelector
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
