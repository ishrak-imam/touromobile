
import { createAction } from '../utils/reduxHelpers'

export const TRACK_REQUEST = 'TRACK_REQUEST'
export const RELEASE_REQUEST = 'RELEASE_REQUEST'

export const trackRequest = createAction(TRACK_REQUEST)
export const releaseRequest = createAction(RELEASE_REQUEST)
