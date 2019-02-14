
/* eslint-disable */

import config from '../utils/config'
const SERVER_URL = config.SERVER_URL
const REQUEST_TIMEOUT = 30000
const COMMON_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

const errorHandler = error => {
  if(error === 'TIMEOUT') return Promise.reject('Request timeout')
  return Promise.reject(error)
}

const responseHandler = response => {
  if (response.status === 200 || response.status === 201) {
    if(!response._bodyText) return Promise.resolve()
    return response.json()
  }
  if(response.status === 204) return Promise.resolve()
  if(response.status === 401) return response.text().then(errMsg => Promise.reject(errMsg))
  if(response.status === 404) return Promise.reject('404 not found')
  if(response.status === 500) return Promise.reject('Something went wrong')
  return response.json().then(e => {
    const {code, message, name} = e;
    return Promise.reject({code, message, name});
  });
};

const createFetchPromise = (endPoint, method, data, headers) => {
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
  return Promise.race([
    createFetchPromise(endPoint, 'POST', data, headers),
    createTimeoutPromise()
  ]).then(responseHandler).catch(errorHandler)
}

export const putRequest = (endPoint, data, headers = {}) => {
  return Promise.race([
    createFetchPromise(endPoint, 'PUT', data, headers),
    createTimeoutPromise()
  ]).then(responseHandler).catch(errorHandler)
}

export const getRequest = (endPoint, headers = {}) => {
  return Promise.race([
    createFetchPromise(endPoint, 'GET', {}, headers),
    createTimeoutPromise()
  ]).then(responseHandler).catch(errorHandler)
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
