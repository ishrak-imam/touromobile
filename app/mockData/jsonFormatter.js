
const fs = require('fs')
const DateFns = require('date-fns')
const { isAfter } = DateFns

const meals = [
  {
    'id': 101,
    'name': 'Grilled chicken with tomato mash, pasta and cheese gravy',
    'adult': 125,
    'child': null
  },
  {
    'id': 102,
    'name': 'Cheese sallat, ham and bread',
    'adult': 115,
    'child': null
  },
  {
    'id': 103,
    'name': 'Pasta med tomato sauce, vegetables and cheese',
    'adult': 120,
    'child': null
  },
  {
    'id': 104,
    'name': 'Tuna sallat with egg and bread',
    'adult': 115,
    'child': null
  },
  {
    'id': 105,
    'name': '(Child) Pasta with tomato sauce',
    'adult': null,
    'child': 85
  },
  {
    'id': 106,
    'name': '(Child) Pasta with cheese sauce',
    'adult': null,
    'child': 85
  },
  {
    'id': 107,
    'name': '(Child) French fries with tomato ketchup and mayo',
    'adult': null,
    'child': 70
  }
]
const beverages = [
  { 'id': 201, 'name': 'Beer' },
  { 'id': 202, 'name': 'Wine' },
  { 'id': 203, 'name': 'Fanta' },
  { 'id': 204, 'name': 'Coke' },
  { 'id': 205, 'name': 'Sprite' },
  { 'id': 206, 'name': 'Water' }
]

fs.readFile('./trips.json', 'utf8', (err, data) => {
  if (err) throw err

  let trips = JSON.parse(data)

  trips = trips.map((trip, index) => {
    const outDate = trip.outDate
    const homeDate = trip.homeDate
    if (isAfter(outDate, homeDate)) {
      console.log(trip.departureId)
      trip.outDate = homeDate
      trip.homeDate = outDate
    }

    trip.lunches.out.meals = meals
    trip.lunches.out.beverages = beverages

    trip.lunches.home.meals = meals
    trip.lunches.home.beverages = beverages

    return trip
  })

  // const json = JSON.stringify(trips)

  // fs.writeFile('./trips.json', json, 'utf8', (err) => {
  //   if (!err) console.log('success')
  // })
})
