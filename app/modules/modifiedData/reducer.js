
import { createReducer } from '../../utils/reduxHelpers'
import {
  setIntoMap, readValue, getMap,
  mergeMapShallow, deleteFromMap
} from '../../utils/immutable'

import {
  MODIFY_PAX_DATA,
  SET_PARTICIPANTS,

  SET_ACCEPT_TRIP,
  SET_ACCEPT_TRIP_COMBOS,

  SET_DEFAULT_COMBOS,

  ACCEPT_TRIP_REQ,
  ACCEPT_TRIP_SUCS,
  ACCEPT_TRIP_FAIL,

  PREPARE_CANCEL_DATA,
  CANCEL_COMBO_VALUES,

  TAKE_ORDER_INDIVIDUAL_MODE,
  RESET_PAX_ORDER,
  SELECT_INVOICEE_INDIVIDUAL_MODE,

  TAKE_ORDER_SUMMARY_MODE,
  SELECT_INVOICEE_SUMMARY_MODE,

  TAKE_EXTRA_ORDERS_SUMMARY_MODE,

  RESET_ALL_ORDERS,

  SYNC_MODIFIED_DATA_SUCS,
  SET_DOWNLOADED_MODIFIED_DATA,

  SSN_DATA_REQ,
  SSN_DATA_SUCS,
  SSN_DATA_FAIL
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
    let modifiedData = readValue(payload.departureId, state)
    let accept = readValue('accept', modifiedData)
    accept = setIntoMap(accept, 'dirty', true)
    accept = setIntoMap(accept, 'acceptedAt', null)
    let direction = readValue(payload.direction, accept) || getMap({})
    direction = setIntoMap(direction, payload.key, getMap(payload.value))
    accept = setIntoMap(accept, payload.direction, direction)
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

  [TAKE_ORDER_INDIVIDUAL_MODE]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let orders = readValue('orders', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, orders) || getMap({})
    let orderForPax = readValue(payload.paxId, orderForBooking) || getMap({})
    let orderForPaxDirection = readValue(payload.direction, orderForPax) || getMap({})
    orderForPaxDirection = mergeMapShallow(orderForPaxDirection, payload.order)
    orderForPax = setIntoMap(orderForPax, payload.direction, orderForPaxDirection)
    orderForBooking = setIntoMap(orderForBooking, payload.paxId, orderForPax)
    orders = setIntoMap(orders, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'orders', orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [RESET_ALL_ORDERS]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let orders = readValue(payload.key, modifiedData) || getMap({})
    orders = setIntoMap(orders, payload.bookingId, getMap({}))
    modifiedData = setIntoMap(modifiedData, payload.key, orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [RESET_PAX_ORDER]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let orders = readValue('orders', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, orders) || getMap({})
    let orderForPax = readValue(payload.paxId, orderForBooking) || getMap({})
    orderForPax = deleteFromMap(orderForPax, payload.direction)
    orderForBooking = setIntoMap(orderForBooking, payload.paxId, orderForPax)
    orders = setIntoMap(orders, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'orders', orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SELECT_INVOICEE_INDIVIDUAL_MODE]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let orders = readValue('orders', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, orders) || getMap({})
    orderForBooking = setIntoMap(orderForBooking, 'invoicee', payload.paxId)
    orders = setIntoMap(orders, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'orders', orders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SELECT_INVOICEE_SUMMARY_MODE]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let ordersSummaryMode = readValue('ordersSummaryMode', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, ordersSummaryMode) || getMap({})
    orderForBooking = setIntoMap(orderForBooking, 'invoicee', getMap(payload.invoicee))
    ordersSummaryMode = setIntoMap(ordersSummaryMode, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'ordersSummaryMode', ordersSummaryMode)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [TAKE_EXTRA_ORDERS_SUMMARY_MODE]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let extraOrders = readValue('extraOrdersSummaryMode', modifiedData) || getMap({})
    extraOrders = setIntoMap(extraOrders, payload.bookingId, payload.extraOrders)
    modifiedData = setIntoMap(modifiedData, 'extraOrdersSummaryMode', extraOrders)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [TAKE_ORDER_SUMMARY_MODE]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let ordersSummaryMode = readValue('ordersSummaryMode', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, ordersSummaryMode) || getMap({})
    let orderForDirection = readValue(payload.direction, orderForBooking) || getMap({})
    let orderForMealType = readValue(payload.mealType, orderForDirection) || getMap({})
    orderForMealType = setIntoMap(orderForMealType, payload.mealId, getMap(payload.order))
    orderForDirection = setIntoMap(orderForDirection, payload.mealType, orderForMealType)
    orderForBooking = setIntoMap(orderForBooking, payload.direction, orderForDirection)
    ordersSummaryMode = setIntoMap(ordersSummaryMode, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'ordersSummaryMode', ordersSummaryMode)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SYNC_MODIFIED_DATA_SUCS]: (state, payload) => {
    return setIntoMap(state, 'lastSyncedTime', payload)
  },

  [SET_DOWNLOADED_MODIFIED_DATA]: (state, payload) => payload,

  [SSN_DATA_REQ]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let ordersSummaryMode = readValue('ordersSummaryMode', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, ordersSummaryMode) || getMap({})
    let invoicee = readValue('invoicee', orderForBooking) || getMap({})
    invoicee = setIntoMap(invoicee, 'isLoading', true)
    orderForBooking = setIntoMap(orderForBooking, 'invoicee', invoicee)
    ordersSummaryMode = setIntoMap(ordersSummaryMode, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'ordersSummaryMode', ordersSummaryMode)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SSN_DATA_SUCS]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let ordersSummaryMode = readValue('ordersSummaryMode', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, ordersSummaryMode) || getMap({})
    let invoicee = readValue('invoicee', orderForBooking) || getMap({})
    invoicee = mergeMapShallow(invoicee, getMap(payload.invoicee))
    invoicee = setIntoMap(invoicee, 'isLoading', false)
    orderForBooking = setIntoMap(orderForBooking, 'invoicee', invoicee)
    ordersSummaryMode = setIntoMap(ordersSummaryMode, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'ordersSummaryMode', ordersSummaryMode)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SSN_DATA_FAIL]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let ordersSummaryMode = readValue('ordersSummaryMode', modifiedData) || getMap({})
    let orderForBooking = readValue(payload.bookingId, ordersSummaryMode) || getMap({})
    let invoicee = readValue('invoicee', orderForBooking) || getMap({})
    invoicee = setIntoMap(invoicee, 'isLoading', false)
    orderForBooking = setIntoMap(orderForBooking, 'invoicee', invoicee)
    ordersSummaryMode = setIntoMap(ordersSummaryMode, payload.bookingId, orderForBooking)
    modifiedData = setIntoMap(modifiedData, 'ordersSummaryMode', ordersSummaryMode)
    return setIntoMap(state, payload.departureId, modifiedData)
  }

})
