
import { call, put, select } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'

import {
  userDetailsReq,
  userDetailsSucs,
  userDetailsFail,

  updateProfileReq,
  updateProfileSucs,
  updateProfileFail
} from './action'

import {
  getUserDetails,
  updateProfile
} from './api'

import { getUser } from '../../selectors'

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
