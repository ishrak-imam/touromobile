import { getMap } from '../utils/immutable'

export const getModifiedPax = (state, departureId) => {
  return state.modifiedData.get(departureId)
    ? state.modifiedData.get(departureId).get('modifiedPax') ? state.modifiedData.get(departureId).get('modifiedPax') : getMap({})
    : getMap({})
}
export const getParticipants = (state, departureId) => {
  return state.modifiedData.get(departureId)
    ? state.modifiedData.get(departureId).get('participants') ? state.modifiedData.get(departureId).get('participants') : getMap({})
    : getMap({})
}
