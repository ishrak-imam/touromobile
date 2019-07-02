
import { call, put } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'
import {
  connectionLinesReq,
  connectionLinesSucs,
  connectionLinesFail
} from './action'

import { getConnectionLines } from './api'

export function * watchConnectionLineReq () {
  yield takeFirst(connectionLinesReq.getType(), workerConnectionLineReq)
}

function * workerConnectionLineReq (action) {
  try {
    const response = yield call(getConnectionLines)
    yield put(connectionLinesSucs(response))
  } catch (e) {
    yield put(connectionLinesFail())
  }
}
