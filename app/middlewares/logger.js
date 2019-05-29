
import { Logs } from 'expo'
import { getImmutableObject } from '../utils/immutable'

Logs.disableExpoCliLogging()

const isRemoteDebuggingEnabled = (typeof atob !== 'undefined')

const logger = store => next => action => {
  const result = next(action)
  if (isRemoteDebuggingEnabled) {
    console.groupCollapsed('%c ACTION', 'color: grey  ', action.type)
    console.log('%c DISPATCH   :: ', 'color: green', getImmutableObject(action).toJS())
    // console.log('%c NXTSTATE   :: ', 'color: green', store.getState())
    console.log('%c NXTSTATE   :: ', 'color: green', getImmutableObject(store.getState()).toJS())
    console.groupEnd()
  }
  return result
}

export default logger
