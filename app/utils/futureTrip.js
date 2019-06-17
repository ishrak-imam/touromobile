
import { isWithinRange, differenceInCalendarDays } from 'date-fns'
import { getImmutableObject, isMap, getMap } from './immutable'

const LOCK_TRIP_BEFORE = 10

const DEFAULT_HOTELS = {
  bus: 'Segevång',
  flight: 'Malmö Arena'
}

const KEY_NAMES = {
  LOCATION: 'location',
  ACCOMMODATION: 'accommodation',
  BAG: 'bag',
  TRANSFER: 'transfer',
  TRANSFER_CITY: 'transferCity'
}

const TRANSFER_OPTIONS = {
  NT: { key: 'NT', value: 'Ingen anslutning' },
  D: { key: 'D', value: 'Direkt' },
  O: { key: 'O', value: 'Övernattning' }
}

const BAG_OPTIONS = {
  H: { key: 'H', value: 'Övernattningshotell Malmö' },
  OT: { key: 'OT', value: 'Öresundsterminalen' },
  O: { key: 'O', value: 'Kontoret' },
  M: { key: 'M', value: 'Post' },
  ET: { key: 'ET', value: 'Utbildningsresa (ingen väska)' }
}

const ACCOMMODATION_OPTIONS = {
  NA: { key: 'NA', value: 'Ingen övernattning' },
  SR: { key: 'SR', value: 'Enkelrum' },
  DR: { key: 'DR', value: 'Del i dubbelrum' }
}

const LOCATION_OPTIONS = {
  OT: { key: 'OT', value: 'Öresundsterminalen' },
  BMA: { key: 'BMA', value: 'BMA, Bromma' },
  ARN: { key: 'ARN', value: 'ARN, Arlanda' },
  CPH: { key: 'CPH', value: 'CPH, Köpenhamn' },
  GOT: { key: 'GOT', value: 'GOT, Landvetter' },
  OSL: { key: 'OSL', value: 'OSL, Gardermoen' }
}

const LOCATIONS = {
  out: { label: 'boardingLoc', key: KEY_NAMES.LOCATION, direction: 'out' },
  home: { label: 'alightingLoc', key: KEY_NAMES.LOCATION, direction: 'home' },

  flight: [
    LOCATION_OPTIONS.BMA,
    LOCATION_OPTIONS.ARN,
    LOCATION_OPTIONS.CPH,
    LOCATION_OPTIONS.GOT,
    LOCATION_OPTIONS.OSL
  ],

  bus: [
    LOCATION_OPTIONS.OT
  ]

}

const TRANSFERS = {
  out: { label: 'transfer', key: KEY_NAMES.TRANSFER, direction: 'out' },
  home: { label: 'transfer', key: KEY_NAMES.TRANSFER, direction: 'home' },
  flight: Object.values(TRANSFER_OPTIONS),
  bus: Object.values(TRANSFER_OPTIONS)
}

const TRANSFER_CITY = {
  out: { label: 'transferCity', key: KEY_NAMES.TRANSFER_CITY, direction: 'out' },
  home: { label: 'transferCity', key: KEY_NAMES.TRANSFER_CITY, direction: 'home' }
}

const ACCOMMODATIONS = {
  out: { label: 'accommodation', key: KEY_NAMES.ACCOMMODATION, direction: 'out' },
  home: { label: 'accommodation', key: KEY_NAMES.ACCOMMODATION, direction: 'home' },
  flight: Object.values(ACCOMMODATION_OPTIONS),
  bus: Object.values(ACCOMMODATION_OPTIONS)
}

const BAG = {
  out: { label: 'bagPick', key: KEY_NAMES.BAG, direction: 'out' },
  home: { label: 'bagDrop', key: KEY_NAMES.BAG, direction: 'home' },

  flightout: Object.values(BAG_OPTIONS),
  flighthome: Object.values(BAG_OPTIONS),

  busout: [
    BAG_OPTIONS.H,
    BAG_OPTIONS.OT,
    BAG_OPTIONS.O,
    BAG_OPTIONS.ET
  ],

  bushome: [
    BAG_OPTIONS.OT
  ]
}

export const getLocations = basedOn => {
  let { direction, transportType, selected, locked } = basedOn

  selected = isMap(selected) ? selected : getMap({ key: selected, value: getLocationValue(selected) })

  if (locked) {
    return {
      disabled: true,
      selected,
      config: null,
      items: null
    }
  }

  return {
    selected,
    config: LOCATIONS[direction],
    items: LOCATIONS[transportType],
    direction
  }
}

export const getTransfers = basedOn => {
  let { direction, transportType, selected, locked } = basedOn

  selected = isMap(selected) ? selected : getMap({ key: selected, value: getTransferValue(selected) })

  if (locked) {
    return {
      disabled: true,
      selected,
      config: null,
      items: null
    }
  }

  return {
    selected,
    config: TRANSFERS[direction],
    items: TRANSFERS[transportType],
    direction
  }
}

export const getTransferCities = basedOn => {
  let { connections, direction, transportType, transfer, selected, locked } = basedOn

  if (transfer) {
    selected = isMap(selected)
      ? selected
      : getMap({ key: String(selected), value: getTransferCityValue(selected, connections, transfer.get('key')) })
  }

  if (locked) {
    return {
      disabled: true,
      selected,
      config: null,
      items: null
    }
  }

  if (transfer && transfer.get('key') === TRANSFER_OPTIONS.NT.key) {
    return {
      disabled: true,
      selected: null,
      config: null,
      items: null
    }
  }

  const date = new Date()
  const year = date.getFullYear()
  const xMas = new Date(year, 10, 25)
  const newYear = new Date(year + 1, 0, 1)
  const isWinter = isWithinRange(date, xMas, newYear)

  const isDirect = transfer ? transfer.get('key') === TRANSFER_OPTIONS.D.key : false
  const isOvernight = transfer ? transfer.get('key') === TRANSFER_OPTIONS.O.key : false

  const config = TRANSFER_CITY[direction]
  let items = null

  switch (transportType) {
    case 'bus':
      if (isDirect && isWinter) items = connections.get('directWinter')
      if (isDirect && !isWinter) items = connections.get('direct')
      if (isOvernight) items = connections.get('overnight')
      break
    case 'flight':
      if (isDirect) items = connections.get('direct')
      if (isOvernight) items = connections.get('overnight')
      break
  }

  return {
    selected,
    config,
    items,
    direction
  }
}

export const getAccommodations = basedOn => {
  let { direction, transportType, selected, locked } = basedOn

  selected = isMap(selected) ? selected : getMap({ key: selected, value: getAccommodationValue(selected) })

  if (locked) {
    return {
      disabled: true,
      selected,
      config: null,
      items: null
    }
  }

  return {
    selected,
    config: ACCOMMODATIONS[direction],
    items: ACCOMMODATIONS[transportType],
    direction
  }
}

export const getBagLocations = basedOn => {
  let { direction, transportType, selected, other, locked } = basedOn

  selected = isMap(selected) ? selected : getMap({ key: selected, value: getBagValue(selected) })

  if (locked) {
    return {
      disabled: true,
      selected,
      config: null,
      items: null
    }
  }

  if (other && other.get('key') === BAG_OPTIONS.ET.key) {
    return {
      disabled: true,
      selected: null,
      config: null,
      items: null
    }
  }

  return {
    selected,
    config: BAG[direction],
    items: BAG[`${transportType}${direction}`],
    direction
  }
}

export const getKeyNames = () => {
  return KEY_NAMES
}

export const getTransferOptions = () => {
  return TRANSFER_OPTIONS
}

export const getAccommodationOptions = () => {
  return ACCOMMODATION_OPTIONS
}

export const getBagOptions = () => {
  return BAG_OPTIONS
}

export const getDefaultValues = (accept, transportType) => {
  let out = null
  let home = null

  switch (transportType) {
    case 'bus':
      out = accept.get('out') || getImmutableObject({
        [KEY_NAMES.LOCATION]: LOCATION_OPTIONS.OT,
        [KEY_NAMES.TRANSFER]: TRANSFER_OPTIONS.NT,
        [KEY_NAMES.TRANSFER_CITY]: { key: null, value: null },
        [KEY_NAMES.ACCOMMODATION]: ACCOMMODATION_OPTIONS.NA,
        [KEY_NAMES.BAG]: BAG_OPTIONS.OT
      })
      home = accept.get('home') || getImmutableObject({
        [KEY_NAMES.LOCATION]: LOCATION_OPTIONS.OT,
        [KEY_NAMES.TRANSFER]: TRANSFER_OPTIONS.NT,
        [KEY_NAMES.TRANSFER_CITY]: { key: null, value: null },
        [KEY_NAMES.ACCOMMODATION]: ACCOMMODATION_OPTIONS.NA,
        [KEY_NAMES.BAG]: BAG_OPTIONS.OT
      })
      break

    case 'flight':
      out = accept.get('out') || getImmutableObject({
        [KEY_NAMES.LOCATION]: LOCATION_OPTIONS.BMA,
        [KEY_NAMES.TRANSFER]: TRANSFER_OPTIONS.NT,
        [KEY_NAMES.TRANSFER_CITY]: { key: null, value: null },
        [KEY_NAMES.ACCOMMODATION]: ACCOMMODATION_OPTIONS.NA,
        [KEY_NAMES.BAG]: BAG_OPTIONS.OT
      })
      home = accept.get('home') || getImmutableObject({
        [KEY_NAMES.LOCATION]: LOCATION_OPTIONS.BMA,
        [KEY_NAMES.TRANSFER]: TRANSFER_OPTIONS.NT,
        [KEY_NAMES.TRANSFER_CITY]: { key: null, value: null },
        [KEY_NAMES.ACCOMMODATION]: ACCOMMODATION_OPTIONS.NA,
        [KEY_NAMES.BAG]: BAG_OPTIONS.OT
      })
      break
  }

  return {
    out, home
  }
}

export const shouldLockTrip = outDate => {
  const date = new Date()
  const diff = differenceInCalendarDays(outDate, date)
  return diff <= LOCK_TRIP_BEFORE
}

export const getDefaultHotel = transportType => {
  return DEFAULT_HOTELS[transportType]
}

export const getLocationValue = key => {
  if (!key) return null
  return LOCATION_OPTIONS[key].value
}

export const getTransferValue = key => {
  if (!key) return null
  return TRANSFER_OPTIONS[key].value
}

export const getTransferCityValue = (key, connections, transfer) => {
  if (!key) return null
  const TRANSFER_VALUES = {
    D: 'direct',
    O: 'overnight'
  }

  const cities = connections.get(TRANSFER_VALUES[transfer])
  const city = cities.find(c => String(c.get('key')) === String(key))
  return city.get('value')
}

export const getAccommodationValue = key => {
  if (!key) return null
  return ACCOMMODATION_OPTIONS[key].value
}

export const getBagValue = key => {
  if (!key) return null
  return BAG_OPTIONS[key].value
}
