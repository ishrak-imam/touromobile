
import {
  TAKE_EXTRA_ORDER,
  SET_PARTICIPANTS,

  TAKE_ORDER,

  TAKE_ALLERGY_ORDER,
  SET_ALLERGY_ORDER,

  setOrderBucket, setInvoiceeList
} from '../modules/modifiedData/action'
import { getMap } from '../utils/immutable'
import {
  getExcursions, getModifiedPax,
  getParticipantsByBooking,
  getOrdersByBooking
} from '../selectors'

import { flattenParticipants } from '../utils/distribution'

const _setOrderIntoBucket = (bucket, order, direction, mealId) => {
  let bOrders = bucket.get('orders') || getMap({})
  let dirOrders = bOrders.get(direction) || getMap({})
  let meals = dirOrders.get('meal') || getMap({})
  meals = meals.set(mealId, order)
  dirOrders = dirOrders.set('meal', meals)
  bOrders = bOrders.set(direction, dirOrders)
  bucket = bucket.set('orders', bOrders)
  return bucket
}

const _setAllergyOrderIntoBucket = (bucket, allergyOrder, direction, mealId, allergyId) => {
  let bOrders = bucket.get('orders')
  let dirOrders = bOrders.get(direction)
  let meals = dirOrders.get('meal')
  let meal = meals.get(mealId)
  let allergies = meal.get('allergies')
  allergies = allergies.set(allergyId, allergyOrder)
  meal = meal.set('allergies', allergies)
  meals = meals.set(mealId, meal)
  dirOrders = dirOrders.set('meal', meals)
  bOrders = bOrders.set(direction, dirOrders)
  bucket = bucket.set('orders', bOrders)
  return bucket
}

const _increaseAllergyOrderIntoBucket = (bucket, direction, mealId, allergyId, key) => {
  let bOrders = bucket.get('orders') || getMap({})
  let dirOrders = bOrders.get(direction) || getMap({})
  let meals = dirOrders.get('meal') || getMap({})
  let meal = meals.get(mealId)
  let allergies = meal.get('allergies')
  let allergyMeal = allergies.get(allergyId)
  allergyMeal = allergyMeal.set(key, allergyMeal.get(key) + 1)
  allergies = allergies.set(allergyId, allergyMeal)
  meal = meal.set('allergies', allergies)
  meals = meals.set(mealId, meal)
  dirOrders = dirOrders.set('meal', meals)
  bOrders = bOrders.set(direction, dirOrders)
  bucket = bucket.set('orders', bOrders)
  return bucket
}

const _increaseOrderIntoBucket = (bucket, direction, mealId, key) => {
  let bOrders = bucket.get('orders') || getMap({})
  let dirOrders = bOrders.get(direction) || getMap({})
  let meals = dirOrders.get('meal') || getMap({})
  let meal = meals.get(mealId) || getMap({ mealId, adultCount: 0, childCount: 0 })
  meal = meal.set(key, meal.get(key) + 1)
  meals = meals.set(mealId, meal)
  dirOrders = dirOrders.set('meal', meals)
  bOrders = bOrders.set(direction, dirOrders)
  bucket = bucket.set('orders', bOrders)
  return bucket
}

const addItemsToBucket = store => next => action => {
  const prevState = store.getState()
  const result = next(action)
  const state = store.getState()

  if (action.type === TAKE_EXTRA_ORDER) {
    const { departureId, bookingId } = action.payload

    let invoiceeList = state.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee']) || getMap({})
    if (invoiceeList.size > 1) {
      let bucket = state.modifiedData.getIn([departureId, 'orders', bookingId, 'bucket']) || getMap({})

      let { extraOrders } = action.payload
      let distributedOrders = getMap({})
      invoiceeList = invoiceeList.map(invoicee => {
        let inExtraOrders = invoicee.get('extraOrders') || getMap({})
        if (inExtraOrders.size > 0) {
          inExtraOrders = inExtraOrders.filter((order, orderId) => {
            if (extraOrders.get(orderId)) {
              distributedOrders = distributedOrders.set(orderId, order)
              return true
            }
            return false
          })
          invoicee = invoicee.set('extraOrders', inExtraOrders)
        }
        return invoicee
      })
      extraOrders = extraOrders.filter((order, orderId) => {
        return !distributedOrders.get(orderId)
      })

      bucket = bucket.set('extraOrders', extraOrders)
      store.dispatch(setOrderBucket({
        departureId, bookingId, bucket
      }))
      store.dispatch(setInvoiceeList({
        departureId, bookingId, invoiceeList
      }))
    }
  }

  if (action.type === SET_PARTICIPANTS) {
    let { departureId, excursionId, booking, bookingId } = action.payload

    let invoiceeList = state.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee']) || getMap({})

    if (invoiceeList.size > 1) {
      let bucket = state.modifiedData.getIn([departureId, 'orders', bookingId, 'bucket']) || getMap({})

      const excursions = getExcursions(state)
      const modifiedPax = getModifiedPax(state, departureId)

      let participants = getParticipantsByBooking(state, departureId, bookingId)
      let exParticipants = participants.get(excursionId)

      invoiceeList = invoiceeList.map(invoicee => {
        let inPar = invoicee.get('participants') || getMap({})
        let inExPar = inPar.get(excursionId)

        if (inExPar && inExPar.size > 0) {
          let adult = inExPar.get('adult')
          let aPax = adult.get('pax')
          aPax = aPax.filter(p => exParticipants.has(p))
          adult = adult.set('count', aPax.size).set('pax', aPax)

          let child = inExPar.get('child')
          let cPax = child.get('pax')
          cPax = cPax.filter(p => exParticipants.has(p))
          child = child.set('count', cPax.size).set('pax', cPax)

          inExPar = inExPar.set('adult', adult).set('child', child)
          inPar = inPar.set(excursionId, inExPar)
        }
        invoicee = invoicee.set('participants', inPar)
        return invoicee
      })

      let newParticipants = action.payload.participants

      invoiceeList.every(invoicee => {
        const ex = invoicee.getIn(['participants', excursionId])
        if (ex) {
          const adultPax = ex.getIn(['adult', 'pax'])
          newParticipants = newParticipants.filter(p => {
            return !adultPax.has(p)
          })

          const childPax = ex.getIn(['child', 'pax'])
          newParticipants = newParticipants.filter(p => {
            return !childPax.has(p)
          })
        }
        return true
      })

      newParticipants = getMap({ [excursionId]: newParticipants })
      newParticipants = flattenParticipants(newParticipants, excursions, booking, modifiedPax)
      let bucketPar = bucket.get('participants') || getMap({})
      bucketPar = bucketPar.set(excursionId, newParticipants.get(excursionId))
      bucket = bucket.set('participants', bucketPar)

      store.dispatch(setOrderBucket({
        departureId, bookingId, bucket
      }))
      store.dispatch(setInvoiceeList({
        departureId, bookingId, invoiceeList
      }))
    }
  }

  if (action.type === TAKE_ORDER) {
    const { mealType } = action.payload
    if (mealType === 'meal') {
      let { departureId, bookingId, direction, mealId, order } = action.payload

      let invoiceeList = state.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee']) || getMap({})

      if (invoiceeList.size > 1) {
        let bucket = state.modifiedData.getIn([departureId, 'orders', bookingId, 'bucket']) || getMap({})

        const prevOrders = getOrdersByBooking(prevState, departureId, bookingId)
        const prevOrder = prevOrders.getIn([direction, 'meal', mealId])

        invoiceeList = invoiceeList.map(invoicee => {
          let orders = invoicee.get('orders') || getMap({})
          let dOrders = orders.get(direction) || getMap({})
          let mealOrders = dOrders.get('meal') || getMap({})
          let meal = mealOrders.get(mealId)
          if (meal && meal.size) {
            if (prevOrder.get('adultCount') > order.get('adultCount')) {
              meal = meal.set('adultCount', 0)
            }

            if (prevOrder.get('childCount') > order.get('childCount')) {
              meal = meal.set('childCount', 0)
            }

            mealOrders = mealOrders.set(mealId, meal)
            dOrders = dOrders.set('meal', mealOrders)
            orders = orders.set(direction, dOrders)
            invoicee = invoicee.set('orders', orders)
          }
          return invoicee
        })

        if (prevOrder) {
          if (prevOrder.get('adultCount') < order.get('adultCount')) {
            bucket = _increaseOrderIntoBucket(bucket, direction, mealId, 'adultCount')
          }

          if (prevOrder.get('adultCount') > order.get('adultCount')) {
            bucket = _setOrderIntoBucket(bucket, order, direction, mealId)
          }

          if (prevOrder.get('childCount') < order.get('childCount')) {
            bucket = _increaseOrderIntoBucket(bucket, direction, mealId, 'childCount')
          }

          if (prevOrder.get('childCount') > order.get('childCount')) {
            bucket = _setOrderIntoBucket(bucket, order, direction, mealId)
          }
        } else {
          bucket = _setOrderIntoBucket(bucket, order, direction, mealId)
        }

        store.dispatch(setOrderBucket({
          departureId, bookingId, bucket
        }))
        store.dispatch(setInvoiceeList({
          departureId, bookingId, invoiceeList
        }))
      }
    }
  }

  if (action.type === SET_ALLERGY_ORDER) {
    const { departureId, bookingId, direction, mealId, allergyId, allergyOrder } = action.payload

    let invoiceeList = state.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee']) || getMap({})

    if (invoiceeList.size > 1) {
      let bucket = state.modifiedData.getIn([departureId, 'orders', bookingId, 'bucket']) || getMap({})
      let order = bucket.getIn(['orders', direction, 'meal', mealId])
      order = order.setIn(['allergies', allergyId], allergyOrder)
      bucket = bucket.setIn(['orders', direction, 'meal', mealId], order)

      store.dispatch(setOrderBucket({
        departureId, bookingId, bucket
      }))
    }
  }

  if (action.type === TAKE_ALLERGY_ORDER) {
    const { mealType } = action.payload
    if (mealType === 'meal') {
      let { departureId, bookingId, direction, mealId, allergyId, allergyOrder } = action.payload

      let invoiceeList = state.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee']) || getMap({})

      if (invoiceeList.size > 1) {
        let bucket = state.modifiedData.getIn([departureId, 'orders', bookingId, 'bucket']) || getMap({})

        const prevOrders = getOrdersByBooking(prevState, departureId, bookingId)
        const prevOrder = prevOrders.getIn([direction, 'meal', mealId, 'allergies', allergyId])

        invoiceeList = invoiceeList.map(invoicee => {
          let orders = invoicee.get('orders') || getMap({})
          let dOrders = orders.get(direction) || getMap({})
          let mealOrders = dOrders.get('meal') || getMap({})
          let meal = mealOrders.get(mealId)
          if (meal && meal.size) {
            let allergyOrders = meal.get('allergies') || getMap({})
            let allergyMeal = allergyOrders.get(allergyId)

            if (allergyMeal && allergyMeal.size) {
              if (prevOrder.get('adultCount') > allergyOrder.get('adultCount')) {
                allergyMeal = allergyMeal.set('adultCount', 0)
              }

              if (prevOrder.get('childCount') > allergyOrder.get('childCount')) {
                allergyMeal = allergyMeal.set('childCount', 0)
              }
            }

            allergyOrders = allergyOrders.set(allergyId, allergyMeal)
            meal = meal.set('allergies', allergyOrders)

            mealOrders = mealOrders.set(mealId, meal)
            dOrders = dOrders.set('meal', mealOrders)
            orders = orders.set(direction, dOrders)
            invoicee = invoicee.set('orders', orders)
          }
          return invoicee
        })

        if (prevOrder) {
          if (prevOrder.get('adultCount') < allergyOrder.get('adultCount')) {
            bucket = _increaseAllergyOrderIntoBucket(bucket, direction, mealId, allergyId, 'adultCount')
          }

          if (prevOrder.get('adultCount') > allergyOrder.get('adultCount')) {
            bucket = _setAllergyOrderIntoBucket(bucket, allergyOrder, direction, mealId, allergyId)
          }

          if (prevOrder.get('childCount') < allergyOrder.get('childCount')) {
            bucket = _increaseAllergyOrderIntoBucket(bucket, direction, mealId, allergyId, 'childCount')
          }

          if (prevOrder.get('childCount') > allergyOrder.get('childCount')) {
            bucket = _setAllergyOrderIntoBucket(bucket, allergyOrder, direction, mealId, allergyId)
          }
        }

        // else {
        //   bucket = _setOrderIntoBucket(bucket, order, direction, mealId)
        // }

        store.dispatch(setOrderBucket({
          departureId, bookingId, bucket
        }))
        store.dispatch(setInvoiceeList({
          departureId, bookingId, invoiceeList
        }))
      }
    }
  }

  return result
}

export default addItemsToBucket
