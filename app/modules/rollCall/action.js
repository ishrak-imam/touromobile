
import { createAction } from '../../utils/reduxHelpers'

export const ADD_TO_PRESENT = 'ADD_TO_PRESENT'
export const REMOVE_FROM_PRESENT = 'REMOVE_FROM_PRESENT'
export const RESET_PRESENT = 'RESET_PRESENT'

export const addToPresent = createAction(ADD_TO_PRESENT)
export const removeFromPresent = createAction(REMOVE_FROM_PRESENT)
export const resetPresent = createAction(RESET_PRESENT)
