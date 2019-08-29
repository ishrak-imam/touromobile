
## Request Manager

This application stores the total redux store into local storage to provide offline support. Due to that a case can emerge when the application is closed forcefully while it was making a network request. After that when the application is started again the network request is terminated however, the previous loading state while making a request is pulled from the local storage and the UI goes into a forever loading state.

As all the network request actions are channeled through a function `networkActionDispatcher` in `utils/actionDispatcher.js` file, an action `trackRequest` can be dispatched with will store the action object in store and upon success or failure `requestManager` middleware will clear data from store.

Now if the request never succeed or failed or time out due to force application close the requests object will not be cleared. So when the application is started again a simple function `resolvePendingRequests` in `requestManager/service.js` file can pull the `requests` object from store and initiate the pending requests again.

For this workflow to operate properly a convention must be followed. The corresponding action types associated with three stages of a network request (`REQUEST`, `SUCCESS`, `FAIL`) must be suffixed with `_REQ`, `_SUCS`, `_FAIL`.

Example:

- SOME_ACTION_REQ
- SOME_ACTION_SUCS
- SOME_ACTION_FAIL

This pattern must be followed because when a network request is tracked it is cleared later on by the `requestManager` middleware by checking if a `_SUCS` or `_FAIL` suffixed action is dispatched or not.

```
const { type } = action
const requestType = type.slice(0, type.length - 4)
const responseType = type.substring(type.length - 4)
if (responseType === 'SUCS' || responseType === 'FAIL') {
  store.dispatch(releaseRequest({ type: `${requestType}REQ` }))
}
```