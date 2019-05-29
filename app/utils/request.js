
/* eslint-disable */

import config from '../utils/config'
const SERVER_URL = config.SERVER_URL
const REQUEST_TIMEOUT = 30000
const COMMON_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}


const isRemoteDebuggingEnabled = (typeof atob !== 'undefined')
logResponse = (method, endPoint, payload, response) => {
  if(__DEV__ && isRemoteDebuggingEnabled) {
    console.groupCollapsed('%c REQUEST', 'color: #B22222  ', method, endPoint)
    console.log('%c STATUS     :: ', 'color: green', response.status)
    console.log('%c PAYLOAD    :: ', 'color: green', payload)
    console.log('%c RESPONSE   :: ', 'color: green', response)
    console.groupEnd()
  }
}



const errorHandler = (method, endPoint, payload = {}) => error => {

  logResponse(method, endPoint, payload, {status: 'REQ_TIMEOUT'})

  if(error === 'TIMEOUT') return Promise.reject({
    status: 'REQ_TIMEOUT',
    msg: 'Request timeout'
  })

  return Promise.reject(error)
}

const responseHandler = (method, endPoint, payload = {}) => response => {

  logResponse(method, endPoint, payload, response)

  if (response.status === 200 || response.status === 201) {
    if(!response._bodyText) return Promise.resolve()
    return response.json()
  }
  
  if(response.status === 204) return Promise.resolve()

  if(response.status === 401) return response.text().then(errMsg => Promise.reject({
    status: 401,
    msg: errMsg
  }))

  if(response.status === 404) return Promise.reject({
    status: 404,
    msg: '404 not found'
  })

  if(response.status === 500) return Promise.reject({
    status: 500,
    msg: 'Something went wrong'
  })
};

const createFetchPromise = (method, endPoint, data, headers) => {
  console.log('endPoint')
  const options = {
    method,
    headers: {...headers, ...COMMON_HEADERS},
  }
  if(method !== 'GET') options.body = JSON.stringify(data)
  return fetch(`${SERVER_URL}${endPoint}`, options)
}

const createTimeoutPromise = () => {
  return new Promise((_, reject) => setTimeout(() => reject('TIMEOUT'), REQUEST_TIMEOUT))
}

export const postRequest = (endPoint, data, headers = {}) => {
  const r = responseHandler('POST', endPoint, data)
  const e = errorHandler('POST', endPoint, data)
  return Promise.race([
    createFetchPromise('POST', endPoint, data, headers),
    createTimeoutPromise()
  ]).then(r).catch(e)
}

export const putRequest = (endPoint, data, headers = {}) => {
  const r = responseHandler('PUT', endPoint, data)
  const e = errorHandler('PUT', endPoint, data)
  return Promise.race([
    createFetchPromise('PUT', endPoint, data, headers),
    createTimeoutPromise()
  ]).then(r).catch(e)
}

export const getRequest = (endPoint, headers = {}) => {
  const r = responseHandler('GET', endPoint)
  const e = errorHandler('GET', endPoint)
  return Promise.race([
    createFetchPromise('GET', endPoint, {}, headers),
    createTimeoutPromise()
  ]).then(r).catch(e)
}

// function buildUrl (endPoint, obj) {
//   let url = `${SERVER_URL}${endPoint}`;
//   if (obj) url = `${url}?${serialize(obj)}`; // for GET requests with query parameters
//   return url;
// }

// function serialize (obj) {
//   const queryParams = Object.keys(obj).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
//   return queryParams.join('&');
// }
