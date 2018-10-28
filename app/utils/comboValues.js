
const LOCATIONS = {

  out: { key: 'boardingLoc', value: 'Boarding location' },
  home: { key: 'alightingLoc', value: 'Alighting location' },

  flight: [
    { key: 'BMA', value: 'BMA, Bromma' },
    { key: 'ARN', value: 'ARN, Arlanda' },
    { key: 'CPH', value: 'CPH, Köpenhamn' },
    { key: 'GOT', value: 'GOT, Landvetter' },
    { key: 'OSL', value: 'OSL, Gardermoen' }
  ],

  bus: [
    { key: 'ÖT', value: 'ÖT' }
  ]
}

const ACCOMODATIONS = {

  out: { key: 'outAcc', value: 'Accomodation' },
  home: { key: 'homeAcc', value: 'Accomodation' },

  flight: [
    { key: '1', value: 'No accomodation' },
    { key: '2', value: 'Single room' },
    { key: '3', value: 'Part in double room' }
  ],

  bus: [
    { key: '1', value: 'No accomodation' },
    { key: '2', value: 'Single room' },
    { key: '3', value: 'Part in double room' }
  ]
}

const BAG = {

  out: { key: 'bagPick', value: 'Bag pickup' },
  home: { key: 'homeAcc', value: 'Bag dropoff' },

  flight: [
    { key: '1', value: 'Overnight hotel Malmö' },
    { key: '2', value: 'Öresundsterminalen' },
    { key: '3', value: 'Office' },
    { key: '4', value: 'Mail' },
    { key: '5', value: 'Education Trip (no bag)' }
  ],

  bus: [
    { key: '1', value: 'Overnight hotel Malmö' },
    { key: '2', value: 'Öresundsterminalen' },
    { key: '3', value: 'Office' },
    { key: '4', value: 'Mail' },
    { key: '5', value: 'Education Trip (no bag)' }
  ]
}

export const getLocations = (direction, transport) => {
  return {
    config: LOCATIONS[direction],
    items: LOCATIONS[transport]
  }
}

export const getAccomodations = (direction, transport) => {
  return {
    config: ACCOMODATIONS[direction],
    items: ACCOMODATIONS[transport]
  }
}

export const getBagLocations = (direction, transport) => {
  return {
    config: BAG[direction],
    items: BAG[transport]
  }
}
