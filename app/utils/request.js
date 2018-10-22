
/* eslint-disable */

import config from '../utils/config'
const SERVER_URL = config.SERVER_URL

const responseHandler = response => {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }
  if(response.status === 204) {
    return Promise.resolve()
  }
  if(response.status === 401) {
    return response.text().then(errMsg => {
      return Promise.reject(errMsg)
    })
  }
  if(response.status === 404) {
    return Promise.reject('404 not found')
  }
  return response.json().then(e => {
    const {code, message, name} = e;
    return Promise.reject({code, message, name});
  });
};

export const postRequest = (endPoint, data, headers = {}) => {
  return fetch(`${SERVER_URL}${endPoint}`, {
    method: 'POST',
    headers: {
      ...headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(responseHandler);
}

export const putRequest = (endPoint, data, headers = {}) => {
  return fetch(`${SERVER_URL}${endPoint}`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(responseHandler);
}

export const getRequest = (url, headers = {}) => {
  return fetch(`${SERVER_URL}${url}`, {
    method: 'GET',
    headers: {
      ...headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(responseHandler);
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
