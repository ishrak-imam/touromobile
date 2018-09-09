
export const getCurrentTrip = state => state.get('currentTrip')

export const getPax = bookings => {
  return bookings.map(b => {
    return b.get('pax').map(p => p)
  }).flatten(1) // one level deep flatten
}
