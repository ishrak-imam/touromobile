
import { createAction } from '../utils/reduxHelpers'

export const NAVIGATE_TO_SCENE = 'NAVIGATE_TO_SCENE'
export const CURRENT_SCREEN = 'CURENT_SCREEN'

export const navigateToScene = createAction(NAVIGATE_TO_SCENE)
export const setCurrentScreen = createAction(CURRENT_SCREEN)
