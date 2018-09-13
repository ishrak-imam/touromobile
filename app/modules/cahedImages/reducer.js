
import { createReducer } from '../../utils/reduxHelpers'
import { getMap, setIntoMap, mergeMapShallow, readValue } from '../../utils/immutable'

import {
  // CREATE_B64_IMAGE,
  CREATE_B64_IMAGE_SUCS
} from './action'

import { CACHED_IMAGES_INITIAL_STATE } from './immutable'

export const imageCache = createReducer(CACHED_IMAGES_INITIAL_STATE, {
  // [CREATE_B64_IMAGE]: (state, payload) => mergeMapShallow(state, getMap({ isLoading: true })),
  [CREATE_B64_IMAGE_SUCS]: (state, payload) => {
    return mergeMapShallow(state, getMap({
      isLoading: false,
      data: setIntoMap(readValue('data', state), payload.key, payload.value)
    }))
  }
})
