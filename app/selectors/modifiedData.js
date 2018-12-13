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

export const getOrdersByDirection = (state, departureId, direction) => {
  const orders = state.modifiedData.getIn([departureId, 'orders']) || getMap({})

  if (orders.size === 0) {
    return getList([])
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

export const getOrders = (state, departureId) => {
  const orders = state.modifiedData.getIn([departureId, 'orders']) || getMap({})

  if (orders.size === 0) {
    return getMap({ out: getList([]), home: getList([]) })
  }

  return orders.reduce((map, booking) => {
    const bOrders = booking.reduce((bMap, pax) => {
      if (isMap(pax)) {
        if (pax.get('out')) bMap = bMap.set('out', bMap.get('out').push(pax.get('out')))
        if (pax.get('home')) bMap = bMap.set('home', bMap.get('home').push(pax.get('home')))
      } else {
        bMap = bMap.set('invoicee', pax)
      }
      return bMap
    }, getMap({ out: getList([]), home: getList([]) }))
    map = map.set('out', map.get('out').concat(bOrders.get('out')))
    map = map.set('home', map.get('home').concat(bOrders.get('home')))
    return map
  }, getMap({ out: getList([]), home: getList([]) }))
}

export const getAllOrders = (state, departureId) => {
  return state.modifiedData.getIn([departureId, 'orders']) || getMap({})
}
