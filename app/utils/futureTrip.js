
import { isWithinRange, differenceInCalendarDays } from 'date-fns'
import { getImmutableObject } from './immutable'

const LOCK_TRIP_BEFORE = 10

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
  HOTEL: { key: 'H', value: 'Övernattningshotell Malmö' },
  OT: { key: 'OT', value: 'Öresundsterminalen' },
  OFFICE: { key: 'O', value: 'Kontoret' },
  MAIL: { key: 'M', value: 'Post' },
  EDTRIP: { key: 'ET', value: 'Utbildningsresa (ingen väska)' }
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

  flight: Object.values(BAG_OPTIONS),

  bus: [
    BAG_OPTIONS.HOTEL,
    BAG_OPTIONS.OT,
    BAG_OPTIONS.OFFICE,
    BAG_OPTIONS.EDTRIP
  ]
}

export const getLocations = basedOn => {
  const { direction, transportType, selected, locked } = basedOn

  if (locked) {
    return {
      disabled: true,
      selected: selected,
      config: null,
      items: null
    }
  }

  return {
    selected,
    config: LOCATIONS[direction],
    items: LOCATIONS[transportType]
  }
}

export const getTransfers = basedOn => {
  const { direction, transportType, selected, locked } = basedOn

  if (locked) {
    return {
      disabled: true,
      selected: selected,
      config: null,
      items: null
    }
  }

  return {
    selected,
    config: TRANSFERS[direction],
    items: TRANSFERS[transportType]
  }
}

export const getTransferCities = basedOn => {
  const { connections, direction, transportType, transfer, selected, locked } = basedOn

  if (locked) {
    return {
      disabled: true,
      selected: selected,
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
    items
  }
}

export const getAccommodations = basedOn => {
  const { direction, transportType, selected, locked } = basedOn

  if (locked) {
    return {
      disabled: true,
      selected: selected,
      config: null,
      items: null
    }
  }

  return {
    selected,
    config: ACCOMMODATIONS[direction],
    items: ACCOMMODATIONS[transportType]
  }
}

export const getBagLocations = basedOn => {
  const { direction, transportType, selected, other, locked } = basedOn

  if (locked) {
    return {
      disabled: true,
      selected: selected,
      config: null,
      items: null
    }
  }

  if (other && other.get('key') === BAG_OPTIONS.EDTRIP.key) {
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
    items: BAG[transportType]
  }
}

export const getKeyNames = () => {
  return KEY_NAMES
}

export const getTransferOptions = () => {
  return TRANSFER_OPTIONS
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
