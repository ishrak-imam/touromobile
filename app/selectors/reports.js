
import { getPax, getParticipatingPax, getActualParticipatingPax } from './trip'
import { getMap } from '../utils/immutable'

export const getReports = state => state.reports

/**
 * TODO:
 * see if possible to add caching
 */
export const getStatsData = (excursions, participants, trip) => {
  const pax = getPax(trip)
  const transportId = String(trip.get('transportId'))
  const excursionPaxCounts = excursions.reduce((m, e) => {
    const excursionId = e.get('id')
    const participatingPax = getParticipatingPax(getMap({ pax, participants: participants.get(String(excursionId)) }))
    const { adults, children } = participatingPax.reduce((map, pax) => {
      if (pax.get('adult')) map.adults += 1
      if (!pax.get('adult')) map.children += 1
      return map
    }, { adults: 0, children: 0 })
    m.push({ id: excursionId, adults, children })
    return m
  }, [])

  return {
    transportId,
    excursions: excursionPaxCounts,
    totalPassengers: pax.size
  }
}

export const getOrderStats = (orders, transportId, orderMode) => {
  return orders.reduce((list, bOrders, key) => {
    const aggregated = {
      transportId,
      booking: key,
      invoicee: ''
    }

    let details = {}
    if (orderMode === 'SUMMARY') {
      if (key === 'invoicee') aggregated.invoicee = bOrders.get('key')
      else {
        const out = bOrders.get('out')
        if (out && out.size > 0) {
          const meals = out.get('meal')
          if (meals && meals.size > 0) {
            meals.every((meal, mealId) => {
              details[mealId] = {
                meal: mealId,
                adultCount: !meal.get('isChild') ? meal.get('count') : 0,
                childCount: meal.get('isChild') ? meal.get('count') : 0
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
              details[mealId] = {
                meal: mealId,
                adultCount: !meal.get('isChild') ? meal.get('count') : 0,
                childCount: meal.get('isChild') ? meal.get('count') : 0
              }
              return true
            })
          }
        }
      }
    }

    if (orderMode === 'INDIVIDUAL') {
      details = bOrders.reduce((map, pOrders, key) => {
        if (key === 'invoicee') aggregated.invoicee = pOrders
        else {
          const out = pOrders.get('out')
          if (out && out.size > 0) {
            const isAdult = out.get('adult')
            const mealId = String(out.get('meal'))
            if (mealId !== 'null') {
              const item = map[mealId] || { meal: mealId, adultCount: 0, childCount: 0 }
              if (isAdult) item.adultCount = item.adultCount + 1
              if (!isAdult) item.childCount = item.childCount + 1
              map[mealId] = item
            }
          }

          const home = pOrders.get('home')
          if (home && home.size > 0) {
            const isAdult = home.get('adult')
            const mealId = String(home.get('meal'))
            if (mealId !== 'null') {
              const item = map[mealId] || { meal: mealId, adultCount: 0, childCount: 0 }
              if (isAdult) item.adultCount = item.adultCount + 1
              if (!isAdult) item.childCount = item.childCount + 1
              map[mealId] = item
            }
          }
        }
        return map
      }, {})
    }

    aggregated.details = Object.values(details)
    list.push(aggregated)
    return list
  }, [])
}

export const getTotalParticipantsCount = (excursions, participants, trip) => {
  const pax = getPax(trip)
  return excursions.reduce((aggr, e) => {
    const excursionId = String(e.get('id'))
    const participatingPax = getParticipatingPax(getMap({ pax, participants: participants.get(excursionId) }))
    aggr = aggr + participatingPax.size
    return aggr
  }, 0)
}

export const getActualTotalParticipantsCount = (excursions, participants, trip) => {
  const pax = getPax(trip)
  return excursions.reduce((aggr, e) => {
    const excursionId = String(e.get('id'))
    const participatingPax = getActualParticipatingPax(getMap({ pax, participants: participants.get(excursionId) }))
    aggr = aggr + participatingPax.size
    return aggr
  }, 0)
}
