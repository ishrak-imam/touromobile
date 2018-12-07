
import { createAction } from '../../utils/reduxHelpers'

export const MODIFY_PAX_DATA = 'MODIFY_PAX_DATA'
export const SET_PARTICIPANTS = 'SET_PARTICIPANTS'

export const ACCEPT_TRIP_REQ = 'ACCEPT_TRIP_REQ'
export const ACCEPT_TRIP_SUCS = 'ACCEPT_TRIP_SUCS'
export const ACCEPT_TRIP_FAIL = 'ACCEPT_TRIP_FAIL'

export const SET_ACCEPT_TRIP = 'SET_ACCEPT_TRIP'
export const SET_ACCEPT_TRIP_COMBOS = 'SET_ACCEPT_TRIP_COMBOS'

export const SET_DEFAULT_COMBOS = 'SET_DEFAULT_COMBOS'

export const PREPARE_CANCEL_DATA = 'PREPARE_CANCEL_DATA'
export const CANCEL_COMBO_VALUES = 'CANCEL_COMBO_VALUES'

export const TAKE_ORDER = 'TAKE_ORDER'
export const SELECT_INVOICEE = 'SELECT_INVOICEE'

export const modifyPaxData = createAction(MODIFY_PAX_DATA)
export const setParticipants = createAction(SET_PARTICIPANTS)

export const acceptTripReq = createAction(ACCEPT_TRIP_REQ)
export const acceptTripSucs = createAction(ACCEPT_TRIP_SUCS)
export const acceptTripFail = createAction(ACCEPT_TRIP_FAIL)

export const setAcceptTrip = createAction(SET_ACCEPT_TRIP)
export const setAcceptTripCombos = createAction(SET_ACCEPT_TRIP_COMBOS)

export const setDefaultCombos = createAction(SET_DEFAULT_COMBOS)

export const prepareCancelData = createAction(PREPARE_CANCEL_DATA)
export const cancelComboValues = createAction(CANCEL_COMBO_VALUES)

export const takeOrder = createAction(TAKE_ORDER)
export const selectInvoicee = createAction(SELECT_INVOICEE)
