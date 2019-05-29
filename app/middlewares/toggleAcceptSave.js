
import {
  SET_ACCEPT_TRIP_COMBOS,

  toggleAcceptSave
} from '../modules/modifiedData/action'
import { getAccept } from '../selectors'
import { getKeyNames, getTransferOptions } from '../utils/futureTrip'

const KEY_NAMES = getKeyNames()
const TRANSFER_OPTIONS = getTransferOptions()

const toggleHandler = store => next => action => {
  const result = next(action)
  if (
    action.payload &&
    action.type === SET_ACCEPT_TRIP_COMBOS
  ) {
    const state = store.getState()
    const { departureId, direction } = action.payload
    const accept = getAccept(state, departureId)
    const dirAccept = accept.get(direction)
    const transfer = dirAccept.get(KEY_NAMES.TRANSFER)
    let saveDisabled = false
    if (transfer) {
      const transferCity = dirAccept.get(KEY_NAMES.TRANSFER_CITY)
      const accommodation = dirAccept.get(KEY_NAMES.ACCOMMODATION)
      if (transfer.get('key') === TRANSFER_OPTIONS.D.key) {
        saveDisabled = !transferCity.get('key')
      }
      if (transfer.get('key') === TRANSFER_OPTIONS.O.key) {
        saveDisabled = !transferCity.get('key') || !(accommodation && accommodation.get('key'))
      }
    }

    store.dispatch(toggleAcceptSave({
      departureId,
      saveDisabled
    }))
  }

  return result
}

export default toggleHandler
