
import { call, put } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'

import {
  userDetailsReq,
  userDetailsSucs,
  userDetailsFail
} from './action'

import {
  getUserDetails
} from './api'

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
    yield put(userDetailsFail(e))
  }
}
