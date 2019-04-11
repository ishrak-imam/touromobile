import { getMap, getList, isMap } from '../utils/immutable'

import { getTripByDepartureId } from './trip'

export const getModifiedData = state => state.modifiedData

export const getModifiedPax = (state, departureId) => {
  return state.modifiedData.getIn([departureId, 'modifiedPax']) || getMap({})
}
export const getParticipants = (state, departureId) => {
  return state.modifiedData.getIn([departureId, 'participants']) || getMap({})
}

export const getAaccept = (state, departureId) => {
  return state.modifiedData.getIn([departureId, 'accept']) || getMap({})
}

export const getOrder = (state, departureId, bookingId, paxId) => {
  return state.modifiedData.getIn([departureId, 'orders', bookingId, paxId]) || getMap({})
}

export const getOrderSummaryMode = (state, departureId, bookingId, direction, type, mealId) => {
  return state.modifiedData.getIn([departureId, 'ordersSummaryMode', bookingId, direction, type, mealId]) || getMap({})
}

export const getInvoicee = (state, departureId, bookingId) => {
  return state.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee'])
}

export const getInvoiceeSummaryMode = (state, departureId, bookingId) => {
  return state.modifiedData.getIn([departureId, 'ordersSummaryMode', bookingId, 'invoicee']) || getMap({})
}

export const getOrderForBookingSummaryMode = (state, departureId, bookingId) => {
  return state.modifiedData.getIn([departureId, 'ordersSummaryMode', bookingId]) || getMap({})
}

export const getOrdersByDirection = (state, departureId, direction, orderMode) => {
  const key = orderMode === 'SUMMARY' ? 'ordersSummaryMode' : 'orders'
  const orders = state.modifiedData.getIn([departureId, key]) || getMap({})

  if (orders.size === 0) {
    return getList([])
  }

  return orders.reduce((list, booking) => {
    const bOrders = booking.get(direction)

    if (bOrders && bOrders.size > 0) {
      const meals = bOrders.get('meal')
      if (meals && meals.size > 0) {
        list = list.concat(meals.reduce((mList, meal) => {
          for (let i = 0; i < meal.get('adultCount'); i++) {
            mList = mList.push(getMap({
              meal: meal.get('mealId'),
              adult: true
            }))
          }
          for (let i = 0; i < meal.get('childCount'); i++) {
            mList = mList.push(getMap({
              meal: meal.get('mealId'),
              adult: false
            }))
          }

          if (meal.get('allergies')) {
            const allergies = meal.get('allergies')
            allergies.every(order => {
              for (let i = 0; i < order.get('adultCount'); i++) {
                mList = mList.push(getMap({
                  meal: order.get('mealId'),
                  adult: true,
                  allergyText: order.get('allergyText')
                }))
              }
              for (let i = 0; i < order.get('childCount'); i++) {
                mList = mList.push(getMap({
                  meal: order.get('mealId'),
                  adult: false,
                  allergyText: order.get('allergyText')
                }))
              }
            })
          }

          return mList
        }, getList([])))
      }

      const drinks = bOrders.get('drink')
      if (drinks && drinks.size > 0) {
        list = list.concat(drinks.reduce((dList, drink) => {
          for (let i = 0; i < drink.get('count'); i++) {
            dList = dList.push(getMap({
              drink: drink.get('drinkId'),
              adult: !drink.get('isChild')
            }))
          }
          return dList
        }, getList([])))
      }
    }

    return list
  }, getList([]))
}

export const getOrders = (state, departureId, orderMode) => {
  const key = orderMode === 'SUMMARY' ? 'ordersSummaryMode' : 'orders'
  const orders = state.modifiedData.getIn([departureId, key]) || getMap({})

  if (orders.size === 0) {
    return getMap({ out: getList([]), home: getList([]) })
  }

  const formattedOrders = orderMode === 'SUMMARY'
    ? orders.reduce((map, booking, bookingId) => {
      const outOrders = booking.get('out')
      if (outOrders && outOrders.size > 0) {
        const meals = outOrders.get('meal')
        if (meals && meals.size > 0) {
          map = map.set('out', map.get('out').concat(meals.reduce((list, meal) => {
            for (let i = 0; i < meal.get('adultCount'); i++) {
              list = list.push(getMap({
                meal: meal.get('mealId'),
                drink: null,
                adult: true,
                booking: bookingId
              }))
            }
            for (let i = 0; i < meal.get('childCount'); i++) {
              list = list.push(getMap({
                meal: meal.get('mealId'),
                drink: null,
                adult: false,
                booking: bookingId
              }))
            }

            /**
             * Allergy
             */
            if (meal.get('allergies')) {
              const allergies = meal.get('allergies')
              allergies.every(order => {
                for (let i = 0; i < order.get('adultCount'); i++) {
                  list = list.push(getMap({
                    meal: order.get('mealId'),
                    adult: true,
                    allergyText: order.get('allergyText'),
                    booking: bookingId
                  }))
                }
                for (let i = 0; i < order.get('childCount'); i++) {
                  list = list.push(getMap({
                    meal: order.get('mealId'),
                    adult: false,
                    allergyText: order.get('allergyText'),
                    booking: bookingId
                  }))
                }

                return true
              })
            }

            return list
          }, getList([]))))
        }

        const drinks = outOrders.get('drink')
        if (drinks && drinks.size > 0) {
          map = map.set('out', map.get('out').concat(drinks.reduce((list, drink) => {
            for (let i = 0; i < drink.get('count'); i++) {
              list = list.push(getMap({
                drink: drink.get('drinkId'),
                meal: null,
                adult: !drink.get('isChild'),
                booking: bookingId
              }))
            }
            return list
          }, getList([]))))
        }
      }

      const homeOrders = booking.get('home')
      if (homeOrders && homeOrders.size > 0) {
        const meals = homeOrders.get('meal')
        if (meals && meals.size) {
          map = map.set('home', map.get('home').concat(meals.reduce((list, meal) => {
            for (let i = 0; i < meal.get('adultCount'); i++) {
              list = list.push(getMap({
                meal: meal.get('mealId'),
                drink: null,
                adult: true,
                booking: bookingId
              }))
            }
            for (let i = 0; i < meal.get('childCount'); i++) {
              list = list.push(getMap({
                meal: meal.get('mealId'),
                drink: null,
                adult: false,
                booking: bookingId
              }))
            }

            /**
             * Allergy
             */
            if (meal.get('allergies')) {
              const allergies = meal.get('allergies')
              allergies.every(order => {
                for (let i = 0; i < order.get('adultCount'); i++) {
                  list = list.push(getMap({
                    meal: order.get('mealId'),
                    adult: true,
                    allergyText: order.get('allergyText'),
                    booking: bookingId
                  }))
                }
                for (let i = 0; i < order.get('childCount'); i++) {
                  list = list.push(getMap({
                    meal: order.get('mealId'),
                    adult: false,
                    allergyText: order.get('allergyText'),
                    booking: bookingId
                  }))
                }
                return true
              })
            }

            return list
          }, getList([]))))
        }

        const drinks = homeOrders.get('drink')
        if (drinks && drinks.size) {
          map = map.set('home', map.get('home').concat(drinks.reduce((list, drink) => {
            for (let i = 0; i < drink.get('count'); i++) {
              list = list.push(getMap({
                drink: drink.get('drinkId'),
                meal: null,
                adult: !drink.get('isChild'),
                booking: bookingId
              }))
            }
            return list
          }, getList([]))))
        }
      }

      return map
    }, getMap({ out: getList([]), home: getList([]) }))

    : orders.reduce((map, booking) => {
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

  return formattedOrders
}

export const getExtraOrdersSummaryMode = (state, departureId, bookingId) => {
  return state.modifiedData.getIn([departureId, 'extraOrdersSummaryMode', bookingId]) || getMap({})
}

export const getAllExtraOrdersSummaryMode = (state, departureId) => {
  return state.modifiedData.getIn([departureId, 'extraOrdersSummaryMode']) || getMap({})
}

export const getAllOrders = (state, departureId, orderMode) => {
  const key = orderMode === 'SUMMARY' ? 'ordersSummaryMode' : 'orders'
  return state.modifiedData.getIn([departureId, key]) || getMap({})
}

export const checkIfAnyOrderMade = (state, departureId) => {
  return !!(state.modifiedData.getIn([departureId, 'orders']) || state.modifiedData.getIn([departureId, 'ordersSummaryMode']))
}

export const getLastSyncedTime = state => {
  return state.modifiedData.get('lastSyncedTime')
}

export const getAcceptedAssignments = state => {
  const modifiedData = state.modifiedData
  return modifiedData.reduce((list, tripData, key) => {
    if (isMap(tripData)) {
      const departureId = key
      const isAccepted = tripData.getIn(['accept', 'acceptedAt'])
      if (isAccepted) {
        let accept = tripData.get('accept')
        accept = accept.set('trip', getTripByDepartureId(state, departureId))
        list = list.push(accept)
      }
    }
    return list
  }, getList([]))
}
