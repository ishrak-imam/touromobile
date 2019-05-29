
import { createReducer } from '../../utils/reduxHelpers'
import {
  setIntoMap, readValue, getMap,
  mergeMapShallow, mergeMapDeep, deleteFromMap
} from '../../utils/immutable'

import {
  MODIFY_PAX_DATA,
  SET_PARTICIPANTS,

  SET_ACCEPT_TRIP,
  SET_ACCEPT_TRIP_COMBOS,
  TOGGLE_ACCEPT_SAVE,

  SET_DEFAULT_COMBOS,

  ACCEPT_TRIP_REQ,
  ACCEPT_TRIP_SUCS,
  ACCEPT_TRIP_FAIL,

  PREPARE_CANCEL_DATA,
  CANCEL_COMBO_VALUES,

  TAKE_ORDER,
  TAKE_EXTRA_ORDER,

  TAKE_ALLERGY_ORDER,
  SET_ALLERGY_ORDER,

  SELECT_INVOICEE,
  DELETE_INVOICEE,
  SET_INVOICEELIST,

  RESET_ALL_ORDERS,

  SYNC_MODIFIED_DATA_SUCS,
  SET_DOWNLOADED_MODIFIED_DATA,

  SSN_DATA_REQ,
  SSN_DATA_SUCS,
  SSN_DATA_FAIL,

  SET_ORDER_BUCKET,
  SET_IS_NEED_DISTRIBUTION
} from './action'

import {
  UPLOAD_STATS_REQ,
  UPLOAD_STATS_SUCS,
  UPLOAD_STATS_FAIL
} from '../reports/action'

import { MODIFIED_DATA_INITIAL_STATE } from './immutable'

export const modifiedData = createReducer(MODIFIED_DATA_INITIAL_STATE, {

  [SET_PARTICIPANTS]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let participants = readValue('participants', modifiedData) || getMap({})
    let exParticipants = readValue(payload.excursionId, participants) || getMap({})
    exParticipants = setIntoMap(exParticipants, payload.bookingId, payload.participants)
    participants = setIntoMap(participants, payload.excursionId, exParticipants)
    modifiedData = setIntoMap(modifiedData, 'participants', participants)
    modifiedData = setIntoMap(modifiedData, 'statsUploadedAt', null)
    modifiedData = setIntoMap(modifiedData, 'isLoading', false)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [MODIFY_PAX_DATA]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let modifiedPax = readValue('modifiedPax', modifiedData) || getMap({})
    let pax = readValue(payload.paxId, modifiedPax) || getMap({})
    modifiedPax = setIntoMap(modifiedPax, payload.paxId, mergeMapShallow(pax, getMap(payload.pax)))
    modifiedData = setIntoMap(modifiedData, 'modifiedPax', modifiedPax)
    modifiedData = setIntoMap(modifiedData, 'isLoading', false)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [UPLOAD_STATS_REQ]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    modifiedData = setIntoMap(modifiedData, 'isLoading', true)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [UPLOAD_STATS_SUCS]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    modifiedData = setIntoMap(modifiedData, 'statsUploadedAt', payload.time)
    modifiedData = setIntoMap(modifiedData, 'isLoading', false)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [UPLOAD_STATS_FAIL]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    modifiedData = setIntoMap(modifiedData, 'statsUploadedAt', null)
    modifiedData = setIntoMap(modifiedData, 'isLoading', false)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SET_ACCEPT_TRIP]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let accept = readValue('accept', modifiedData) || getMap({})
    accept = setIntoMap(accept, 'isAccepted', payload.isAccepted)
    accept = setIntoMap(accept, 'dirty', true)
    accept = setIntoMap(accept, 'acceptedAt', null)
    modifiedData = setIntoMap(modifiedData, 'accept', accept)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SET_ACCEPT_TRIP_COMBOS]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let accept = readValue('accept', modifiedData) || getMap({})
    accept = setIntoMap(accept, 'dirty', true)
    accept = setIntoMap(accept, 'acceptedAt', null)
    accept = setIntoMap(accept, 'saveDisabled', false)
    let direction = readValue(payload.direction, accept) || getMap({})
    direction = setIntoMap(direction, payload.key, getMap(payload.value))
    accept = setIntoMap(accept, payload.direction, direction)
    modifiedData = setIntoMap(modifiedData, 'accept', accept)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [TOGGLE_ACCEPT_SAVE]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let accept = readValue('accept', modifiedData) || getMap({})
    accept = setIntoMap(accept, 'saveDisabled', payload.saveDisabled)
    modifiedData = setIntoMap(modifiedData, 'accept', accept)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SET_DEFAULT_COMBOS]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let accept = readValue('accept', modifiedData) || getMap({})
    // accept = setIntoMap(accept, 'dirty', true)
    // accept = setIntoMap(accept, 'acceptedAt', null)
    accept = setIntoMap(accept, 'home', payload.home)
    accept = setIntoMap(accept, 'out', payload.out)
    modifiedData = setIntoMap(modifiedData, 'accept', accept)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [ACCEPT_TRIP_REQ]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state)
    let accept = readValue('accept', modifiedData)
    accept = setIntoMap(accept, 'isLoading', true)
    modifiedData = setIntoMap(modifiedData, 'accept', accept)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [ACCEPT_TRIP_SUCS]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state)
    let accept = readValue('accept', modifiedData)
    accept = setIntoMap(accept, 'isLoading', false)
    accept = setIntoMap(accept, 'dirty', false)
    accept = setIntoMap(accept, 'acceptedAt', payload.time)
    modifiedData = setIntoMap(modifiedData, 'accept', accept)
    modifiedData = setIntoMap(modifiedData, 'prevAccept', accept)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [ACCEPT_TRIP_FAIL]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state)
    let accept = readValue('accept', modifiedData)
    accept = setIntoMap(accept, 'isLoading', false)
    accept = setIntoMap(accept, 'dirty', true)
    accept = setIntoMap(accept, 'acceptedAt', null)
    modifiedData = setIntoMap(modifiedData, 'accept', accept)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [PREPARE_CANCEL_DATA]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state)
    modifiedData = setIntoMap(modifiedData, 'prevAccept', payload.accept)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [CANCEL_COMBO_VALUES]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state)
    let prevAccept = readValue('prevAccept', modifiedData)
    modifiedData = setIntoMap(modifiedData, 'accept', prevAccept)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [RESET_ALL_ORDERS]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let orders = readValue(payload.key, modifiedData) || getMap({})
    orders = setIntoMap(orders, payload.bookingId, getMap({}))
    modifiedData = setIntoMap(modifiedData, payload.key, orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SELECT_INVOICEE]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let orders = readValue('orders', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, orders) || getMap({})
    let invoicee = readValue('invoicee', orderForBooking) || getMap({})
    invoicee = setIntoMap(invoicee, payload.paxId, payload.invoicee)
    orderForBooking = setIntoMap(orderForBooking, 'invoicee', invoicee)
    orders = setIntoMap(orders, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'orders', orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [DELETE_INVOICEE]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let orders = readValue('orders', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, orders) || getMap({})
    let invoicee = readValue('invoicee', orderForBooking) || getMap({})
    invoicee = deleteFromMap(invoicee, payload.paxId)
    orderForBooking = setIntoMap(orderForBooking, 'invoicee', invoicee)
    orders = setIntoMap(orders, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'orders', orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SET_INVOICEELIST]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let orders = readValue('orders', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, orders) || getMap({})
    orderForBooking = setIntoMap(orderForBooking, 'invoicee', payload.invoiceeList)
    orders = setIntoMap(orders, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'orders', orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [TAKE_EXTRA_ORDER]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let extraOrders = readValue('extraOrders', modifiedData) || getMap({})
    extraOrders = setIntoMap(extraOrders, payload.bookingId, payload.extraOrders)
    modifiedData = setIntoMap(modifiedData, 'extraOrders', extraOrders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SET_ALLERGY_ORDER]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state)
    let orders = readValue('orders', modifiedData)
    let orderForBooking = readValue(payload.bookingId, orders)
    let orderForDirection = readValue(payload.direction, orderForBooking)
    let orderForMealType = readValue('meal', orderForDirection)
    let meal = readValue(payload.mealId, orderForMealType)
    let allergies = readValue('allergies', meal) || getMap({})
    allergies = setIntoMap(allergies, payload.allergyId, getMap(payload.allergyOrder))
    meal = setIntoMap(meal, 'allergies', allergies)
    orderForMealType = setIntoMap(orderForMealType, payload.mealId, meal)
    orderForDirection = setIntoMap(orderForDirection, 'meal', orderForMealType)
    orderForBooking = setIntoMap(orderForBooking, payload.direction, orderForDirection)
    orders = setIntoMap(orders, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'orders', orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [TAKE_ALLERGY_ORDER]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state)
    let orders = readValue('orders', modifiedData)
    let orderForBooking = readValue(payload.bookingId, orders)
    let orderForDirection = readValue(payload.direction, orderForBooking)
    let orderForMealType = readValue('meal', orderForDirection)
    let meal = readValue(payload.mealId, orderForMealType)
    let allergies = readValue('allergies', meal)
    let allergyOrder = readValue(payload.allergyId, allergies)
    allergies = setIntoMap(allergies, payload.allergyId, mergeMapDeep(allergyOrder, payload.allergyOrder))
    meal = setIntoMap(meal, 'allergies', allergies)
    orderForMealType = setIntoMap(orderForMealType, payload.mealId, meal)
    orderForDirection = setIntoMap(orderForDirection, 'meal', orderForMealType)
    orderForBooking = setIntoMap(orderForBooking, payload.direction, orderForDirection)
    orders = setIntoMap(orders, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'orders', orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [TAKE_ORDER]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let orders = readValue('orders', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, orders) || getMap({})
    let orderForDirection = readValue(payload.direction, orderForBooking) || getMap({})
    let orderForMealType = readValue(payload.mealType, orderForDirection) || getMap({})
    let order = readValue(payload.mealId, orderForMealType) || getMap({})
    orderForMealType = setIntoMap(orderForMealType, payload.mealId, mergeMapDeep(order, payload.order))
    orderForDirection = setIntoMap(orderForDirection, payload.mealType, orderForMealType)
    orderForBooking = setIntoMap(orderForBooking, payload.direction, orderForDirection)
    orders = setIntoMap(orders, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'orders', orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SYNC_MODIFIED_DATA_SUCS]: (state, payload) => {
    return setIntoMap(state, 'lastSyncedTime', payload)
  },

  [SET_DOWNLOADED_MODIFIED_DATA]: (state, payload) => payload,

  [SSN_DATA_REQ]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let orders = readValue('orders', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, orders) || getMap({})
    let invoicee = readValue('invoicee', orderForBooking) || getMap({})
    let invoiceePax = readValue(payload.paxId, invoicee)
    invoiceePax = setIntoMap(invoiceePax, 'isLoading', true)
    invoiceePax = setIntoMap(invoiceePax, 'ssn', payload.ssn)
    invoicee = setIntoMap(invoicee, payload.paxId, invoiceePax)
    orderForBooking = setIntoMap(orderForBooking, 'invoicee', invoicee)
    orders = setIntoMap(orders, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'orders', orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SSN_DATA_SUCS]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let orders = readValue('orders', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, orders) || getMap({})
    let invoicee = readValue('invoicee', orderForBooking) || getMap({})
    let invoiceePax = readValue(payload.paxId, invoicee)
    invoiceePax = mergeMapShallow(invoiceePax, getMap(payload.invoicee))
    invoiceePax = setIntoMap(invoiceePax, 'isLoading', false)
    invoicee = setIntoMap(invoicee, payload.paxId, invoiceePax)
    orderForBooking = setIntoMap(orderForBooking, 'invoicee', invoicee)
    orders = setIntoMap(orders, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'orders', orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SSN_DATA_FAIL]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let orders = readValue('orders', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, orders) || getMap({})
    let invoicee = readValue('invoicee', orderForBooking) || getMap({})
    let invoiceePax = readValue(payload.paxId, invoicee)
    invoiceePax = setIntoMap(invoicee, 'isLoading', false)
    invoicee = setIntoMap(invoicee, payload.paxId, invoiceePax)
    orderForBooking = setIntoMap(orderForBooking, 'invoicee', invoicee)
    orders = setIntoMap(orders, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'orders', orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SET_ORDER_BUCKET]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let orders = readValue('orders', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, orders) || getMap({})
    orderForBooking = setIntoMap(orderForBooking, 'bucket', payload.bucket)
    orders = setIntoMap(orders, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'orders', orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SET_IS_NEED_DISTRIBUTION]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let orders = readValue('orders', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, orders) || getMap({})
    orderForBooking = setIntoMap(orderForBooking, 'isNeedDistribution', payload.isNeedDistribution)
    orders = setIntoMap(orders, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'orders', orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  }

})
