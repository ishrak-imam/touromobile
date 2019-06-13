
import { store } from '../store'
import { getRefreshState, getUser, currentTripSelector } from '../selectors'
import { actionDispatcher, networkActionDispatcher } from '../utils/actionDispatcher'
// import { showModal } from '../modal/action'
import { isYesterday } from 'date-fns'
import { tripsReq } from '../modules/trips/action'
import {
  refreshTripData,
  refreshTripDataSucs,
  showAutoRefresh
} from '../modules/app/action'
import _T from '../utils/translator'

export const refresh = (standAlone) => {
  return () => {
    const state = store.getState()
    if (!standAlone) actionDispatcher(refreshTripData())
    const user = getUser(state)
    const current = currentTripSelector(state)
    const currentTrip = current.get('trip')
    networkActionDispatcher(tripsReq({
      isNeedJwt: true,
      guideId: user.get('guideId'),
      isRefreshing: false,
      pendingModal: {
        showWarning: false,
        msg: '',
        onOk: null
      },
      autoRefresh: true,
      currentTrip,
      sucsMsg: _T('dataRefreshSucs'),
      failMsg: _T('dataRefreshFail')
    }))
  }
}

const cancel = () => {
  actionDispatcher(refreshTripDataSucs({
    time: new Date().toISOString()
  }))
}

export const refreshWorker = config => {
  const autoRefresh = () => {
    const state = store.getState()
    const refreshData = getRefreshState(state)
    const time = refreshData.get('time')

    if (!time || isYesterday(time)) {
      actionDispatcher(showAutoRefresh({
        type: 'info',
        header: config.header,
        body: config.body,
        text: config.text,
        onOk: refresh(false),
        onCancel: cancel,
        showTimer: true
      }))
    }
  }

  setTimeout(autoRefresh, 2000)
}
