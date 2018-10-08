
import { createAction } from '../../utils/reduxHelpers'

export const MODIFY_PAX_DATA = 'MODIFY_PAX_DATA'
export const SET_PARTICIPANTS = 'SET_PARTICIPANTS'

export const modifyPaxData = createAction(MODIFY_PAX_DATA)
export const setParticipants = createAction(SET_PARTICIPANTS)
