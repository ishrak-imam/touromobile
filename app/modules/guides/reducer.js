
import { createReducer } from '../../utils/reduxHelpers'
import {
  mergeMapShallow, getMap, getImmutableObject
} from '../../utils/immutable'

import {
  GUIDES_LIST_REQ,
  GUIDES_LIST_SUCS,
  GUIDES_LIST_FAIL
} from './action'

import { GUIDES_LIST_INITIAL_STATE } from './immutable'

export const guides = createReducer(GUIDES_LIST_INITIAL_STATE, {
  [GUIDES_LIST_REQ]: state => mergeMapShallow(
    state,
    getMap({ isLoading: true })
  ),

  [GUIDES_LIST_SUCS]: (state, payload) => mergeMapShallow(
    state,
    getMap({ isLoading: false, data: getImmutableObject(payload) })
  ),

  [GUIDES_LIST_FAIL]: state => mergeMapShallow(
    state,
    getMap({ isLoading: false })
  )
})
