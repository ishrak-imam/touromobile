
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

export const TAKE_ORDER_INDIVIDUAL_MODE = 'TAKE_ORDER_INDIVIDUAL_MODE'
export const RESET_PAX_ORDER = 'RESET_PAX_ORDER'
export const SELECT_INVOICEE_INDIVIDUAL_MODE = 'SELECT_INVOICEE_INDIVIDUAL_MODE'

export const TAKE_ORDER_SUMMARY_MODE = 'TAKE_ORDER_SUMMARY_MODE'
export const SELECT_INVOICEE_SUMMARY_MODE = 'SELECT_INVOICEE_SUMMARY_MODE'

export const TAKE_EXTRA_ORDERS_SUMMARY_MODE = 'TAKE_EXTRA_ORDERS_SUMMARY_MODE'

export const RESET_ALL_ORDERS = 'RESET_ALL_ORDER'

export const SYNC_MODIFIED_DATA = 'SYNC_MODIFIED_DATA'
export const SYNC_MODIFIED_DATA_SUCS = 'SYNC_MODIFIED_DATA_SUCS'
export const SYNC_MODIFIED_DATA_FAIL = 'SYNC_MODIFIED_DATA_FAIL'

export const SET_DOWNLOADED_MODIFIED_DATA = 'SET_DOWNLOADED_MODIFIED_DATA'

export const SSN_DATA_REQ = 'SSN_DATA_REQ'
export const SSN_DATA_SUCS = 'SSN_DATA_SUCS'
export const SSN_DATA_FAIL = 'SSN_DATA_FAIL'

export const RESTRUCTURE_MODIFIED_DATA = 'RESTRUCTURE_MODIFIED_DATA'

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

export const takeOrderIndividualMode = createAction(TAKE_ORDER_INDIVIDUAL_MODE)
export const resetPaxOrder = createAction(RESET_PAX_ORDER)
export const selectInvoiceeIndividualMode = createAction(SELECT_INVOICEE_INDIVIDUAL_MODE)

export const takeExtraOrdersSummaryMode = createAction(TAKE_EXTRA_ORDERS_SUMMARY_MODE)

export const takeOrderSummaryMode = createAction(TAKE_ORDER_SUMMARY_MODE)
export const selectInvoiceeSummaryMode = createAction(SELECT_INVOICEE_SUMMARY_MODE)

export const resetAllOrders = createAction(RESET_ALL_ORDERS)

export const syncModifiedData = createAction(SYNC_MODIFIED_DATA)
export const syncModifiedDataSucs = createAction(SYNC_MODIFIED_DATA_SUCS)
export const syncModifiedDataFail = createAction(SYNC_MODIFIED_DATA_FAIL)

export const setDownloadedModifiedData = createAction(SET_DOWNLOADED_MODIFIED_DATA)

export const ssnDataReq = createAction(SSN_DATA_REQ)
export const ssnDataSucs = createAction(SSN_DATA_SUCS)
export const ssnDataFail = createAction(SSN_DATA_FAIL)

export const restructureModifiedData = createAction(RESTRUCTURE_MODIFIED_DATA)
