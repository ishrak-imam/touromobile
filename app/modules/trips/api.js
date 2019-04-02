
import config from '../../utils/config'
import { getRequest, postRequest } from '../../utils/request'
import {
  mockTrips, mockAcceptAssignment,
  mockConfirmReservations, mockConnections,
  mockReservationData
} from '../../mockData'
// import { createDoc } from '../../../api_doc/docCreator'

export const getTrips = (guideId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  // createDoc('GET', '/resources/guide/{guideId}/overview', {}, 'getTrips')
  return config.useMockData
    ? mockTrips()
    : getRequest(`resources/guide/${guideId}/overview`, headers)
}

export const acceptAssignment = (guideId, departureId, data, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  // createDoc('POST', '/resources/guide/{guideId}/departure/{departureId}/accept', data, 'acceptAssignment')
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
  // createDoc('POST', '/resources/guide/{guideId}/departure/{departureId}/reservation', data, 'confirmReservations')
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
  // createDoc('GET', '/resources/connectionlocation', {}, 'getConnections')
  return config.useMockData
    ? mockConnections()
    : getRequest('resources/connectionlocation', headers)
}

export const getReservations = (guideId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  // createDoc('GET', '/resources/guide/{guideId}/reservations', {}, 'getReservations')
  return config.useMockData
    ? mockReservationData()
    : getRequest(`resources/guide/${guideId}/reservations`, headers)
}
