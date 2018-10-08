
import { createReducer } from '../../utils/reduxHelpers'
import { setIntoMap } from '../../utils/immutable'

import {
  UPLOAD_STATS_REQ,
  UPLOAD_STATS_SUCS,
  UPLOAD_STATS_FAIL
} from './action'

import { REPORTS_INITIAL_STATE } from './immutable'

export const reports = createReducer(REPORTS_INITIAL_STATE, {
  [UPLOAD_STATS_REQ]: state => setIntoMap(state, 'isLoading', true),
  [UPLOAD_STATS_SUCS]: state => setIntoMap(state, 'isLoading', false),
  [UPLOAD_STATS_FAIL]: state => setIntoMap(state, 'isLoading', false)
})
