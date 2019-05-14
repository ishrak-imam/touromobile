
import { setAcceptTripCombos } from '../modules/modifiedData/action'
import { getKeyNames, getBagOptions } from '../utils/futureTrip'

const KEY_NAMES = getKeyNames()
const BAG_OPTIONS = getBagOptions()

const clearBag = store => next => action => {
  if (
    action.payload &&
    action.type === setAcceptTripCombos.getType() &&
    action.payload.key === KEY_NAMES.BAG &&
    action.payload.value.key === BAG_OPTIONS.ET.key
  ) {
    store.dispatch(setAcceptTripCombos({
      departureId: action.payload.departureId,
      key: KEY_NAMES.BAG,
      value: { key: '', value: '' },
      direction: action.payload.direction === 'out' ? 'home' : 'out'
    }))
  }
  return next(action)
}

export default clearBag
