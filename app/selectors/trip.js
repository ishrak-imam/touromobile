
import { getMap } from '../utils/immutable'

export const getCurrentTrip = state => state.currentTrip // state.get('currentTrip')

export const getPax = bookings => {
  return bookings.map(b => {
    return b.get('pax').map(p => getMap({ ...p.toJS(), booking: b }))
  }).flatten(1) // one level deep flatten
}
