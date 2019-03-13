
import { call, put } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'

import {
  sendSmsReq,
  sendSmsSucs,
  sendSmsFail
} from './action'

import { sendSms } from './api'

import { navigateBack } from '../../navigation/service'

export function * watchSendSms () {
  yield takeFirst(sendSmsReq.getType(), workerSendSms)
}

function * workerSendSms (action) {
  const { jwt, smsPayload, showToast, sucsMsg, failMsg } = action.payload
  try {
    yield call(sendSms, jwt, smsPayload)
    yield put(sendSmsSucs({
      toast: showToast,
      message: sucsMsg
    }))
    yield call(navigateBack)
  } catch (e) {
    yield put(sendSmsFail({
      toast: showToast,
      message: failMsg
    }))
  }
}
