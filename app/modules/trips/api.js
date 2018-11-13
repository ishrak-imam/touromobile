
import config from '../../utils/config'
import { getRequest, postRequest } from '../../utils/request'
import { mockTrips, mockAcceptFutureTrip } from '../../mockData'

export const getTrips = (guideId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockTrips()
    : getRequest(`resources/guide/${guideId}/overview`, headers)
}

export const acceptTrip = (guideId, departureId, isAccepted, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockAcceptFutureTrip()
    : postRequest(
      `resources/guide/${guideId}/trip/${departureId}/accept`,
      { accept: isAccepted },
      headers
    )
}

export const sendTripReservations = (guideId, departureId, data, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockAcceptFutureTrip()
    : postRequest(
      `resources/guide/${guideId}/trip/${departureId}/reservation`,
      data,
      headers
    )
}
