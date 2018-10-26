
import { getMap } from '../utils/immutable'

export const MODAL_INITIAL_STATE = getMap({
  warning: getMap({}),
  selection: getMap({})
})
