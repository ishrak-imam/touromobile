
import { isBefore } from 'date-fns'
import { call, put, select } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'
import { getImmutableObject, mergeMapDeep } from '../../utils/immutable'

import {
  userDetailsReq,
  userDetailsSucs,
  userDetailsFail,

  updateProfileReq,
  updateProfileSucs,
  updateProfileFail,

  syncPendingProfileUpdate,

  downloadAppDataReq,
  downloadAppDataSucs,
  downloadAppDataFail
} from './action'

import { syncModifiedData, setDownloadedModifiedData, restructureModifiedData } from '../modifiedData/action'

import {
  getUserDetails,
  updateProfile,
  downloadAppData
} from './api'

import {
  getUser,
  getProfileUpdates,
  getUserInProfile,
  getLastSyncedTime,
  getModifiedData
} from '../../selectors'

export function * watchGetUserDetails () {
  yield takeFirst(userDetailsReq.getType(), workerGetUserDetails)
}

const formatUserData = user => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    city: user.city,
    zip: user.zip,
    phone: user.phone,
    email: user.email,
    account: user.account
  }
}

function * workerGetUserDetails (action) {
  try {
    const { guideId, jwt } = action.payload
    const user = yield call(getUserDetails, guideId, jwt)
    yield put(userDetailsSucs(formatUserData(user)))
  } catch (e) {
    let user = yield select(getUser)
    const mutated = [
      'accessToken',
      'expiresIn',
      'group',
      'image'
    ].reduce((map, key) => map.delete(key), user)
    yield put(userDetailsFail(mutated))
  }
}

export function * watchUpdateProfile () {
  yield takeFirst(updateProfileReq.getType(), workerUpdateProfile)
}

function * workerUpdateProfile (action) {
  const { guideId, changes, profile, jwt } = action.payload
  try {
    yield call(updateProfile, guideId, changes, jwt)
    yield put(updateProfileSucs(profile))
  } catch (e) {
    yield put(updateProfileFail({ changes, profile }))
  }
}

export function * watchPendingProfileUpdate () {
  yield takeFirst(syncPendingProfileUpdate.getType(), workerPendingProfileUpdate)
}

function * workerPendingProfileUpdate () {
  const changes = yield select(getProfileUpdates)
  if (changes) {
    const user = yield select(getUser)
    const guideId = user.get('guideId')
    const jwt = user.get('accessToken')
    const profile = yield select(getUserInProfile)
    yield put(updateProfileReq({
      guideId,
      changes: changes.toJS(),
      profile,
      jwt
    }))
  }
}

export function * watchDownloadAppData () {
  yield takeFirst(downloadAppDataReq.getType(), workerDownloadAppData)
}

function * workerDownloadAppData (action) {
  const { guideId, jwt, showToast, sucsMsg, failMsg } = action.payload
  try {
    const { lastSyncedTime, data } = yield call(downloadAppData, guideId, jwt)
    const lastSyncedTimeLocal = yield select(getLastSyncedTime)
    if (!lastSyncedTimeLocal || isBefore(lastSyncedTimeLocal, lastSyncedTime)) {
      const modifiedData = yield select(getModifiedData)
      yield put(setDownloadedModifiedData(mergeMapDeep(
        modifiedData,
        getImmutableObject({ lastSyncedTime, ...data })
      )))
      yield put(restructureModifiedData())
    }
    yield put(syncModifiedData({}))
    yield put(downloadAppDataSucs({
      toast: showToast,
      message: sucsMsg
    }))
  } catch (e) {
    yield put(downloadAppDataFail({
      toast: showToast,
      message: failMsg
    }))
  }
}
