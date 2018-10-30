
import { isWithinRange } from 'date-fns'

const KEY_NAMES = {
  LOCATION: 'location',
  ACCOMODATION: 'accomodation',
  BAG: 'bag',
  TRANSFER: 'transfer',
  TRANSFER_CITY: 'transferCity'
}

const HotelConnection = [

  { key: 'HC-1', value: 'Arboga/Resecentrum' },
  { key: 'HC-2', value: 'Bollebygd/Circle K' },
  { key: 'HC-3', value: 'Borås/Järnvägsstationen' },
  { key: 'HC-4', value: 'Enköping/Gustaf Adolfsplan' },
  { key: 'HC-5', value: 'Eskilstuna/Bussterminalen (Kyrkogatan)' },
  { key: 'HC-6', value: 'Falkenberg/Mc Donalds (Vinbergsmotet E6:an)' },
  { key: 'HC-7', value: 'Falköping/Mc Donalds (väg 46/47)' },
  { key: 'HC-8', value: 'Flen/Busstationen' },
  { key: 'HC-9', value: 'Gränna/Circle K, Galgen' },
  { key: 'HC-10', value: 'Göteborg/Nils Ericsonterminalen (se monitor för gate)' },
  { key: 'HC-11', value: 'Hallstahammar/Busstationen' },
  { key: 'HC-12', value: 'Halmstad/Circle K, Eurostop' },
  { key: 'HC-13', value: 'Helsingborg/Knutpunkten (se monitor för gate)' },
  { key: 'HC-14', value: 'Huskvarna/Rosen Swedbank' },
  { key: 'HC-15', value: 'Jönköping/M2 center (fd. Eurostop)' },
  { key: 'HC-16', value: 'Karlstad/Busstationen' },
  { key: 'HC-17', value: 'Katrineholm/Resecentrum' },
  { key: 'HC-18', value: 'Kumla/Busstationen' },
  { key: 'HC-19', value: 'Kungsbacka/Circle K, Onsalamotet' },
  { key: 'HC-20', value: 'Kungsör/Järnvägsstationen' },
  { key: 'HC-21', value: 'Köping/Sveavägen 17 (Gamla Taxi i Köping)' },
  { key: 'HC-22', value: 'Landskrona/Järnvägsstationen' },
  { key: 'HC-23', value: 'Linköping/Circle K,Tornby Nygårdsrondellen' },
  { key: 'HC-24', value: 'Ljungby/Ljungbystopp Circle K' },
  { key: 'HC-25', value: 'Malmköping/Busstationen' },
  { key: 'HC-26', value: 'Mjölby/Mc Donalds E4:an' },
  { key: 'HC-27', value: 'Mölndal/Scandic Mölndal' },
  { key: 'HC-28', value: 'Norrköping/Max, N. Promenaden' },
  { key: 'HC-29', value: 'Nyköping/Mc Donalds E4:an Syd ' },
  { key: 'HC-30', value: 'Sillekrog/OKQ8 E4:an' },
  { key: 'HC-31', value: 'Skillingaryd/Götaströms Värdshus' },
  { key: 'HC-32', value: 'Skövde/OKQ8 Badhusrondellen' },
  { key: 'HC-33', value: 'Solna/ Scandic Järva' },
  { key: 'HC-34', value: 'Stavsjö/ Circle K, E4:an' },
  { key: 'HC-35', value: 'Stockholm/Cityterminalen (se tv-monitor för gate)' },
  { key: 'HC-36', value: 'Strängnäs/Resecentrum' },
  { key: 'HC-37', value: 'Södertälje/Södertälje Syd' },
  { key: 'HC-38', value: 'Ulricehamn/Busstationen' },
  { key: 'HC-39', value: 'Upplands Väsby/Scandic Glädjens trafikplats' },
  { key: 'HC-40', value: 'Uppsala/Järnvägsstationen' },
  { key: 'HC-41', value: 'Vaggeryd/Götaströms Värdshus' },
  { key: 'HC-42', value: 'Varberg/Björkäng Vägkrog' },
  { key: 'HC-43', value: 'Värnamo/Mc Donalds E4:an Syd' },
  { key: 'HC-44', value: 'Västerås/Mc Donalds Erikslund (E18/RV66)' },
  { key: 'HC-45', value: 'Ängelholm/Mc Donalds E6:an' },
  { key: 'HC-46', value: 'Ödeshög/Östgötaporten Dinners' },
  { key: 'HC-47', value: 'Örebro/Resecentrum' }

]

const DirectConnection = [

  { key: 'DC-1', value: 'Alvesta/ICA Supermarket, Allbogatan' },
  { key: 'DC-2', value: 'Borås/Järnvägsstationen' },
  { key: 'DC-3', value: 'Bromölla/Preem, Gamla E22:an' },
  { key: 'DC-4', value: 'Bräkne Hoby/St1 bensinstation' },
  { key: 'DC-5', value: 'Båstad/Rasta Hallandsåsen' },
  { key: 'DC-6', value: 'Eksjö/Järnvägsstationen' },
  { key: 'DC-7', value: 'Emmaboda/Runes Bensin' },
  { key: 'DC-8', value: 'Eslöv/Circle K, Vikhemsvägen' },
  { key: 'DC-9', value: 'Falkenberg/Mc Donalds (Vinbergsmotet E6:an)' },
  { key: 'DC-10', value: 'Gislaved/Busstationen' },
  { key: 'DC-11', value: 'Göteborg/Nils Ericsonterminalen (se monitor för gate)' },
  { key: 'DC-12', value: 'Halmstad/Circle K, Eurostop' },
  { key: 'DC-13', value: 'Helsingborg/Knutpunkten (se monitor för gate)' },
  { key: 'DC-14', value: 'Huskvarna/Rosen Swedbank' },
  { key: 'DC-15', value: 'Hässleholm/Mc Donalds (väg 21)' },
  { key: 'DC-16', value: 'Hörby/Coop, Slagtoftavägen' },
  { key: 'DC-17', value: 'Höör/Hardy’s Gatukök' },
  { key: 'DC-18', value: 'Jönköping/M2 center (fd. Eurostop)' },
  { key: 'DC-19', value: 'Kalmar/Kalmar Rasta' },
  { key: 'DC-20', value: 'Karlshamn/Best Western (Circle K)' },
  { key: 'DC-21', value: 'Karlskrona/Angöringen' },
  { key: 'DC-22', value: 'Kristianstad/Circle K, (Karlssons Taverna)' },
  { key: 'DC-23', value: 'Kungsbacka/Circle K, Onsalamotet' },
  { key: 'DC-24', value: 'Laholm/Mc Donalds, Mellbystrand E6:an' },
  { key: 'DC-25', value: 'Landskrona/Järnvägsstationen' },
  { key: 'DC-26', value: 'Ljungby/Ljungbystopp Circle K' },
  { key: 'DC-27', value: 'Lomma/ Circle K, Bronsgatan ' },
  { key: 'DC-28', value: 'Lund/Ingo, Södra Vägen 1' },
  { key: 'DC-29', value: 'Löddeköpinge/Dahls Hotell Center Syd' },
  { key: 'DC-30', value: 'Malmö/Centrum, Adelgatan 7' },
  { key: 'DC-31', value: 'Malmö/Hyllie Malmö Arena Hotel, Hyllie Boulev.' },
  { key: 'DC-32', value: 'Malmö/Öresundsterminalen Toftanäs' },
  { key: 'DC-33', value: 'Markaryd/ICA Kvantum' },
  { key: 'DC-34', value: 'Mölndal/Scandic Mölndal' },
  { key: 'DC-35', value: 'Mönsterås/Circle K' },
  { key: 'DC-36', value: 'Mörrum/Kyrkan' },
  { key: 'DC-37', value: 'Nottebäck/Krysset' },
  { key: 'DC-38', value: 'Nybro/Preem Norra Vägen' },
  { key: 'DC-39', value: 'Nässjö/Circle K, Brånavägen' },
  { key: 'DC-40', value: 'Nättraby/Hållplats efter bron' },
  { key: 'DC-41', value: 'Osby/Circle K, väg 23' },
  { key: 'DC-42', value: 'Oskarshamn/Järnvägsstationen' },
  { key: 'DC-43', value: 'Påskallavik/Coop Konsum' },
  { key: 'DC-44', value: 'Rockneby/Preem, Hpl vid E22:an' },
  { key: 'DC-45', value: 'Ronneby/Järnvägsstationen' },
  { key: 'DC-46', value: 'Simrishamn/Järnvägsstationen' },
  { key: 'DC-47', value: 'Skillingaryd/Götaströms Värdshus' },
  { key: 'DC-48', value: 'Smålandsstenar/Busstationen' },
  { key: 'DC-49', value: 'Strömsnäsbruk/Shell E4:an (Luhrpasset)' },
  { key: 'DC-50', value: 'Sölvesborg/Blekingeporten' },
  { key: 'DC-51', value: 'Tollarp/ Ingo E22:an ' },
  { key: 'DC-52', value: 'Tomelilla/Ica Kvantum' },
  { key: 'DC-53', value: 'Traryd/Shell E4:an (Luhrpasset)' },
  { key: 'DC-54', value: 'Trelleborg/Tanka vid Bilia ' },
  { key: 'DC-55', value: 'Vaggeryd/Götaströms Värdshus' },
  { key: 'DC-56', value: 'Varberg/Björkäng Vägkrog' },
  { key: 'DC-57', value: 'Vellinge/Vellingeängar hållplats' },
  { key: 'DC-58', value: 'Vetlanda/Mc Donalds' },
  { key: 'DC-59', value: 'Värnamo/Mc Donalds E4:an Syd' },
  { key: 'DC-60', value: 'Växjö/Resecentrum hpl. X' },
  { key: 'DC-61', value: 'Ystad/Stationen Österleden' },
  { key: 'DC-62', value: 'Ålem/Preem' },
  { key: 'DC-63', value: 'Åstorp/Checkpoint' },
  { key: 'DC-64', value: 'Älmhult/Stortorget' },
  { key: 'DC-65', value: 'Ängelholm/Mc Donalds E6:an' },
  { key: 'DC-66', value: 'Örkelljunga/Circle K, Skåneporten' }

]

const DirectConnectionCitiesWinter = [

  { key: 'DCW-1', value: 'Bromölla, Preem gamla E22:an' },
  { key: 'DCW-2', value: 'Bräkne Hoby, St1 Bensinstation' },
  { key: 'DCW-3', value: 'Båstad, Rasta Hallandsåsen' },
  { key: 'DCW-4', value: 'Eslöv, Circle K Vihemsvägen' },
  { key: 'DCW-5', value: 'Falkenberg, McDonalds (Vinbergsmotet E6:an)' },
  { key: 'DCW-6', value: 'Göteborg, Nils Ericson Terminalen' },
  { key: 'DCW-7', value: 'Halmstad, Circle K Eurostop' },
  { key: 'DCW-8', value: 'Helsingborg, Knutpunkten (se monitor för gate)' },
  { key: 'DCW-9', value: 'Hässleholm, McDonalds (väg 21)' },
  { key: 'DCW-10', value: 'Hörby, Coop Slagtoftavägen' },
  { key: 'DCW-11', value: 'Höör, Hardys Gatukök' },
  { key: 'DCW-12', value: 'Jönköping, M2 Center (fd Eurostop)' },
  { key: 'DCW-13', value: 'Kalmar, Kalmar Rasta' },
  { key: 'DCW-14', value: 'Karlshamn, Best Western (Statoil)' },
  { key: 'DCW-15', value: 'Karlskrona, Angöringen' },
  { key: 'DCW-16', value: 'Kristianstad, Circle K Karlssons Taverna' },
  { key: 'DCW-17', value: 'Kungsbacka, Circle K Onsalamotet' },
  { key: 'DCW-18', value: 'Laholm, McDonalds Mellbystrand (E6:an)' },
  { key: 'DCW-19', value: 'Landskrona, Överskottsbolaget' },
  { key: 'DCW-20', value: 'Ljungby, Ljungbystopp Statoil' },
  { key: 'DCW-21', value: 'Lomma, Cirkle K, Bronsgatan' },
  { key: 'DCW-22', value: 'Lund, Circle K Lund södra (Malmöv.91)' },
  { key: 'DCW-23', value: 'Löddeköpinge, Dahls Hotell Center Syd' },
  { key: 'DCW-24', value: 'Malmö, Öresundsterminalen Toftanäs' },
  { key: 'DCW-25', value: 'Malmö, Centrum, Adelgatan 7' },
  { key: 'DCW-26', value: 'Malmö, Hyllie Malmö Arena Hotel, Hyllie Boulev. ' },
  { key: 'DCW-27', value: 'Markaryd, ICA Markant' },
  { key: 'DCW-28', value: 'Mölndal, Scandic Mölndal' },
  { key: 'DCW-29', value: 'Mörrum, kyrkan' },
  { key: 'DCW-30', value: 'Nättraby, Hållplats efter bron' },
  { key: 'DCW-31', value: 'Osby, Circle K Lars Dufva' },
  { key: 'DCW-32', value: 'Ronneby, Järnvägsstationen' },
  { key: 'DCW-33', value: 'Skillingaryd, Götaströms Värdshus' },
  { key: 'DCW-34', value: 'Strömsnäsbruk, Shell E4:an (Luhrpasset)' },
  { key: 'DCW-35', value: 'Sölvesborg, Blekingeporten' },
  { key: 'DCW-36', value: 'Tollarp, Ingo E22:an' },
  { key: 'DCW-37', value: 'Traryd, Shell E4:an (Luhrpasset)' },
  { key: 'DCW-38', value: 'Trelleborg, Tanka, vid Bilia' },
  { key: 'DCW-39', value: 'Vaggeryd, Götaströms Värdshus' },
  { key: 'DCW-40', value: 'Varberg, Björkäng Vägkrog' },
  { key: 'DCW-41', value: 'Vellinge, Vellingeängar hållplats' },
  { key: 'DCW-42', value: 'Värnamo, McDonalds E4:an syd' },
  { key: 'DCW-43', value: 'Växjö, Bussterminalen hpl. Y' },
  { key: 'DCW-44', value: 'Ystad,  Bussterminalen Österleden' },
  { key: 'DCW-45', value: 'Åstorp, Checkpoint' },
  { key: 'DCW-46', value: 'Älmhult, Kommunhuset' },
  { key: 'DCW-47', value: 'Ängelholm, McDonalds E6:an' },
  { key: 'DCW-48', value: 'Örkelljunga, Circle K Skåneporten (E4:an, avfart 72)' }

]

const LOCATIONS = {

  out: { label: 'Boarding location', key: KEY_NAMES.LOCATION, direction: 'out' },
  home: { label: 'Alighting location', key: KEY_NAMES.LOCATION, direction: 'home' },

  flight: [
    { key: 'BMA', value: 'BMA, Bromma' },
    { key: 'ARN', value: 'ARN, Arlanda' },
    { key: 'CPH', value: 'CPH, Köpenhamn' },
    { key: 'GOT', value: 'GOT, Landvetter' },
    { key: 'OSL', value: 'OSL, Gardermoen' }
  ],

  bus: [
    { key: 'OT', value: 'Öresundsterminalen' }
  ]

}

const ACCOMODATIONS = {

  out: { label: 'Accomodation', key: KEY_NAMES.ACCOMODATION, direction: 'out' },
  home: { label: 'Accomodation', key: KEY_NAMES.ACCOMODATION, direction: 'home' },

  flight: [
    { key: 'NA', value: 'No accomodation' },
    { key: 'SR', value: 'Single room' },
    { key: 'DR', value: 'Part in double room' }
  ],

  bus: [
    { key: 'NA', value: 'No accomodation' },
    { key: 'SR', value: 'Single room' },
    { key: 'DR', value: 'Part in double room' }
  ]

}

const BAG = {

  out: { label: 'Bag pickup', key: KEY_NAMES.BAG, direction: 'out' },
  home: { label: 'Bag dropoff', key: KEY_NAMES.BAG, direction: 'home' },

  flight: [
    { key: 'HOTEL', value: 'Overnight hotel Malmö' },
    { key: 'OT', value: 'Öresundsterminalen' },
    { key: 'OFFICE', value: 'Office' },
    { key: 'MAIL', value: 'Mail' },
    { key: 'EDTRIP', value: 'Education Trip (no bag)' }
  ],

  bus: [
    { key: 'HOTEL', value: 'Overnight hotel Malmö' },
    { key: 'OT', value: 'Öresundsterminalen' },
    { key: 'OFFICE', value: 'Office' },
    { key: 'EDTRIP', value: 'Education Trip (no bag)' }
  ]

}

const TRANSFERS = {

  out: { label: 'Transfer', key: KEY_NAMES.TRANSFER, direction: 'out' },
  home: { label: 'Transfer', key: KEY_NAMES.TRANSFER, direction: 'home' },

  flight: [
    { key: 'NT', value: 'No transfer' },
    { key: 'D', value: 'Direct' },
    { key: 'O', value: 'Overnight' }
  ],

  bus: [
    { key: 'NT', value: 'No transfer' },
    { key: 'D', value: 'Direct' },
    { key: 'O', value: 'Overnight' }
  ]

}

const TRANSFER_CITIES = {

  out: { label: 'Transfer city', key: KEY_NAMES.TRANSFER_CITY, direction: 'out' },
  home: { label: 'Transfer city', key: KEY_NAMES.TRANSFER_CITY, direction: 'home' }
}

export const getLocations = (direction, transport, selected) => {
  return {
    selected,
    config: LOCATIONS[direction],
    items: LOCATIONS[transport]
  }
}

export const getAccomodations = (direction, transport, selected) => {
  return {
    selected,
    config: ACCOMODATIONS[direction],
    items: ACCOMODATIONS[transport]
  }
}

export const getBagLocations = (direction, transport, selected, otherSelected) => {
  const EDTRIP = 'EDTRIP'

  if (otherSelected && otherSelected.get('key') === EDTRIP) {
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
    items: BAG[transport]
  }
}

export const getTransfers = (direction, transport, selected) => {
  return {
    selected,
    config: TRANSFERS[direction],
    items: TRANSFERS[transport]
  }
}

export const getTransferCities = (direction, transport, transfer, selected) => {
  const NO_TRANSFER = 'NT'
  const DIRECT_KEY = 'D'
  const OVERNIGHT_KEY = 'O'

  if (transfer && transfer.get('key') === NO_TRANSFER) {
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

  const isDirect = transfer ? transfer.get('key') === DIRECT_KEY : false
  const isOvernight = transfer ? transfer.get('key') === OVERNIGHT_KEY : false

  const config = TRANSFER_CITIES[direction]
  let items = []

  switch (transport) {
    case 'bus':
      if (isDirect && isWinter) items = DirectConnectionCitiesWinter
      if (isDirect && !isWinter) items = DirectConnection
      if (isOvernight) items = HotelConnection
      break
    case 'flight':
      if (isDirect) items = DirectConnection
      if (isOvernight) items = HotelConnection
      break
  }

  return {
    selected,
    config,
    items
  }
}

export const getKeyNames = () => {
  return KEY_NAMES
}
