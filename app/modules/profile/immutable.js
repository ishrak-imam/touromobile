
import { getMap } from '../../utils/immutable'

export const PROFILE_INITIAL_STATE = getMap({
  showLabel: true,
  user: getMap({}),
  isLoading: false,
  updates: null,
  orderMode: 'SUMMARY'
})
