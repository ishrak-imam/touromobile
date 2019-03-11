
import { readValue } from '../utils/immutable'
import { store } from '../store'
import { getConnection } from '../selectors'
import { syncModifiedData } from '../modules/modifiedData/action'

const syncData = () => {
  setInterval(() => {
    const connection = getConnection(store.getState())
    const isOnline = readValue('online', connection)
    if (isOnline) {
      store.dispatch(syncModifiedData({}))
    }
  }, 600000)
}

export default syncData
