
import { call, put } from 'redux-saga/effects'
import { takeFirst } from '../utils/sagaHelpers'
import { navigate } from '../navigation/service'

import { navigate as navigateToScene, setCurrentScreen } from './action'

const navActions = [
  navigateToScene.getType()
]

export function * watchNavActions () {
  yield takeFirst(navActions, navigationWorker)
}

function * navigationWorker (action) {
  const { routeName, params } = action.payload
  switch (action.type) {
    case 'NAVIGATE':
      yield call(navigate, routeName, params)
  }
  yield put(setCurrentScreen({ screen: routeName }))
}
