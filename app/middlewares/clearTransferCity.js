
import { setAcceptTripCombos } from '../modules/modifiedData/action'
import {
  getKeyNames
  // getTransferOptions
} from '../utils/futureTrip'

const KEY_NAMES = getKeyNames()
// const TRANSFER_OPTIONS = getTransferOptions()

const clearTransferCity = store => next => action => {
  if (
    action.payload &&
    action.type === setAcceptTripCombos.getType() &&
    action.payload.key === KEY_NAMES.TRANSFER
    // action.payload.value.key === TRANSFER_OPTIONS.NT.key
  ) {
    store.dispatch(setAcceptTripCombos({
      departureId: action.payload.departureId,
      key: KEY_NAMES.TRANSFER_CITY,
      value: { key: '', value: '' },
      direction: action.payload.direction
    }))
  }
  return next(action)
}

export default clearTransferCity
