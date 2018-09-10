
import { showToast } from '../toast/action'
import { readValue } from '../utils/immutable'
import Store from '../store'
import { getConnection } from '../selectors'

const { dispatch } = Store

const notOnline = showToast({ message: 'No Internet' })

export const networkActionDispatcher = action => {
  const connection = getConnection(Store.getState())
  const isOnline = readValue('online', connection)
  isOnline ? dispatch(action) : dispatch(notOnline)
}

export const genericActionDispatcher = action => {
  dispatch(action)
}

export const toastDispatcher = message => {
  dispatch(showToast({ message }))
}
