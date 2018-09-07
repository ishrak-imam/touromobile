
import { fork, all } from 'redux-saga/effects'

import * as toastSaga from '../toast/toast'
import * as connectionSaga from '../connection/saga'
import * as navSaga from '../navigation/saga'
import * as authSaga from '../modules/auth/saga'
import * as tripSaga from '../modules/currentTrip/saga'

const sagas = {
  ...toastSaga,
  ...connectionSaga,
  ...navSaga,
  ...authSaga,
  ...tripSaga
}

const forkedSagas = Object.keys(sagas).map(key => fork(sagas[key]))

export default function * rootSaga () {
  yield all(forkedSagas)
}
