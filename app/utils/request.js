
/* eslint-disable */

import config from '../utils/config'
const SERVER_URL = config.SERVER_URL
const REQUEST_TIMEOUT = 30000

const errorHandler = error => {
  if(error === 'TIMEOUT') return Promise.reject('Request timeout')
  return Promise.reject(error)
}

const responseHandler = response => {
  if (response.status === 200 || response.status === 201) return response.json()
  if(response.status === 204) return Promise.resolve()
  if(response.status === 401) return response.text().then(errMsg => Promise.reject(errMsg))
  if(response.status === 404) return Promise.reject('404 not found')
  if(response.status === 500) return Promise.reject('Something went wrong')
  return response.json().then(e => {
    const {code, message, name} = e;
    return Promise.reject({code, message, name});
  });
};

export const postRequest = (endPoint, data, headers = {}) => {
  return Promise.race([
    fetch(`${SERVER_URL}${endPoint}`, {
      method: 'POST',
      headers: {
        ...headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }),
    new Promise((_, reject) => setTimeout(() => reject('TIMEOUT'), REQUEST_TIMEOUT))
  ]).then(responseHandler).catch(errorHandler)

}

export const putRequest = (endPoint, data, headers = {}) => {
  return Promise.race([
    fetch(`${SERVER_URL}${endPoint}`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }),
    new Promise((_, reject) => setTimeout(() => reject('TIMEOUT'), REQUEST_TIMEOUT))
  ]).then(responseHandler).catch(errorHandler)
}

export const getRequest = (url, headers = {}) => {
  return Promise.race([
    fetch(`${SERVER_URL}${url}`, {
      method: 'GET',
      headers: {
        ...headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }),
    new Promise((_, reject) => setTimeout(() => reject('TIMEOUT'), REQUEST_TIMEOUT))
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
