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

export const getAaccept = (state, departureId) => {
  return state.modifiedData.get(departureId)
    ? state.modifiedData.get(departureId).get('accept')
      ? state.modifiedData.get(departureId).get('accept')
      : getMap({})
    : getMap({})
}

export const getModifiedData = state => state.modifiedData

export const getOrder = (state, departureId, bookingId, paxId) => {
  return state.modifiedData.getIn([departureId, 'orders', bookingId, paxId]) || getMap({})
}
