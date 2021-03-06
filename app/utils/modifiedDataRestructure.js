
import config from '../utils/config'
import { getMap, getList, getSet, isSet } from '../utils/immutable'
import { getPax } from '../selectors'

export const restructureData = (modifiedData, allTrips, currentVersion) => {
  const caseNames = findCaseNames(currentVersion || 0, config.structureVersion)
  let restructuredData = modifiedData
  caseNames.forEach(caseName => {
    restructuredData = restructure(restructuredData, allTrips, caseName)
  })
  return restructuredData
}

function findCaseNames (from, to) {
  let caseNames = []
  for (let i = from; i < to; i++) {
    let val = i
    caseNames.push(`_${val}-to-${++val}`)
  }
  return caseNames
}

function restructure (modifiedData, allTrips, caseName) {
  switch (caseName) {
    case '_5-to-6':
      return _5To6(modifiedData, allTrips)
    case '_6-to-7':
      return _6to7(modifiedData, allTrips)
    default:
      return modifiedData
  }
}

function findTrip (excursionId, allTrips) {
  return allTrips.find(trip => {
    const excursions = trip.get('excursions') || getList([])
    return excursions.some(ex => String(ex.get('id')) === excursionId)
  })
}

function formatMeal5To6 (meal) {
  return meal.reduce((map, m, key) => {
    const mealId = key
    const newM = getMap({
      mealId,
      adultCount: !m.get('isChild') ? m.get('count') : 0,
      childCount: m.get('isChild') ? m.get('count') : 0
    })
    map = map.set(mealId, newM)
    return map
  }, getMap({}))
}

function findBookingIdWithPaxId (paxId, trip) {
  const pax = getPax(trip)
  const p = pax.find(p => String(p.get('id')) === paxId)
  return String(p.get('booking').get('id'))
}

function _6to7 (modifiedData, allTrips) {
  if (modifiedData.size === 0) {
    return modifiedData.set('structureVersion', config.structureVersion)
  } else {
    return modifiedData.reduce((map, tripOrder, key) => {
      if (key === 'lastSyncedTime') map = map.set('lastSyncedTime', modifiedData.get('lastSyncedTime'))
      if (key === 'structureVersion') {

      } else {
        const departureId = key
        let newTripOrder = getMap({})

        if (tripOrder.get('modifiedPax')) newTripOrder = newTripOrder.set('modifiedPax', tripOrder.get('modifiedPax'))
        if (tripOrder.get('isLoading')) newTripOrder = newTripOrder.set('isLoading', tripOrder.get('isLoading'))
        if (tripOrder.get('statsUploadedAt')) newTripOrder = newTripOrder.set('statsUploadedAt', tripOrder.get('statsUploadedAt'))
        if (tripOrder.get('accept')) newTripOrder = newTripOrder.set('accept', tripOrder.get('accept'))
        if (tripOrder.get('prevAccept')) newTripOrder = newTripOrder.set('prevAccept', tripOrder.get('prevAccept'))
        if (tripOrder.get('participants')) newTripOrder = newTripOrder.set('participants', tripOrder.get('participants'))
        if (tripOrder.get('ordersSummaryMode')) newTripOrder = newTripOrder.set('orders', tripOrder.get('ordersSummaryMode'))

        map = map.set(departureId, newTripOrder)
      }
      map = map.set('structureVersion', config.structureVersion)
      return map
    }, getMap({}))
  }
}

function _5To6 (modifiedData, allTrips) {
  if (modifiedData.size === 0) {
    return modifiedData.set('structureVersion', config.structureVersion)
  } else {
    return modifiedData.reduce((map, tripOrder, key) => {
      if (key === 'lastSyncedTime') map = map.set('lastSyncedTime', modifiedData.get('lastSyncedTime'))
      else {
        const departureId = key
        let newTripOrder = getMap({})

        if (tripOrder.get('modifiedPax')) newTripOrder = newTripOrder.set('modifiedPax', tripOrder.get('modifiedPax'))
        if (tripOrder.get('isLoading')) newTripOrder = newTripOrder.set('isLoading', tripOrder.get('isLoading'))
        if (tripOrder.get('statsUploadedAt')) newTripOrder = newTripOrder.set('statsUploadedAt', tripOrder.get('statsUploadedAt'))
        if (tripOrder.get('accept')) newTripOrder = newTripOrder.set('accept', tripOrder.get('accept'))
        if (tripOrder.get('prevAccept')) newTripOrder = newTripOrder.set('prevAccept', tripOrder.get('prevAccept'))

        if (tripOrder.get('participants')) {
          let participants = tripOrder.get('participants')
          participants = participants.reduce((map, exPars, key) => {
            const excursionId = key
            const trip = findTrip(excursionId, allTrips)
            const formattedExPars = exPars.reduce((map, paxId, key) => {
              if (isSet(paxId)) {
                map = map.set(key, paxId)
              } else {
                const bookingId = findBookingIdWithPaxId(paxId, trip)
                let bExcursion = map.get(bookingId) || getSet([])
                bExcursion = bExcursion.add(paxId)
                map = map.set(bookingId, bExcursion)
              }
              return map
            }, getMap({}))

            map = map.set(excursionId, formattedExPars)
            return map
          }, getMap({}))
          newTripOrder = newTripOrder.set('participants', participants)
        }

        if (tripOrder.get('orders')) {
          let orders = tripOrder.get('orders')
          orders = orders.map(order => {
            let newOrder = order
            if (order.get('out')) {
              let out = order.get('out')
              let outMeal = out.get('meal')
              outMeal = formatMeal5To6(outMeal)
              out = out.set('meal', outMeal)
              newOrder = newOrder.set('out', out)
            }

            if (order.get('home')) {
              let home = order.get('home')
              let homeMeal = home.get('meal')
              homeMeal = formatMeal5To6(homeMeal)
              home = home.set('meal', homeMeal)
              newOrder = newOrder.set('home', home)
            }
            return newOrder
          })
          newTripOrder = newTripOrder.set('orders', orders)
        }

        map = map.set(departureId, newTripOrder)
      }
      map = map.set('structureVersion', config.structureVersion)
      return map
    }, getMap({}))
  }
}
