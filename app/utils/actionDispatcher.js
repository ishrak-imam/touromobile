
import { showToast } from '../toast/action'
import { readValue } from '../utils/immutable'
import { store } from '../store'
import { getConnection } from '../selectors'

const { dispatch } = store
const notOnline = showToast({ message: 'No Internet' })

export const networkActionDispatcher = action => {
  const connection = getConnection(store.getState())
  const isOnline = readValue('online', connection)
  isOnline ? dispatch(action) : dispatch(notOnline)
  // dispatch(action)
}

export const actionDispatcher = action => {
  dispatch(action)
}
