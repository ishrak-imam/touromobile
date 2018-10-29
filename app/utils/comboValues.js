
import { isWithinRange } from 'date-fns'

const KEY_NAMES = {
  LOCATION: 'location',
  ACCOMODATION: 'accomodation',
  BAG: 'bag',
  TRANSFER: 'transfer',
  TRANSFER_CITY: 'transferCity'
}

const HotelConnection = [

  { key: 1, value: 'Arboga/Resecentrum' },
  { key: 2, value: 'Bollebygd/Circle K' },
  { key: 3, value: 'Borås/Järnvägsstationen' },
  { key: 4, value: 'Enköping/Gustaf Adolfsplan' },
  { key: 5, value: 'Eskilstuna/Bussterminalen (Kyrkogatan)' },
  { key: 6, value: 'Falkenberg/Mc Donalds (Vinbergsmotet E6:an)' },
  { key: 7, value: 'Falköping/Mc Donalds (väg 46/47)' },
  { key: 8, value: 'Flen/Busstationen' },
  { key: 9, value: 'Gränna/Circle K, Galgen' },
  { key: 10, value: 'Göteborg/Nils Ericsonterminalen (se monitor för gate)' },
  { key: 11, value: 'Hallstahammar/Busstationen' },
  { key: 12, value: 'Halmstad/Circle K, Eurostop' },
  { key: 13, value: 'Helsingborg/Knutpunkten (se monitor för gate)' },
  { key: 14, value: 'Huskvarna/Rosen Swedbank' },
  { key: 15, value: 'Jönköping/M2 center (fd. Eurostop)' },
  { key: 16, value: 'Karlstad/Busstationen' },
  { key: 17, value: 'Katrineholm/Resecentrum' },
  { key: 18, value: 'Kumla/Busstationen' },
  { key: 19, value: 'Kungsbacka/Circle K, Onsalamotet' },
  { key: 20, value: 'Kungsör/Järnvägsstationen' },
  { key: 21, value: 'Köping/Sveavägen 17 (Gamla Taxi i Köping)' },
  { key: 22, value: 'Landskrona/Järnvägsstationen' },
  { key: 23, value: 'Linköping/Circle K,Tornby Nygårdsrondellen' },
  { key: 24, value: 'Ljungby/Ljungbystopp Circle K' },
  { key: 25, value: 'Malmköping/Busstationen' },
  { key: 26, value: 'Mjölby/Mc Donalds E4:an' },
  { key: 27, value: 'Mölndal/Scandic Mölndal' },
  { key: 28, value: 'Norrköping/Max, N. Promenaden' },
  { key: 29, value: 'Nyköping/Mc Donalds E4:an Syd ' },
  { key: 30, value: 'Sillekrog/OKQ8 E4:an' },
  { key: 31, value: 'Skillingaryd/Götaströms Värdshus' },
  { key: 32, value: 'Skövde/OKQ8 Badhusrondellen' },
  { key: 33, value: 'Solna/ Scandic Järva' },
  { key: 34, value: 'Stavsjö/ Circle K, E4:an' },
  { key: 35, value: 'Stockholm/Cityterminalen (se tv-monitor för gate)' },
  { key: 36, value: 'Strängnäs/Resecentrum' },
  { key: 37, value: 'Södertälje/Södertälje Syd' },
  { key: 38, value: 'Ulricehamn/Busstationen' },
  { key: 39, value: 'Upplands Väsby/Scandic Glädjens trafikplats' },
  { key: 40, value: 'Uppsala/Järnvägsstationen' },
  { key: 41, value: 'Vaggeryd/Götaströms Värdshus' },
  { key: 42, value: 'Varberg/Björkäng Vägkrog' },
  { key: 43, value: 'Värnamo/Mc Donalds E4:an Syd' },
  { key: 44, value: 'Västerås/Mc Donalds Erikslund (E18/RV66)' },
  { key: 45, value: 'Ängelholm/Mc Donalds E6:an' },
  { key: 46, value: 'Ödeshög/Östgötaporten Dinners' },
  { key: 47, value: 'Örebro/Resecentrum' }

]

const DirectConnection = [

  { key: 1, value: 'Alvesta/ICA Supermarket, Allbogatan' },
  { key: 2, value: 'Borås/Järnvägsstationen' },
  { key: 3, value: 'Bromölla/Preem, Gamla E22:an' },
  { key: 4, value: 'Bräkne Hoby/St1 bensinstation' },
  { key: 5, value: 'Båstad/Rasta Hallandsåsen' },
  { key: 6, value: 'Eksjö/Järnvägsstationen' },
  { key: 7, value: 'Emmaboda/Runes Bensin' },
  { key: 8, value: 'Eslöv/Circle K, Vikhemsvägen' },
  { key: 9, value: 'Falkenberg/Mc Donalds (Vinbergsmotet E6:an)' },
  { key: 10, value: 'Gislaved/Busstationen' },
  { key: 11, value: 'Göteborg/Nils Ericsonterminalen (se monitor för gate)' },
  { key: 12, value: 'Halmstad/Circle K, Eurostop' },
  { key: 13, value: 'Helsingborg/Knutpunkten (se monitor för gate)' },
  { key: 14, value: 'Huskvarna/Rosen Swedbank' },
  { key: 15, value: 'Hässleholm/Mc Donalds (väg 21)' },
  { key: 16, value: 'Hörby/Coop, Slagtoftavägen' },
  { key: 17, value: 'Höör/Hardy’s Gatukök' },
  { key: 18, value: 'Jönköping/M2 center (fd. Eurostop)' },
  { key: 19, value: 'Kalmar/Kalmar Rasta' },
  { key: 20, value: 'Karlshamn/Best Western (Circle K)' },
  { key: 21, value: 'Karlskrona/Angöringen' },
  { key: 22, value: 'Kristianstad/Circle K, (Karlssons Taverna)' },
  { key: 23, value: 'Kungsbacka/Circle K, Onsalamotet' },
  { key: 24, value: 'Laholm/Mc Donalds, Mellbystrand E6:an' },
  { key: 25, value: 'Landskrona/Järnvägsstationen' },
  { key: 26, value: 'Ljungby/Ljungbystopp Circle K' },
  { key: 27, value: 'Lomma/ Circle K, Bronsgatan ' },
  { key: 28, value: 'Lund/Ingo, Södra Vägen 1' },
  { key: 29, value: 'Löddeköpinge/Dahls Hotell Center Syd' },
  { key: 30, value: 'Malmö/Centrum, Adelgatan 7' },
  { key: 31, value: 'Malmö/Hyllie Malmö Arena Hotel, Hyllie Boulev.' },
  { key: 32, value: 'Malmö/Öresundsterminalen Toftanäs' },
  { key: 33, value: 'Markaryd/ICA Kvantum' },
  { key: 34, value: 'Mölndal/Scandic Mölndal' },
  { key: 35, value: 'Mönsterås/Circle K' },
  { key: 36, value: 'Mörrum/Kyrkan' },
  { key: 37, value: 'Nottebäck/Krysset' },
  { key: 38, value: 'Nybro/Preem Norra Vägen' },
  { key: 39, value: 'Nässjö/Circle K, Brånavägen' },
  { key: 40, value: 'Nättraby/Hållplats efter bron' },
  { key: 41, value: 'Osby/Circle K, väg 23' },
  { key: 42, value: 'Oskarshamn/Järnvägsstationen' },
  { key: 43, value: 'Påskallavik/Coop Konsum' },
  { key: 44, value: 'Rockneby/Preem, Hpl vid E22:an' },
  { key: 45, value: 'Ronneby/Järnvägsstationen' },
  { key: 46, value: 'Simrishamn/Järnvägsstationen' },
  { key: 47, value: 'Skillingaryd/Götaströms Värdshus' },
  { key: 48, value: 'Smålandsstenar/Busstationen' },
  { key: 49, value: 'Strömsnäsbruk/Shell E4:an (Luhrpasset)' },
  { key: 50, value: 'Sölvesborg/Blekingeporten' },
  { key: 51, value: 'Tollarp/ Ingo E22:an ' },
  { key: 52, value: 'Tomelilla/Ica Kvantum' },
  { key: 53, value: 'Traryd/Shell E4:an (Luhrpasset)' },
  { key: 54, value: 'Trelleborg/Tanka vid Bilia ' },
  { key: 55, value: 'Vaggeryd/Götaströms Värdshus' },
  { key: 56, value: 'Varberg/Björkäng Vägkrog' },
  { key: 57, value: 'Vellinge/Vellingeängar hållplats' },
  { key: 58, value: 'Vetlanda/Mc Donalds' },
  { key: 59, value: 'Värnamo/Mc Donalds E4:an Syd' },
  { key: 60, value: 'Växjö/Resecentrum hpl. X' },
  { key: 61, value: 'Ystad/Stationen Österleden' },
  { key: 62, value: 'Ålem/Preem' },
  { key: 63, value: 'Åstorp/Checkpoint' },
  { key: 64, value: 'Älmhult/Stortorget' },
  { key: 65, value: 'Ängelholm/Mc Donalds E6:an' },
  { key: 66, value: 'Örkelljunga/Circle K, Skåneporten' }

]

const DirectConnectionCitiesWinter = [

  { key: 1, value: 'Bromölla, Preem gamla E22:an' },
  { key: 2, value: 'Bräkne Hoby, St1 Bensinstation' },
  { key: 3, value: 'Båstad, Rasta Hallandsåsen' },
  { key: 4, value: 'Eslöv, Circle K Vihemsvägen' },
  { key: 5, value: 'Falkenberg, McDonalds (Vinbergsmotet E6:an)' },
  { key: 6, value: 'Göteborg, Nils Ericson Terminalen' },
  { key: 7, value: 'Halmstad, Circle K Eurostop' },
  { key: 8, value: 'Helsingborg, Knutpunkten (se monitor för gate)' },
  { key: 9, value: 'Hässleholm, McDonalds (väg 21)' },
  { key: 10, value: 'Hörby, Coop Slagtoftavägen' },
  { key: 11, value: 'Höör, Hardys Gatukök' },
  { key: 12, value: 'Jönköping, M2 Center (fd Eurostop)' },
  { key: 13, value: 'Kalmar, Kalmar Rasta' },
  { key: 14, value: 'Karlshamn, Best Western (Statoil)' },
  { key: 15, value: 'Karlskrona, Angöringen' },
  { key: 16, value: 'Kristianstad, Circle K Karlssons Taverna' },
  { key: 17, value: 'Kungsbacka, Circle K Onsalamotet' },
  { key: 18, value: 'Laholm, McDonalds Mellbystrand (E6:an)' },
  { key: 19, value: 'Landskrona, Överskottsbolaget' },
  { key: 20, value: 'Ljungby, Ljungbystopp Statoil' },
  { key: 21, value: 'Lomma, Cirkle K, Bronsgatan' },
  { key: 22, value: 'Lund, Circle K Lund södra (Malmöv.91)' },
  { key: 23, value: 'Löddeköpinge, Dahls Hotell Center Syd' },
  { key: 24, value: 'Malmö, Öresundsterminalen Toftanäs' },
  { key: 25, value: 'Malmö, Centrum, Adelgatan 7' },
  { key: 26, value: 'Malmö, Hyllie Malmö Arena Hotel, Hyllie Boulev. ' },
  { key: 27, value: 'Markaryd, ICA Markant' },
  { key: 28, value: 'Mölndal, Scandic Mölndal' },
  { key: 29, value: 'Mörrum, kyrkan' },
  { key: 30, value: 'Nättraby, Hållplats efter bron' },
  { key: 31, value: 'Osby, Circle K Lars Dufva' },
  { key: 32, value: 'Ronneby, Järnvägsstationen' },
  { key: 33, value: 'Skillingaryd, Götaströms Värdshus' },
  { key: 34, value: 'Strömsnäsbruk, Shell E4:an (Luhrpasset)' },
  { key: 35, value: 'Sölvesborg, Blekingeporten' },
  { key: 36, value: 'Tollarp, Ingo E22:an' },
  { key: 37, value: 'Traryd, Shell E4:an (Luhrpasset)' },
  { key: 38, value: 'Trelleborg, Tanka, vid Bilia' },
  { key: 39, value: 'Vaggeryd, Götaströms Värdshus' },
  { key: 40, value: 'Varberg, Björkäng Vägkrog' },
  { key: 41, value: 'Vellinge, Vellingeängar hållplats' },
  { key: 42, value: 'Värnamo, McDonalds E4:an syd' },
  { key: 43, value: 'Växjö, Bussterminalen hpl. Y' },
  { key: 44, value: 'Ystad,  Bussterminalen Österleden' },
  { key: 45, value: 'Åstorp, Checkpoint' },
  { key: 46, value: 'Älmhult, Kommunhuset' },
  { key: 47, value: 'Ängelholm, McDonalds E6:an' },
  { key: 48, value: 'Örkelljunga, Circle K Skåneporten (E4:an, avfart 72)' }

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
    { key: 'ÖT', value: 'ÖT' }
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
    { key: 'ÖT', value: 'Öresundsterminalen' },
    { key: 'OFFICE', value: 'Office' },
    { key: 'MAIL', value: 'Mail' },
    { key: 'EDTRIP', value: 'Education Trip (no bag)' }
  ],

  bus: [
    { key: 'HOTEL', value: 'Overnight hotel Malmö' },
    { key: 'ÖT', value: 'Öresundsterminalen' },
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

export const getTransfers = (direction, transport) => {
  return {
    config: TRANSFERS[direction],
    items: TRANSFERS[transport]
  }
}

export const getTransferCities = (direction, transport, transfer) => {
  const DIRECT_KEY = 'D'
  const OVERNIGHT_KEY = 'O'

  const date = new Date()
  const year = date.getFullYear()
  const xMas = new Date(year, 10, 25)
  const newYear = new Date(year + 1, 0, 1)
  const isWinter = isWithinRange(date, xMas, newYear)

  const isDirect = transfer === DIRECT_KEY
  const isOvernight = transfer === OVERNIGHT_KEY

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
    config, items
  }
}

export const getKeyNames = () => {
  return KEY_NAMES
}
