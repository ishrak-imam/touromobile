
import { showToast } from '../toast/action'
import { readValue } from '../utils/immutable'
import { store } from '../store'
import { getConnection } from '../selectors'
import { trackRequest } from '../requestmanager/action'
import * as Localization from 'expo-localization'

let locale = Localization.locale
locale = locale ? locale.split('-')[0] : ''

const { dispatch } = store
const notOnline = showToast({
  message: locale === 'sv' ? 'Internetåkomst saknas' : 'No Internet'
})

export const networkActionDispatcher = action => {
  const connection = getConnection(store.getState())
  const isOnline = readValue('online', connection)
  if (isOnline) {
    dispatch(action)
    dispatch(trackRequest(action))
  } else {
    dispatch(notOnline)
  }
  // dispatch(action)
}

export const actionDispatcher = action => {
  dispatch(action)
}
