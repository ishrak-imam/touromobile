
import { getMap, listToMap, mergeMapShallow, getSet } from './immutable'

// export const checkIfAllDistributed = (bucket, invoiceeList) => {
//   const distributed = invoiceeList.reduce((map, invoicee, paxId) => {
//     const extraOrders = invoicee.get('extraOrders')
//     if (extraOrders && extraOrders.size) {
//       map = map.mergeIn(['extraOrders'], extraOrders)
//     }

//     const participants = invoicee.get('participants')
//     if (participants && participants.size) {
//       participants.every((par, excursionId) => {
//         if (par.get('adultCount') !== 0 || par.get('childCount') !== 0) {
//           let exPar = map.getIn(['participants', excursionId])
//           if (!exPar) exPar = par
//           else {
//             exPar = exPar.set('adultCount', exPar.get('adultCount') + par.get('adultCount'))
//             exPar = exPar.set('childCount', exPar.get('childCount') + par.get('childCount'))
//           }
//           map = map.setIn(['participants', excursionId], exPar)
//         }
//         return true
//       })
//     }

//     const orders = invoicee.get('orders')
//     if (orders && orders.size) {
//       const outMeals = orders.get('out')
//       if (outMeals && outMeals.size) {
//         const meals = outMeals.get('meal')
//         meals.every((meal, mealId) => {
//           let bMeal = map.getIn(['orders', 'out', 'meal', mealId]) || getMap({ mealId, adultCount: 0, childCount: 0 })
//           bMeal = bMeal.set('adultCount', bMeal.get('adultCount') + meal.get('adultCount'))
//             .set('childCount', bMeal.get('childCount') + meal.get('childCount'))
//           const allergyMeals = meal.get('allergies')
//           if (allergyMeals && allergyMeals.size) {
//             allergyMeals.every((aMeal, aMealId) => {
//               let baMeal = bMeal.getIn(['allergies', aMealId]) || getMap({
//                 adult: aMeal.get('adult'),
//                 adultCount: 0,
//                 allergyId: aMealId,
//                 allergyText: aMeal.get('allergyText'),
//                 child: aMeal.get('child'),
//                 childCount: 0,
//                 mealId: aMeal.get('mealId')
//               })
//               baMeal = baMeal.set('adultCount', baMeal.get('adultCount') + aMeal.get('adultCount'))
//                 .set('childCount', baMeal.get('childCount') + aMeal.get('childCount'))
//               bMeal = bMeal.setIn(['allergies', aMealId], baMeal)
//               return true
//             })
//           }
//           map = map.setIn(['orders', 'out', 'meal', mealId], bMeal)
//           return true
//         })
//       }

//       const homeMeals = orders.get('home')
//       if (homeMeals && homeMeals.size) {
//         const meals = homeMeals.get('meal')
//         meals.every((meal, mealId) => {
//           let bMeal = map.getIn(['orders', 'home', 'meal', mealId]) || getMap({ mealId, adultCount: 0, childCount: 0 })
//           bMeal = bMeal.set('adultCount', bMeal.get('adultCount') + meal.get('adultCount'))
//             .set('childCount', bMeal.get('childCount') + meal.get('childCount'))
//           const allergyMeals = meal.get('allergies')
//           if (allergyMeals && allergyMeals.size) {
//             allergyMeals.every((aMeal, aMealId) => {
//               let baMeal = bMeal.getIn(['allergies', aMealId]) || getMap({
//                 adult: aMeal.get('adult'),
//                 adultCount: 0,
//                 allergyId: aMealId,
//                 allergyText: aMeal.get('allergyText'),
//                 child: aMeal.get('child'),
//                 childCount: 0,
//                 mealId: aMeal.get('mealId')
//               })
//               baMeal = baMeal.set('adultCount', baMeal.get('adultCount') + aMeal.get('adultCount'))
//                 .set('childCount', baMeal.get('childCount') + aMeal.get('childCount'))
//               bMeal = bMeal.setIn(['allergies', aMealId], baMeal)
//               return true
//             })
//           }
//           map = map.setIn(['orders', 'home', 'meal', mealId], bMeal)
//           return true
//         })
//       }
//     }

//     return map
//   }, getMap({
//     participants: getMap({}),
//     orders: getMap({
//       out: getMap({ meal: getMap({}) }),
//       home: getMap({ meal: getMap({}) })
//     }),
//     extraOrders: getMap({})
//   }))

//   return distributed.equals(bucket)
// }

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
