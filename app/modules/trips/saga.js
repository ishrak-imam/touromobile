
import { call, put, select } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'

import {
  tripsReq,
  tripsSucs,
  tripsActionsOnSuccess,
  tripsFail,

  getCurrentTrip,
  setCurrentTrips,

  getFutureTrips,
  setFutureTrips,

  getPastTrips,
  setPastTrips,

  getPendingStatsUpload,
  setPendingStatsUpload,

  getRemainingFutureTrips,
  setRemainingFutureTrips,

  connectionsReq,
  connectionsSucs,
  connectionsFail,

  reservationsReq,
  reservationsSucs,
  reservationsFail,

  navigateToOtherTripScreen
} from './action'

import {
  acceptTripReq,
  acceptTripFail,
  acceptTripSucs
} from '../modifiedData/action'

import { showModal } from '../../modal/action'

import {
  getTrips,
  // acceptAssignment,
  confirmReservations,
  getConnections, getReservations
} from './api'

import {
  getCurrentTrip as gctSelector,
  getFutureTrips as gftSelector,
  getPastTrips as gptSelector,
  pendingStatsUpload,
  remainingFutureTrips,
  formatCurrentTrip
} from '../../selectors'

import { getMap, getImmutableObject } from '../../utils/immutable'

import { resetToScene } from '../../navigation/service'

export function * watchGetTrips () {
  yield takeFirst(tripsReq.getType(), workerGetTrips)
}

function * workerGetTrips (action) {
  try {
    const { guideId, jwt, pendingModal, refreshFromFutureTrip, refreshFromPastTrip } = action.payload
    const data = yield call(getTrips, guideId, jwt)
    yield put(tripsSucs(data))
    yield put(tripsActionsOnSuccess({ pendingModal }))
    yield put(navigateToOtherTripScreen({ refreshFromFutureTrip, refreshFromPastTrip }))
  } catch (e) {
    yield put(tripsFail(e))
  }
}

export function * watchTripsActionsOnSuccess () {
  yield takeFirst(tripsActionsOnSuccess.getType(), workerTripsActionsOnSuccess)
}

function * workerTripsActionsOnSuccess (action) {
  try {
    const { pendingModal } = action.payload
    yield put(getCurrentTrip())
    yield put(getFutureTrips())
    yield put(getPastTrips())
    yield put(getPendingStatsUpload(pendingModal))
    yield put(getRemainingFutureTrips())
  } catch (e) {
    console.log('TRIPS_ACTION_ON_SUCCESS_FAIL', e)
  }
}

export function * watchTripNavigation () {
  yield takeFirst(navigateToOtherTripScreen.getType(), workerTripNavigation)
}

function * workerTripNavigation (action) {
  try {
    const { refreshFromFutureTrip, refreshFromPastTrip } = action.payload
    let currentTrip = yield select(gctSelector)
    if (currentTrip.has && (!refreshFromFutureTrip && !refreshFromPastTrip)) {
      const trips = currentTrip.trips
      if (trips.size === 1) {
        resetToScene('Home', { left: 'menu' })
      } else if (trips.size > 1) {
        resetToScene('CurrentTrips')
      }
    }
    if (!currentTrip.has) {
      const futureTrips = yield select(gftSelector)
      if (futureTrips.has) resetToScene('FutureTrips', { left: 'menu' })
      else {
        const pastTrips = yield select(gptSelector)
        if (pastTrips.has) resetToScene('PastTrips', { left: 'menu' })
        else {
          if (!refreshFromFutureTrip && !refreshFromPastTrip) {
            resetToScene('NoTrips')
          }
        }
      }
    }
  } catch (e) {
    console.log('TRIP_NAVIGATION_ERROR', e)
  }
}

export function * watchGetCurrentTrip () {
  yield takeFirst(getCurrentTrip.getType(), workerGetCurrentTrip)
}

function * workerGetCurrentTrip (action) {
  try {
    const currentTrip = yield select(gctSelector)
    if (currentTrip.has && currentTrip.trips.size === 1) {
      const trip = currentTrip.trips.get(0)
      currentTrip.trip = formatCurrentTrip(trip)
    }
    yield put(setCurrentTrips(currentTrip))
  } catch (e) {
    console.log(e)
  }
}

export function * watchGetFutureTrips () {
  yield takeFirst(getFutureTrips.getType(), workerGetFutureTrips)
}

function * workerGetFutureTrips (action) {
  try {
    const trips = yield select(gftSelector)
    yield put(setFutureTrips(trips))
  } catch (e) {
    console.log(e)
  }
}

export function * watchGetPastTrips () {
  yield takeFirst(getPastTrips.getType(), workerGetPastTrips)
}

function * workerGetPastTrips (action) {
  try {
    const trips = yield select(gptSelector)
    yield put(setPastTrips(trips))
  } catch (e) {
    console.log(e)
  }
}

export function * watchGetPendingStatsUpload () {
  yield takeFirst(getPendingStatsUpload.getType(), workerGetPendingStatsUpload)
}

function * workerGetPendingStatsUpload (action) {
  const { showWarning, msg, onOk } = action.payload
  const count = yield select(pendingStatsUpload)
  yield put(setPendingStatsUpload(count))
  if (count > 0 && showWarning) {
    yield put(showModal({
      type: 'warning',
      text: `${count} ${msg}`,
      onOk
    }))
  }
}

export function * watchGetRemainingFutureTrips () {
  yield takeFirst(getRemainingFutureTrips.getType(), workerGetRemainingFutureTrips)
}

function * workerGetRemainingFutureTrips () {
  const count = yield select(remainingFutureTrips)
  yield put(setRemainingFutureTrips(count))
}

export function * watchAcceptTrip () {
  yield takeFirst(acceptTripReq.getType(), workerAcceptTrip)
}

function * workerAcceptTrip (action) {
  const {
    guideId, departureId, jwt,
    // acceptData,
    reservationData,
    showToast, sucsMsg, failMsg
  } = action.payload
  try {
    /**
     * TODO: consecutive call effects can be made parallel
     */
    // yield call(acceptAssignment, guideId, departureId, acceptData, jwt)
    yield call(confirmReservations, guideId, departureId, reservationData, jwt)
    yield put(acceptTripSucs({
      toast: showToast,
      message: sucsMsg,
      departureId,
      time: new Date().toISOString()
    }))
    yield put(getRemainingFutureTrips())
  } catch (e) {
    yield put(acceptTripFail({
      toast: showToast,
      message: failMsg,
      departureId
    }))
  }
}

function formatConnections (connections) {
  return connections.reduce((map, connection) => {
    const conn = {
      key: connection.id,
      value: connection.location
    }
    if (connection.direct) map.direct.push(getMap(conn))
    if (connection.directWinter) map.directWinter.push(getMap(conn))
    if (connection.overnight) map.overnight.push(getMap(conn))
    return map
  }, { direct: [], directWinter: [], overnight: [] })
}

export function * watchGetConnections () {
  yield takeFirst(connectionsReq.getType(), workerGetConnections)
}

function * workerGetConnections (action) {
  const { jwt } = action.payload
  try {
    const connections = yield call(getConnections, jwt)
    yield put(connectionsSucs(formatConnections(connections)))
  } catch (e) {
    yield put(connectionsFail())
  }
}

export function * watchGetReservations () {
  yield takeFirst(reservationsReq.getType(), workerGerReservations)
}

function * workerGerReservations (action) {
  const { guideId, jwt } = action.payload
  try {
    const reservations = yield call(getReservations, guideId, jwt)
    yield put(reservationsSucs(getImmutableObject(reservations)))
  } catch (e) {
    yield put(reservationsFail())
  }
}
