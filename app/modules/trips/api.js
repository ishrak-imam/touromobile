
import config from '../../utils/config'
import { getRequest, postRequest } from '../../utils/request'
import {
  mockTrips, mockAcceptAssignment,
  mockConfirmReservations, mockConnections
} from '../../mockData'

export const getTrips = (guideId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockTrips()
    : getRequest(`resources/guide/${guideId}/overview`, headers)
}

export const acceptAssignment = (guideId, departureId, data, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockAcceptAssignment()
    : postRequest(
      `resources/guide/${guideId}/departure/${departureId}/accept`,
      data,
      headers
    )
}

export const confirmReservations = (guideId, departureId, data, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockConfirmReservations()
    : postRequest(
      `resources/guide/${guideId}/departure/${departureId}/reservation`,
      data,
      headers
    )
}

export const getConnections = (jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }

  return config.useMockData
    ? mockConnections()
    : getRequest('resources/connectionlocation', headers)
}
