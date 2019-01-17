
const fs = require('fs')
const DateFns = require('date-fns')

const { isAfter } = DateFns

fs.readFile('./testFile.json', 'utf8', (err, data) => {
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
    return trip
  })

  // const json = JSON.stringify(trips)

  // fs.writeFile('./HugeGuideFile.json', json, 'utf8', (err) => {
  //   if (!err) console.log('success')
  // })
})
