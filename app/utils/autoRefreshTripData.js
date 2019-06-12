
import { store } from '../store'
import { getRefreshState, getUser } from '../selectors'
import { actionDispatcher, networkActionDispatcher } from '../utils/actionDispatcher'
import { showModal } from '../modal/action'
import { isYesterday } from 'date-fns'
import { tripsReq } from '../modules/trips/action'
import { refreshTripData, refreshTripDataSucs } from '../modules/app/action'

const autoRefreshTripData = config => {
  const refresh = () => {
    const state = store.getState()

    const cancel = () => {
      actionDispatcher(refreshTripDataSucs({
        time: new Date().toISOString()
      }))
    }

    const ok = () => {
      actionDispatcher(refreshTripData())
      const user = getUser(state)
      networkActionDispatcher(tripsReq({
        isNeedJwt: true,
        guideId: user.get('guideId'),
        isRefreshing: false,
        pendingModal: {
          showWarning: false,
          msg: '',
          onOk: null
        },
        autoRefresh: true
      }))
    }

    const refresh = getRefreshState(state)
    const time = refresh.get('time')

    if (!time || isYesterday(time)) {
      actionDispatcher(showModal({
        type: 'info',
        header: config.header,
        body: config.body,
        text: config.text,
        onOk: ok,
        onCancel: cancel,
        showTimer: true
      }))
    }
  }

  setTimeout(refresh, 2000)
}

export default autoRefreshTripData
