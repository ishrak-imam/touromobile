
import { getPax, getParticipatingPax, getActualParticipatingPax } from './trip'
import { getMap, mergeMapShallow, getSet } from '../utils/immutable'

export const getReports = state => state.reports

/**
 * TODO:
 * see if possible to add caching
 */
export const getStatsData = (excursions, modifiedPax, participants, trip) => {
  const pax = getPax(trip)
  const transportId = String(trip.get('transportId'))
  const excursionPaxCounts = excursions.reduce((m, e) => {
    const excursionId = String(e.get('id'))
    let exParticipants = participants.get(excursionId) || getMap({})
    exParticipants = exParticipants.reduce((set, par) => {
      return set.merge(par)
    }, getSet([]))

    const participatingPax = getParticipatingPax(getMap({ pax, participants: exParticipants }))
    const { adultCount, childCount } = participatingPax.reduce((map, pax) => {
      const paxId = String(pax.get('id'))
      const mPax = mergeMapShallow(pax, modifiedPax.get(paxId))
      if (mPax.get('adult')) map.adultCount += 1
      if (!mPax.get('adult')) map.childCount += 1
      return map
    }, { adultCount: 0, childCount: 0 })
    m.push({ id: excursionId, adultCount, childCount })
    return m
  }, [])

  return {
    transportId,
    excursions: excursionPaxCounts,
    totalPassengers: pax.size
  }
}

export const prepareParticipantsData = (excursions, modifiedPax, participants, trip, bookingId) => {
  const pax = trip.get('bookings').find(b => String(b.get('id')) === bookingId).get('pax')
  return excursions.reduce((m, e) => {
    const excursionId = String(e.get('id'))
    let exParticipants = participants.get(excursionId) || getMap({})
    exParticipants = exParticipants.reduce((set, par, key) => {
      if (key === bookingId) set = set.merge(par)
      return set
    }, getSet([]))

    const participatingPax = getParticipatingPax(getMap({ pax, participants: exParticipants }))
    const { adultCount, childCount } = participatingPax.reduce((map, pax) => {
      const paxId = String(pax.get('id'))
      const mPax = mergeMapShallow(pax, modifiedPax.get(paxId))
      if (mPax.get('adult')) map.adultCount += 1
      if (!mPax.get('adult')) map.childCount += 1
      return map
    }, { adultCount: 0, childCount: 0 })
    m.push({ id: excursionId, adultCount, childCount })
    return m
  }, [])
}

export const prepareExtraData = (extraOrders, bookingId) => {
  const orders = extraOrders.get(bookingId) || getMap({})
  return orders.reduce((list, order) => {
    list.push({
      text: order.get('text'),
      amount: order.get('amount')
    })
    return list
  }, [])
}

export const getOrderStats = (orders, extraOrders, transportId, excursions, modifiedPax, participants, trip) => {
  if (orders.size) {
    return orders.reduce((list, bOrders, key) => {
      const aggregated = {
        transportId,
        booking: key,
        invoicee: {},
        excursions: prepareParticipantsData(excursions, modifiedPax, participants, trip, key),
        extra: prepareExtraData(extraOrders, key)
      }

      let details = {}
      const invoicee = bOrders.get('invoicee')
      // aggregated.invoicee = bOrders.getIn(['invoicee', 'key'])
      if (invoicee) {
        aggregated.invoicee = {
          address: invoicee.get('address'),
          city: invoicee.get('city'),
          zip: invoicee.get('zip'),
          ssn: invoicee.get('ssn'),
          name: invoicee.get('name'),
          id: invoicee.get('id')
        }
      }
      const out = bOrders.get('out')
      if (out && out.size > 0) {
        const meals = out.get('meal')
        if (meals && meals.size > 0) {
          meals.every((meal, mealId) => {
            const m = details[mealId]
            details[mealId] = {
              meal: mealId,
              adultCount: m ? m.adultCount + meal.get('adultCount') : meal.get('adultCount'),
              childCount: m ? m.childCount + meal.get('childCount') : meal.get('childCount')
            }

            /**
            * Allergy
            */
            if (meal.get('allergies')) {
              const allergies = meal.get('allergies')
              allergies.every(order => {
                const allergyMealId = String(order.get('mealId'))
                const m = details[allergyMealId]
                details[allergyMealId] = {
                  meal: allergyMealId,
                  adultCount: m ? m.adultCount + order.get('adultCount') : order.get('adultCount'),
                  childCount: m ? m.childCount + order.get('childCount') : order.get('childCount')
                }
              })
            }

            return true
          })
        }
      }
      const home = bOrders.get('home')
      if (home && home.size > 0) {
        const meals = home.get('meal')
        if (meals && meals.size > 0) {
          meals.every((meal, mealId) => {
            const m = details[mealId]
            details[mealId] = {
              meal: mealId,
              adultCount: m ? m.adultCount + meal.get('adultCount') : meal.get('adultCount'),
              childCount: m ? m.childCount + meal.get('childCount') : meal.get('childCount')
            }

            /**
            * Allergy
            */
            if (meal.get('allergies')) {
              const allergies = meal.get('allergies')
              allergies.every(order => {
                const allergyMealId = String(order.get('mealId'))
                const m = details[allergyMealId]
                details[allergyMealId] = {
                  meal: allergyMealId,
                  adultCount: m ? m.adultCount + order.get('adultCount') : order.get('adultCount'),
                  childCount: m ? m.childCount + order.get('childCount') : order.get('childCount')
                }
              })
            }

            return true
          })
        }
      }

      aggregated.details = Object.values(details)
      list.push(aggregated)
      return list
    }, [])
  }

  if (participants.size) {
    const exParticipants = participants.flatten(1)
    return exParticipants.reduce((list, _, key) => {
      const aggregated = {
        transportId,
        booking: key,
        invoicee: {},
        excursions: prepareParticipantsData(excursions, modifiedPax, participants, trip, key),
        extra: prepareExtraData(extraOrders, key)
      }

      aggregated.details = []
      list.push(aggregated)
      return list
    }, [])
  }

  if (extraOrders.size) {
    return extraOrders.reduce((list, bOrders, key) => {
      const aggregated = {
        transportId,
        booking: key,
        invoicee: {},
        excursions: prepareParticipantsData(excursions, modifiedPax, participants, trip, key),
        extra: prepareExtraData(extraOrders, key)
      }

      aggregated.details = []
      list.push(aggregated)
      return list
    }, [])
  }

  return []
}

export const getTotalParticipantsCount = (excursions, participants, trip) => {
  const pax = getPax(trip)
  return excursions.reduce((aggr, e) => {
    const excursionId = String(e.get('id'))
    let exParticipants = participants.get(excursionId) || getMap({})
    exParticipants = exParticipants.reduce((set, par) => {
      return set.merge(par)
    }, getSet([]))
    const participatingPax = getParticipatingPax(getMap({ pax, participants: exParticipants }))
    aggr = aggr + participatingPax.size
    return aggr
  }, 0)
}

export const getActualTotalParticipantsCount = (excursions, participants, trip) => {
  const pax = getPax(trip)
  return excursions.reduce((aggr, e) => {
    const excursionId = String(e.get('id'))
    let exParticipants = participants.get(excursionId) || getMap({})
    exParticipants = exParticipants.reduce((set, par) => {
      return set.merge(par)
    }, getSet([]))
    const participatingPax = getActualParticipatingPax(getMap({ pax, participants: exParticipants }))
    aggr = aggr + participatingPax.size
    return aggr
  }, 0)
}
