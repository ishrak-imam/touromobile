
import { createAction } from '../utils/reduxHelpers'

export const NAVIGATE = 'NAVIGATE'
export const CURRENT_SCREEN = 'CURENT_SCREEN'

export const navigate = createAction(NAVIGATE)
export const setCurrentScreen = createAction(CURRENT_SCREEN)
