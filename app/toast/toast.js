
import { call } from 'redux-saga/effects'
import { takeFirst } from '../utils/sagaHelpers'
import { Toast } from 'native-base'
import { showToast } from './action'

const displayToast = message => {
  Toast.show({
    text: message,
    buttonText: 'Ok'
  })
}

export function * watchShowToast () {
  yield takeFirst(showToast.getType(), workerShowToast)
}

function * workerShowToast (action) {
  const { message } = action.payload
  yield call(displayToast, message)
}
