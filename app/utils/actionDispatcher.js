
import { showToast } from '../modules/toast/action'
import { readValue } from '../utils/immutable'

const notOnline = showToast({ message: 'No Internet' })

export const networkActionDispatcher = (dispatch, action, connection) => {
  // readValue('online', connection) ? dispatch(action) : dispatch(notOnline)
  dispatch(action)
}

export const genericActionDispatcher = (dispatch, action) => {
  dispatch(action)
}

export const toastActionDispatcher = (dispatch, message) => {
  dispatch(showToast({ message }))
}
