
import config from '../utils/config'
import { getMap, getList, getSet } from '../utils/immutable'
import { getPax } from '../selectors'

export const restructureData = (modifiedData, allTrips, currentVersion) => {
  const caseName = findCaseName(currentVersion || '0.0.0', config.version)
  return restructurar(modifiedData, allTrips, caseName)
}

function findCaseName (from, to) {
  const fromV = from.split('.')[2]
  const toV = to.split('.')[2]
  return `_${fromV}-to-${toV}`
}

function restructurar (modifiedData, allTrips, caseName) {
  switch (caseName) {
    case '_0-to-5':
      return _0To5(modifiedData, allTrips)
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

function formatMeal0To5 (meal) {
  return meal.reduce((map, m, key) => {
    const mealId = key
    let newM = map.get('mealId') || getMap({ mealId, adultCount: 0, childCount: 0 })
    const adultCount = newM.get('adultCount')
    const childCount = newM.get('childCount')
    if (m.get('isChild')) newM = newM.set('childCount', childCount + 1)
    if (!m.get('isChild')) newM = newM.set('adultCount', adultCount + 1)
    map = map.set(mealId, newM)
    return map
  }, getMap({}))
}

function findBookingIdWithPaxId (paxId, trip) {
  const pax = getPax(trip)
  const p = pax.find(p => String(p.get('id')) === paxId)
  return String(p.get('booking').get('id'))
}

function _0To5 (modifiedData, allTrips) {
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
            const bookingId = findBookingIdWithPaxId(paxId, trip)
            let bExcursion = map.get(bookingId) || getSet([])
            bExcursion = bExcursion.add(paxId)
            map = map.set(bookingId, bExcursion)
            return map
          }, getMap({}))
          map = map.set(excursionId, formattedExPars)
          return map
        }, getMap({}))
        newTripOrder = newTripOrder.set('participants', participants)
      }

      if (tripOrder.get('ordersSummaryMode')) {
        let ordersSummaryMode = tripOrder.get('ordersSummaryMode')
        ordersSummaryMode = ordersSummaryMode.map(order => {
          let newOrder = order
          let out = order.get('out')
          let outMeal = out.get('meal')
          outMeal = formatMeal0To5(outMeal)
          out = out.set('meal', outMeal)
          newOrder = newOrder.set('out', out)

          let home = order.get('home')
          let homeMeal = home.get('meal')
          homeMeal = formatMeal0To5(homeMeal)
          home = home.set('meal', homeMeal)
          newOrder = newOrder.set('home', home)
          return newOrder
        })
        newTripOrder = newTripOrder.set('ordersSummaryMode', ordersSummaryMode)
      }

      map = map.set(departureId, newTripOrder)
    }
    map = map.set('structureVersion', config.version)
    return map
  }, getMap({}))
}
