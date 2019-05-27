
import { getMap, listToMap, mergeMapShallow, getSet } from './immutable'

export const checkIfAllDistributed = bucket => {
  let isAllDistributed = true

  const orders = bucket.get('orders')
  if (orders && orders.size) {
    const outMeals = orders.getIn(['out', 'meal'])
    if (outMeals && outMeals.size) {
      outMeals.some(meal => {
        if (meal.get('adultCount') > 0 || meal.get('childCount') > 0) {
          isAllDistributed = false
          return true
        }
        return false
      })
    }

    const homeMeals = orders.getIn(['home', 'meal'])
    if (homeMeals && outMeals.size) {
      homeMeals.some(meal => {
        if (meal.get('adultCount') > 0 || meal.get('childCount') > 0) {
          isAllDistributed = false
          return true
        }
        return false
      })
    }
  }

  const extraOrders = bucket.get('extraOrders')
  if (extraOrders && extraOrders.size > 0) isAllDistributed = false

  const participants = bucket.get('participants')
  if (participants && participants.size) {
    participants.some(par => {
      if (par.getIn(['adult', 'count']) > 0 || par.getIn(['child', 'count']) > 0) {
        isAllDistributed = false
        return true
      }
      return false
    })
  }

  return isAllDistributed
}

export const flattenParticipants = (participants, excursions, booking, modifiedPax) => {
  let flattenedList = getMap({})
  if (participants) {
    const pax = listToMap(booking.get('pax'), 'id')
    excursions = listToMap(excursions, 'id')
    return participants.reduce((map, par, id) => {
      const excursion = excursions.get(id)
      if (par.size > 0) { // returns undefined due to this check, may revisit later
        const { adult, child } = getAdultChildFromParticipants(par, pax, modifiedPax)
        map = map.set(id, getMap({
          id,
          name: excursion.get('name'),
          adult,
          child
        }))
      } else { // that's why else block added
        map = map.set(id, getMap({
          id,
          name: excursion.get('name'),
          adult: getMap({ count: 0, pax: getSet([]) }),
          child: getMap({ count: 0, pax: getSet([]) })
        }))
      }
      return map
    }, flattenedList)
  }

  return flattenedList
}

const getAdultChildFromParticipants = (participants, pax, modifiedPax) => {
  return participants.reduce((map, par, paxId) => {
    const mPax = mergeMapShallow(pax.get(paxId), modifiedPax.get(paxId) || getMap({}))
    if (mPax.get('adult')) {
      let adult = map.adult
      adult = adult.set('count', adult.get('count') + 1)
      adult = adult.set('pax', adult.get('pax').add(paxId))
      map.adult = adult
    }
    if (!mPax.get('adult')) {
      let child = map.child
      child = child.set('count', child.get('count') + 1)
      child = child.set('pax', child.get('pax').add(paxId))
      map.child = child
    }
    return map
  }, { adult: getMap({ count: 0, pax: getSet([]) }), child: getMap({ count: 0, pax: getSet([]) }) })
}
