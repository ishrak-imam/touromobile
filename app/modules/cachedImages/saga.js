
import { call, put, takeEvery } from 'redux-saga/effects'
import { createB64Image, createB64ImageSucs } from './action'
import { getB64Image } from './service'
import { getHash } from '../../utils/stringHelpers'

export function * watchCreateB64Image () {
  yield takeEvery(createB64Image.getType(), workerCreateB64Image)
}

function * workerCreateB64Image (action) {
  const { uri } = action.payload
  const b64 = yield call(getB64Image, uri)
  const uriHash = getHash(uri)
  yield put(createB64ImageSucs({
    key: uriHash, value: b64
  }))
}
