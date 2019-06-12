
import { call, put, takeEvery } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { takeFirst } from '../../utils/sagaHelpers'

import {
  sendSmsReq,
  sendSmsSucs,
  sendSmsFail,

  sendPendingSmsReq,
  sendPendingSmsSucs,
  sendPendingSmsFail,
  deletePendingSms
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

export function * watchSendPendingSms () {
  yield takeEvery(sendPendingSmsReq.getType(), workerSendPendingSms)
}

function * workerSendPendingSms (action) {
  const { jwt, smsPayload, showToast, sucsMsg, failMsg, smsId } = action.payload
  try {
    yield call(sendSms, jwt, smsPayload)
    yield put(sendPendingSmsSucs({
      smsId,
      toast: showToast,
      message: sucsMsg
    }))
    yield call(delay, 1000)
    yield put(deletePendingSms({ smsId }))
  } catch (e) {
    yield put(sendPendingSmsFail({
      smsId,
      toast: showToast,
      message: failMsg
    }))
  }
}
