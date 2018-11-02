
import { getPax, getParticipatingPax } from './trip'
import { getMap } from '../utils/immutable'

export const getReports = state => state.reports

/**
 * TODO:
 * see if possible to add caching
 */
export const getStatsData = (excursions, participants, trip) => {
  const pax = getPax(trip)
  const excursionPaxCounts = excursions.reduce((m, e) => {
    const excursionId = e.get('id')
    const participatingPax = getParticipatingPax(getMap({ pax, participants: participants.get(String(excursionId)) }))
    m.push({
      excursionId,
      participantCount: participatingPax.size
    })
    return m
  }, [])

  return {
    excursions: excursionPaxCounts,
    totalPassengers: pax.size
  }
}

export const getTotalParticipants = (excursions, participants, trip) => {
  const pax = getPax(trip)
  let aggregatedParticipants = 0
  aggregatedParticipants = excursions.reduce((aggr, e) => {
    const excursionId = String(e.get('id'))
    const participatingPax = getParticipatingPax(getMap({ pax, participants: participants.get(excursionId) }))
    aggr = aggr + participatingPax.size
    return aggr
  }, aggregatedParticipants)

  return {
    totalParticipants: aggregatedParticipants,
    maxPossiblePax: pax.size * excursions.size
  }
}
