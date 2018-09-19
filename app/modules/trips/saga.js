
import { call, put, select } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'

import {
  tripsReq,
  tripsSucs,
  tripsFail,

  getCurrentTrip,
  setCurrentTrip,
  setNoMoreTrips
} from './action'

import {
  getTripsApi
} from './api'

import {
  getCurrentTrip as gctSelector
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
  } catch (e) {
    yield put(tripsFail(e))
  }
}

export function * watchGetCurrentTrip () {
  yield takeFirst(getCurrentTrip.getType(), workerGetCurrentTrip)
}

function * workerGetCurrentTrip (action) {
  const { noMoreTrips, currentTrip } = yield select(gctSelector)
  if (noMoreTrips) {
    yield put(setNoMoreTrips())
  }
  yield put(setCurrentTrip(currentTrip))
}
