
import { fork, all } from 'redux-saga/effects'

import * as toastSaga from '../toast/toast'
import * as appSaga from '../modules/app/saga'
import * as connectionSaga from '../connection/saga'
import * as navSaga from '../navigation/saga'
import * as cacheImageSaga from '../components/imageCache/saga'
import * as authSaga from '../modules/auth/saga'
import * as tripsSaga from '../modules/trips/saga'
import * as reportsSaga from '../modules/reports/saga'
import * as profileSaga from '../modules/profile/saga'

const sagas = {
  ...toastSaga,
  ...appSaga,
  ...connectionSaga,
  ...navSaga,
  ...cacheImageSaga,
  ...authSaga,
  ...tripsSaga,
  ...reportsSaga,
  ...profileSaga
}

const forkedSagas = Object.keys(sagas).map(key => fork(sagas[key]))

export default function * rootSaga () {
  yield all(forkedSagas)
}
