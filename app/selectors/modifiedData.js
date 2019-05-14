import { getMap, getList, isMap, getSet } from '../utils/immutable'

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

export const getOrder = (state, departureId, bookingId, direction, type, mealId) => {
  return state.modifiedData.getIn([departureId, 'orders', bookingId, direction, type, mealId]) || getMap({})
}

export const getInvoicee = (state, departureId, bookingId) => {
  return state.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee']) || getMap({})
}

export const getOrderForBooking = (state, departureId, bookingId) => {
  return state.modifiedData.getIn([departureId, 'orders', bookingId]) || getMap({})
}

export const getOrdersByDirection = (state, departureId, direction) => {
  const orders = state.modifiedData.getIn([departureId, 'orders']) || getMap({})

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
              return true
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

export const getOrders = (state, departureId) => {
  const orders = state.modifiedData.getIn([departureId, 'orders']) || getMap({})

  if (orders.size === 0) {
    return getMap({ out: getList([]), home: getList([]) })
  }

  return orders.reduce((map, booking, bookingId) => {
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

          const allergies = meal.get('allergies')
          if (allergies && allergies.size) {
            allergies.every(item => {
              const mealId = item.get('mealId')
              for (let i = 0; i < item.get('adultCount'); i++) {
                list = list.push(getMap({
                  meal: mealId,
                  drink: null,
                  adult: true,
                  booking: bookingId
                }))
              }
              for (let i = 0; i < item.get('childCount'); i++) {
                list = list.push(getMap({
                  meal: mealId,
                  drink: null,
                  adult: false,
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

          const allergies = meal.get('allergies')
          if (allergies && allergies.size) {
            allergies.every(item => {
              const mealId = item.get('mealId')
              for (let i = 0; i < item.get('adultCount'); i++) {
                list = list.push(getMap({
                  meal: mealId,
                  drink: null,
                  adult: true,
                  booking: bookingId
                }))
              }
              for (let i = 0; i < item.get('childCount'); i++) {
                list = list.push(getMap({
                  meal: mealId,
                  drink: null,
                  adult: false,
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
}

export const getExtraOrders = (state, departureId, bookingId) => {
  return state.modifiedData.getIn([departureId, 'extraOrders', bookingId]) || getMap({})
}

export const getAllExtraOrders = (state, departureId) => {
  return state.modifiedData.getIn([departureId, 'extraOrders']) || getMap({})
}

export const getAllOrders = (state, departureId) => {
  return state.modifiedData.getIn([departureId, 'orders']) || getMap({})
}

export const checkIfAnyOrderMade = (state, departureId) => {
  return !!(state.modifiedData.getIn([departureId, 'orders']) || state.modifiedData.getIn([departureId, 'orders']))
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

export const getParticipantsByBooking = (state, departureId, bookingId) => {
  const participants = state.modifiedData.getIn([departureId, 'participants']) || getMap({})

  return participants.map((excursion, excursionId) => {
    const participants = excursion.get(bookingId)
    if (participants) {
      return participants || getSet([])
    }
  })
}

export const getExtraOrdersByBooking = (state, departureId, bookingId) => {
  return state.modifiedData.getIn([departureId, 'extraOrders', bookingId]) || getMap({})
}

export const getOrdersByBooking = (state, departureId, bookingId) => {
  const orders = state.modifiedData.getIn([departureId, 'orders', bookingId]) || getMap({})

  const def = getMap({
    meal: getMap({}),
    drink: getMap({})
  })

  if (orders.size > 0) {
    return getMap({
      home: orders.get('home') || def,
      out: orders.get('out') || def
    })
  }
  return getMap({
    home: def,
    out: def
  })
}

export const getBucket = (state, departureId, bookingId) => {
  return state.modifiedData.getIn([departureId, 'orders', bookingId, 'bucket']) || getMap({})
}

export const getDistributionFlag = (state, departureId, bookingId) => {
  return !!state.modifiedData.getIn([departureId, 'orders', bookingId, 'isNeedDistribution'])
}
