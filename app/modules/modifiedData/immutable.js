
import config from '../../utils/config'

import { getMap } from '../../utils/immutable'

export const MODIFIED_DATA_INITIAL_STATE = getMap({
  lastSyncedTime: null,
  structureVersion: config.version
})
