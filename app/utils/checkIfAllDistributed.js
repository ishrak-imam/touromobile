
import { getMap } from './immutable'

export const checkIfAllDistributed = (bucket, invoiceeList) => {
  const distributed = invoiceeList.reduce((map, invoicee, paxId) => {
    const extraOrders = invoicee.get('extraOrders')
    if (extraOrders && extraOrders.size) {
      map = map.mergeIn(['extraOrders'], extraOrders)
    }

    const participants = invoicee.get('participants')
    if (participants && participants.size) {
      participants.every((par, excursionId) => {
        let exPar = map.getIn(['participants', excursionId])
        if (!exPar) exPar = par
        else {
          exPar = exPar.set('count', exPar.get('count') + par.get('count'))
        }
        map = map.setIn(['participants', excursionId], exPar)
        return true
      })
    }

    const orders = invoicee.get('orders')
    if (orders && orders.size) {
      const outMeals = orders.get('out')
      if (outMeals && outMeals.size) {
        const meals = outMeals.get('meal')
        meals.every((meal, mealId) => {
          let bMeal = map.getIn(['orders', 'out', 'meal', mealId]) || getMap({ mealId, adultCount: 0, childCount: 0 })
          bMeal = bMeal.set('adultCount', bMeal.get('adultCount') + meal.get('adultCount'))
            .set('childCount', bMeal.get('childCount') + meal.get('childCount'))
          const allergyMeals = meal.get('allergies')
          if (allergyMeals && allergyMeals.size) {
            allergyMeals.every((aMeal, aMealId) => {
              let baMeal = bMeal.getIn(['allergies', aMealId]) || getMap({
                adult: aMeal.get('adult'),
                adultCount: 0,
                allergyId: aMealId,
                allergyText: aMeal.get('allergyText'),
                child: aMeal.get('child'),
                childCount: 0,
                mealId: aMeal.get('mealId')
              })
              baMeal = baMeal.set('adultCount', baMeal.get('adultCount') + aMeal.get('adultCount'))
                .set('childCount', baMeal.get('childCount') + aMeal.get('childCount'))
              bMeal = bMeal.setIn(['allergies', aMealId], baMeal)
              return true
            })
          }
          map = map.setIn(['orders', 'out', 'meal', mealId], bMeal)
          return true
        })
      }

      const homeMeals = orders.get('home')
      if (homeMeals && homeMeals.size) {
        const meals = homeMeals.get('meal')
        meals.every((meal, mealId) => {
          let bMeal = map.getIn(['orders', 'home', 'meal', mealId]) || getMap({ mealId, adultCount: 0, childCount: 0 })
          bMeal = bMeal.set('adultCount', bMeal.get('adultCount') + meal.get('adultCount'))
            .set('childCount', bMeal.get('childCount') + meal.get('childCount'))
          const allergyMeals = meal.get('allergies')
          if (allergyMeals && allergyMeals.size) {
            allergyMeals.every((aMeal, aMealId) => {
              let baMeal = bMeal.getIn(['allergies', aMealId]) || getMap({
                adult: aMeal.get('adult'),
                adultCount: 0,
                allergyId: aMealId,
                allergyText: aMeal.get('allergyText'),
                child: aMeal.get('child'),
                childCount: 0,
                mealId: aMeal.get('mealId')
              })
              baMeal = baMeal.set('adultCount', baMeal.get('adultCount') + aMeal.get('adultCount'))
                .set('childCount', baMeal.get('childCount') + aMeal.get('childCount'))
              bMeal = bMeal.setIn(['allergies', aMealId], baMeal)
              return true
            })
          }
          map = map.setIn(['orders', 'home', 'meal', mealId], bMeal)
          return true
        })
      }
    }

    return map
  }, getMap({
    participants: getMap({}),
    orders: getMap({
      out: getMap({ meal: getMap({}) }),
      home: getMap({ meal: getMap({}) })
    }),
    extraOrders: getMap({})
  }))

  return distributed.equals(bucket)
}
