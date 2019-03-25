
import { showToast } from '../toast/action'
import { readValue } from '../utils/immutable'
import { store } from '../store'
import { getConnection } from '../selectors'
import { Localization } from 'expo'

let locale = Localization.locale
locale = locale ? locale.split('-')[0] : ''

const { dispatch } = store
const notOnline = showToast({
  message: locale === 'sv' ? 'Internetåkomst saknas' : 'No Internet'
})

export const networkActionDispatcher = action => {
  const connection = getConnection(store.getState())
  const isOnline = readValue('online', connection)
  isOnline ? dispatch(action) : dispatch(notOnline)
  // dispatch(action)
}

export const actionDispatcher = action => {
  dispatch(action)
}
