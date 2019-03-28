
import { call, put, takeEvery, select } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'

import {
  syncModifiedData,
  syncModifiedDataSucs,
  syncModifiedDataFail,

  ssnDataReq,
  ssnDataSucs,
  ssnDataFail,

  setDownloadedModifiedData,

  restructureModifiedData
} from './action'

import { syncData, getSSNdata } from './api'

import { getModifiedData, getTripsData } from '../../selectors'

import { restructureData } from '../../utils/modifiedDataRestructure'
import { getMap } from '../../utils/immutable'

export function * watchSyncModifiedData () {
  yield takeEvery(syncModifiedData.getType(), workerSyncModifiedData)
}

function * workerSyncModifiedData (action) {
  try {
    const { guideId, lastSyncedTime, data, jwt } = action.payload
    yield call(syncData, guideId, { data, lastSyncedTime }, jwt)
    yield put(syncModifiedDataSucs(lastSyncedTime))
  } catch (e) {
    yield put(syncModifiedDataFail(e))
  }
}

export function * watchSsnDataReq () {
  yield takeFirst(ssnDataReq.getType(), workerSsnDataReq)
}

function * workerSsnDataReq (action) {
  const { ssn, departureId, bookingId } = action.payload
  try {
    const ssnData = yield call(getSSNdata, ssn)
    const invoicee = {
      address: ssnData.Address,
      city: ssnData.City,
      ssn,
      zip: ssnData.Zip
    }
    yield put(ssnDataSucs({
      departureId,
      bookingId,
      invoicee
    }))
  } catch (e) {
    yield put(ssnDataFail({
      departureId,
      bookingId
    }))
  }
}

export function * watchRestructureModifiedData () {
  yield takeFirst(restructureModifiedData.getType(), workerRestructureModifiedData)
}

function * workerRestructureModifiedData () {
  try {
    let modifiedData = yield select(getModifiedData)
    const allTrips = yield select(getTripsData)
    modifiedData = restructureData(modifiedData, allTrips, modifiedData.get('structureVersion'))
    yield put(setDownloadedModifiedData(modifiedData))
  } catch (e) {
    console.log('MODIFIED_DATA_RESTRUCTURE_FAIL', e)
  }
}
