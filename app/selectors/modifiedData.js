import { getMap, getList, isMap } from '../utils/immutable'

export const getModifiedPax = (state, departureId) => {
  return state.modifiedData.get(departureId)
    ? state.modifiedData.get(departureId).get('modifiedPax') ? state.modifiedData.get(departureId).get('modifiedPax') : getMap({})
    : getMap({})
}
export const getParticipants = (state, departureId) => {
  return state.modifiedData.get(departureId)
    ? state.modifiedData.get(departureId).get('participants') ? state.modifiedData.get(departureId).get('participants') : getMap({})
    : getMap({})
}

export const getAaccept = (state, departureId) => {
  return state.modifiedData.get(departureId)
    ? state.modifiedData.get(departureId).get('accept')
      ? state.modifiedData.get(departureId).get('accept')
      : getMap({})
    : getMap({})
}

export const getModifiedData = state => state.modifiedData

export const getOrder = (state, departureId, bookingId, paxId) => {
  return state.modifiedData.getIn([departureId, 'orders', bookingId, paxId]) || getMap({})
}

export const getInvoicee = (state, departureId, bookingId) => {
  return state.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee'])
}

export const getOrders = (state, departureId, direction) => {
  const orders = state.modifiedData.getIn([departureId, 'orders']) || getMap({})

  if (orders.size === 0) {
    return getMap({})
  }

  return orders.reduce((list, booking) => {
    const bOrders = booking.reduce((bList, pax) => {
      if (isMap(pax)) {
        bList = bList.push(pax.get(direction))
      }
      return bList
    }, getList([]))
    return list.concat(bOrders)
  }, getList([]))
}
