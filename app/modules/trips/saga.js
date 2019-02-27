
import { call, put, select } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'

import {
  tripsReq,
  tripsSucs,
  tripsActionsOnSuccess,
  tripsFail,

  getCurrentTrip,
  setCurrentTrip,

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

  navigateToOtherTripScreen
} from './action'

import {
  acceptTripReq,
  acceptTripFail,
  acceptTripSucs
} from '../modifiedData/action'

import { showModal } from '../../modal/action'

import {
  getTrips, acceptAssignment, confirmReservations,
  getConnections
} from './api'

import {
  getCurrentTrip as gctSelector,
  getFutureTrips as gftSelector,
  getPastTrips as gptSelector,
  pendingStatsUpload,
  remainingFutureTrips
} from '../../selectors'

import { getMap } from '../../utils/immutable'

import { navigate } from '../../navigation/service'

export function * watchGetTrips () {
  yield takeFirst(tripsReq.getType(), workerGetTrips)
}

function * workerGetTrips (action) {
  try {
    const { guideId, jwt, pendingModal, refreshFromFutureTrip } = action.payload
    const data = yield call(getTrips, guideId, jwt)
    yield put(tripsSucs(data))
    yield put(tripsActionsOnSuccess({ pendingModal }))
    yield put(navigateToOtherTripScreen({ refreshFromFutureTrip }))
  } catch (e) {
    yield put(tripsFail(e))
  }
}

export function * watchTripsActionsOnSuccess () {
  yield takeFirst(tripsActionsOnSuccess.getType(), workerTripsActionsOnSuccess)
}

function * workerTripsActionsOnSuccess (action) {
  const { pendingModal } = action.payload
  yield put(getCurrentTrip())
  yield put(getFutureTrips())
  yield put(getPastTrips())
  yield put(getPendingStatsUpload(pendingModal))
  yield put(getRemainingFutureTrips())
}

export function * watchTripNavigation () {
  yield takeFirst(navigateToOtherTripScreen.getType(), workerTripNavigation)
}

function * workerTripNavigation (action) {
  const { refreshFromFutureTrip } = action.payload
  const currentTrip = yield select(gctSelector)
  if (currentTrip.has && !refreshFromFutureTrip) navigate('Home')
  if (!currentTrip.has) {
    const futureTrips = yield select(gftSelector)
    if (futureTrips.has) navigate('FutureTrips')
    else {
      const pastTrips = yield select(gptSelector)
      if (pastTrips.has) navigate('PastTrips')
      else navigate('NoTrips')
    }
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
    acceptData, reservationData,
    showToast, sucsMsg, failMsg
  } = action.payload
  try {
    yield call(acceptAssignment, guideId, departureId, acceptData, jwt)
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
      message: e || failMsg,
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
