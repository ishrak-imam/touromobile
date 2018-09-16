
import { createReducer } from '../../utils/reduxHelpers'
import { getMap, mergeMapShallow, readValue, addToSet } from '../../utils/immutable'

import {
  DOWNLOAD_IMAGE_SUCS
} from './action'

import { IMAGE_CACHE_INITIAL_STATE } from './immutable'

export const imageCache = createReducer(IMAGE_CACHE_INITIAL_STATE, {
  [DOWNLOAD_IMAGE_SUCS]: (state, payload) => mergeMapShallow(state, getMap({
    data: addToSet(readValue('data', state), payload.imageName)
  }))
})
