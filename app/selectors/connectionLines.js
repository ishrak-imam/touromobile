
import Cache from '../utils/cache'
import { listToMap, getMap, getList } from '../utils/immutable'

const gatherConnectToData = (locations, lines) => {
  return locations.map(loc => {
    let connectTo = loc.get('connectTo')
    if (connectTo.size > 0) {
      connectTo = connectTo.reduce((map, name) => {
        let line = lines.get(name)
        return map.set(name, formatLineData(line, name, lines))
      }, getMap({}))
    } else {
      connectTo = getMap({})
    }
    return loc.set('connectTo', connectTo)
  })
}

const getTotalPaxCount = locations => {
  let paxCount = 0
  locations.every(loc => {
    paxCount += loc.get('passengers').size
    loc.get('connectTo').every(line => {
      const locations = line.get('locations')
      paxCount += getTotalPaxCount(locations)
      return true
    })
    return true
  })
  return paxCount
}

const getParentConnections = (lines, name) => {
  let connectFrom = '' // getList([])
  lines.every(line => {
    const locations = line.get('locations')
    locations.every(loc => {
      const connectTo = loc.get('connectTo')
      if (connectTo.includes(name)) {
        connectFrom = line.get('name') // connectFrom.push(line.get('name'))
      }
      return true
    })
    return true
  })
  return connectFrom
}

const formatLineData = (line, name, lines) => {
  let lineData = getMap({})
  lineData = lineData.set('name', name)
  lineData = lineData.set('type', line.get('type'))
  lineData = lineData.set('overnight', line.get('overnight'))

  let locations = line.get('locations')
  const destination = locations.get(locations.size - 1)
  lineData = lineData.set('destination', destination.get('name'))
  lineData = lineData.set('eta', destination.get('eta'))

  locations = gatherConnectToData(locations, lines)
  lineData = lineData.set('locations', locations)

  const paxCount = getTotalPaxCount(locations)
  lineData = lineData.set('paxCount', paxCount)

  const connectFrom = getParentConnections(lines, name)
  lineData = lineData.set('connectFrom', connectFrom)

  return lineData
}

const resolvers = {

  prepareConnectionLines: lines => {
    let sortedLines = lines.sortBy(l => l.get('name'))
    sortedLines = listToMap(sortedLines, 'name')
    return sortedLines.map((line, name) => formatLineData(line, name, sortedLines))
  },

  prepareConnectionLineHotels: data => {
    const lines = data.get('lines')
    let hotels = data.get('hotels')
    hotels = listToMap(hotels, 'id')

    lines.every(line => {
      const name = line.get('name')
      if (line.get('overnight')) {
        const locations = line.get('locations')
        locations.every(loc => {
          const passengers = loc.get('passengers')
          passengers.every(p => {
            const hotelId = p.get('hotel')
            if (hotelId) {
              let hotel = hotels.get(String(hotelId))
              let totalPax = hotel.get('totalPax') || 0
              hotel = hotel.set('totalPax', totalPax + 1)
              let lines = hotel.get('lines') || getMap({})
              let line = lines.get(name) || getMap({})
              let paxList = line.get('passengers') || getList([])
              paxList = paxList.push(p)
              line = line.set('passengers', paxList)
              line = line.set('name', name)
              lines = lines.set(name, line)
              hotel = hotel.set('lines', lines)
              hotels = hotels.set(String(hotelId), hotel)
            }
            return true
          })
          return true
        })
      }
      return true
    })

    return hotels
  }

}

export const getConnectionLines = state => state.connectionLine.get('lines')
export const getConnectionLineHotels = state => state.connectionLine.get('hotels')

let formatConnectionLinesCache = null
export const formatConnectionLines = lines => {
  if (!formatConnectionLinesCache) {
    formatConnectionLinesCache = Cache(resolvers.prepareConnectionLines)
  }
  return formatConnectionLinesCache(lines)
}

let formatConnectionLineHotelsCache = null
export const formatConnectionLineHotels = (data) => {
  if (!formatConnectionLineHotelsCache) {
    formatConnectionLineHotelsCache = Cache(resolvers.prepareConnectionLineHotels)
  }
  return formatConnectionLineHotelsCache(data)
}
