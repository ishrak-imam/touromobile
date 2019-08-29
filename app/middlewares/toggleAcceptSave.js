
import {
  SET_ACCEPT_TRIP_COMBOS,

  toggleAcceptSave
} from '../modules/modifiedData/action'
import { getAccept } from '../selectors'
import { getKeyNames, getTransferOptions, getBagOptions } from '../utils/futureTrip'

const KEY_NAMES = getKeyNames()
const TRANSFER_OPTIONS = getTransferOptions()
const BAG_OPTIONS = getBagOptions()

const shouldSaveDisabled = (accept, other) => {
  let gotLocation = false
  let gotTransfer = false
  let gotBag = false
  if (accept && other) {
    const location = accept.get(KEY_NAMES.LOCATION)
    gotLocation = location && location.get('key')

    const transfer = accept.get(KEY_NAMES.TRANSFER)
    if (transfer) {
      const transferCity = accept.get(KEY_NAMES.TRANSFER_CITY)
      const accommodation = accept.get(KEY_NAMES.ACCOMMODATION)
      if (transfer.get('key') === TRANSFER_OPTIONS.D.key) {
        gotTransfer = transferCity.get('key')
      }
      if (transfer.get('key') === TRANSFER_OPTIONS.O.key) {
        gotTransfer = transferCity.get('key') && (accommodation && accommodation.get('key'))
      }
      if (transfer.get('key') === TRANSFER_OPTIONS.NT.key) gotTransfer = true
    }

    const bag = accept.get(KEY_NAMES.BAG)
    const otherBag = other.get(KEY_NAMES.BAG)
    gotBag = (bag && bag.get('key')) || (otherBag && (otherBag.get('key') === BAG_OPTIONS.ET.key))
  }
  return !(gotLocation && gotTransfer && gotBag)
}

const toggleHandler = store => next => action => {
  const result = next(action)
  if (
    action.payload &&
    action.type === SET_ACCEPT_TRIP_COMBOS
  ) {
    const state = store.getState()
    const { departureId } = action.payload
    const accept = getAccept(state, departureId)
    const out = accept.get('out')
    const home = accept.get('home')
    const saveDisabled = shouldSaveDisabled(out, home) || shouldSaveDisabled(home, out)
    store.dispatch(toggleAcceptSave({
      departureId,
      saveDisabled
    }))
  }

  return result
}

export default toggleHandler
