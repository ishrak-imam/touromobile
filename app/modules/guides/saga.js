
import { call, put } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'

import {
  guidesListReq,
  guidesListSucs,
  guidesListFail
} from './action'

import { getGuidesList } from './api'

export function * watchGuidesListReq () {
  yield takeFirst(guidesListReq.getType(), workerGuidesListReq)
}

function * workerGuidesListReq (action) {
  try {
    const { jwt } = action.payload
    const guides = yield call(getGuidesList, jwt)
    yield put(guidesListSucs(guides))
  } catch {
    yield put(guidesListFail())
  }
}
