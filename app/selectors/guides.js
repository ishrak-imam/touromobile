
import Cache from '../utils/cache'
import { getList, getMap } from '../utils/immutable'

export const getGuidesData = state => state.guides

const resolvers = {

  sortedGuides: (guidesList, sortBy) => {
    const sortFunc = g => {
      if (!sortBy) return `${g.get('firstName')} ${g.get('lastName')}`
      return g.get(sortBy)
    }
    return guidesList.sortBy(sortFunc)
  },

  guidesDataGroup: guidesList => {
    let initial = ''
    return guidesList.reduce((list, item) => {
      const header = item.get('firstName').charAt(0)
      if (initial !== header) {
        list = list.push(getMap({ first: true, header, id: `${header}-${item.get('id')}` }))
        initial = header
      }
      list = list.push(item)

      return list
    }, getList([]))
  }
}

let sortedGuidesCache = null
export const getSortedGuides = (guidesList, sortBy) => {
  if (!sortedGuidesCache) {
    sortedGuidesCache = Cache(resolvers.sortedGuides)
  }
  return sortedGuidesCache(guidesList, sortBy)
}

let guideDataGroupByCache = null
export const getGuideDataGroup = (paxList, groupBy) => {
  if (!guideDataGroupByCache) {
    guideDataGroupByCache = Cache(resolvers.guidesDataGroup)
  }
  return guideDataGroupByCache(paxList, groupBy)
}

export const filterGuidesBySearchText = (guidesList, searchText) => {
  if (!searchText) return guidesList
  return guidesList.filter((item) => {
    const name = `${item.get('firstName')} ${item.get('lastName')}`.toLowerCase()
    return name.includes(searchText)
  })
}
