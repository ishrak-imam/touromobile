
import { createAction } from '../utils/reduxHelpers'

export const SHOW_MODAL = 'SHOW_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'

export const showModal = createAction(SHOW_MODAL)
export const closeModal = createAction(CLOSE_MODAL)
