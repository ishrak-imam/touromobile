
import {
  SELECT_INVOICEE, DELETE_INVOICEE,

  setIsNeedDistribution,
  setOrderBucket, setInvoiceeList
} from '../modules/modifiedData/action'
import { getMap, getSet } from '../utils/immutable'
import {
  getExcursions, getModifiedPax,
  getParticipantsByBooking,
  getOrdersByBooking,
  getExtraOrders
} from '../selectors'
import { flattenParticipants, checkIfAllDistributed } from '../utils/distribution'

const _putOrdersIntoBucket = (bucket, direction, meals) => {
  let dOrders = bucket.get(direction) || getMap({})
  let bMealOrders = dOrders.get('meal') || getMap({})
  meals.every((meal, mealId) => {
    let bMeal = bMealOrders.get(mealId) || getMap({ mealId, adultCount: 0, childCount: 0 })
    bMeal = bMeal.set('adultCount', meal.get('adultCount') + bMeal.get('adultCount'))
      .set('childCount', meal.get('childCount') + bMeal.get('childCount'))

    bMealOrders = bMealOrders.set(mealId, bMeal)
    return true
  })

  dOrders = dOrders.set('meal', bMealOrders)
  return bucket.setIn(['orders', direction], dOrders)
}

const _putParticipantsIntoBucket = (bucket, participants) => {
  let bParticipants = bucket.get('participants') || getMap({})
  participants.every((par, exId) => {
    let bPar = bParticipants.get(exId) || getMap({
      id: exId,
      name: par.get('name'),
      adult: getMap({ count: 0, pax: getSet([]) }),
      child: getMap({ count: 0, pax: getSet([]) })
    })
    bPar = bPar.setIn(['adult', 'count'], bPar.getIn(['adult', 'count']) + par.getIn(['adult', 'count']))
      .setIn(['child', 'count'], bPar.getIn(['child', 'count']) + par.getIn(['child', 'count']))
    bPar = bPar.setIn(['adult', 'pax'], bPar.getIn(['adult', 'pax']).concat(par.getIn(['adult', 'pax'])))
      .setIn(['child', 'pax'], bPar.getIn(['child', 'pax']).concat(par.getIn(['child', 'pax'])))

    bParticipants = bParticipants.set(exId, bPar)

    return true
  })

  return bucket.set('participants', bParticipants)
}

const _putRemovedInvoiceeItemsIntoBucket = (bucket, invoicee) => {
  let newBucket = bucket
  const extraOrders = invoicee.get('extraOrders') || getMap({})
  if (extraOrders && extraOrders.size) {
    newBucket = newBucket.set('extraOrders', extraOrders.merge(newBucket.get('extraOrders') || getMap({})))
  }

  const orders = invoicee.get('orders')
  if (orders && orders.size) {
    const outOrders = orders.get('out') || getMap({})
    const outMeals = outOrders.get('meal')
    if (outMeals && outMeals.size) {
      newBucket = _putOrdersIntoBucket(newBucket, 'out', outMeals)
    }

    const homeOrders = orders.get('home') || getMap()
    const homeMeals = homeOrders.get('meal')
    if (homeMeals && homeMeals.size) {
      newBucket = _putOrdersIntoBucket(newBucket, 'home', homeMeals)
    }
  }

  const participants = invoicee.get('participants')
  if (participants && participants.size) {
    newBucket = _putParticipantsIntoBucket(newBucket, participants)
  }

  return newBucket
}

const invoiceeMonitor = store => next => action => {
  const prevState = store.getState()
  const result = next(action)

  if (action.type === SELECT_INVOICEE) {
    const { departureId, bookingId, booking } = action.payload
    const state = store.getState()
    const invoiceeList = state.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee'])
    if (invoiceeList.size > 1) {
      store.dispatch(setIsNeedDistribution({
        departureId,
        bookingId,
        isNeedDistribution: true
      }))
    }

    const prevInvoiceeList = prevState.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee']) || getMap({})
    if (prevInvoiceeList.size === 1 && invoiceeList.size === 2) {
      const excursions = getExcursions(state)
      const modifiedPax = getModifiedPax(state, departureId)

      let bucket = state.modifiedData.getIn([departureId, 'orders', bookingId, 'bucket']) || getMap({})
      const orders = getOrdersByBooking(state, departureId, bookingId)
      let participants = getParticipantsByBooking(state, departureId, bookingId)
      participants = flattenParticipants(participants, excursions, booking, modifiedPax)
      const extraOrders = getExtraOrders(state, departureId, bookingId)

      bucket = bucket.set('orders', orders)
        .set('participants', participants)
        .set('extraOrders', extraOrders)

      store.dispatch(setOrderBucket({
        departureId,
        bookingId,
        bucket
      }))
    }
  }

  if (action.type === DELETE_INVOICEE) {
    const { departureId, bookingId, paxId } = action.payload
    const state = store.getState()
    const prevInvoiceeList = prevState.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee'])
    let invoiceeList = state.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee'])

    let bucket = state.modifiedData.getIn([departureId, 'orders', bookingId, 'bucket']) || getMap({})

    if (prevInvoiceeList.size === 2 && invoiceeList.size === 1) {
      bucket = bucket.set('orders', getMap({}))
        .set('participants', getMap({}))
        .set('extraOrders', getMap({}))

      invoiceeList = invoiceeList.map(invoicee => {
        return invoicee.set('orders', getMap({}))
          .set('participants', getMap({}))
          .set('extraOrders', getMap({}))
      })

      store.dispatch(setOrderBucket({
        departureId,
        bookingId,
        bucket
      }))

      store.dispatch(setInvoiceeList({
        departureId,
        bookingId,
        invoiceeList
      }))

      store.dispatch(setIsNeedDistribution({
        departureId,
        bookingId,
        isNeedDistribution: false
      }))

      return result
    }

    const invoicee = prevInvoiceeList.get(paxId)
    bucket = _putRemovedInvoiceeItemsIntoBucket(bucket, invoicee)
    store.dispatch(setOrderBucket({
      departureId,
      bookingId,
      bucket
    }))

    store.dispatch(setIsNeedDistribution({
      departureId,
      bookingId,
      isNeedDistribution: !checkIfAllDistributed(bucket)
    }))
  }

  return result
}

export default invoiceeMonitor
