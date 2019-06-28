
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
  let connectFrom = getList([])
  lines.every(line => {
    const locations = line.get('locations')
    locations.every(loc => {
      const connectTo = loc.get('connectTo')
      if (connectTo.includes(name)) {
        connectFrom = connectFrom.push(line.get('name'))
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
  const destination = locations.get(locations.size - 1).get('name')
  lineData = lineData.set('destination', destination)

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
  }

}

export const getConnectionLines = state => state.connectionLine.get('lines')

let formatConnectionLinesCache = null
export const formatConnectionLines = lines => {
  if (!formatConnectionLinesCache) {
    formatConnectionLinesCache = Cache(resolvers.prepareConnectionLines)
  }
  return formatConnectionLinesCache(lines)
}
