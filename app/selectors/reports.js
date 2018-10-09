
import { getPax, getParticipatingPax } from './trip'
import { getMap } from '../utils/immutable'
import { percentage } from '../utils/mathHelpers'

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

export const getTotalPercentage = (excursions, participants, trip) => {
  const pax = getPax(trip)
  let aggregatedParticipants = 0
  aggregatedParticipants = excursions.reduce((aggr, e) => {
    const excursionId = e.get('id')
    const participatingPax = getParticipatingPax(getMap({ pax, participants: participants.get(String(excursionId)) }))
    aggr = aggr + participatingPax.size
    return aggr
  }, aggregatedParticipants)

  const maxPossiblePax = pax.size * excursions.size
  return percentage(aggregatedParticipants, maxPossiblePax)
}
