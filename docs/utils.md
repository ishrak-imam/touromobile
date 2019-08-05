
## Utils

In an application code base we need to isolate certain group of utilities which are used throughout the application. These utilities are simple functions in general and grouped into different files based on the task they perform. Following are the groups:

- **actionDispatcher.js:** This file exports two methods `networkActionDispatcher` and `actionDispatcher`. As the name suggests `networkActionDispatcher` dispatches an action which needs to make an API request and it checks the network status before that. All actions that need an active network connection are dispatched through this function and other generic actions are dispatched through `actionDispatcher` function.

- **assetsCache.js:** Exports a function `cacheAssetsAsync` which caches static expo images and fonts during the application start-up.

- **autoRefreshTripData.js:** The application has a feature of refreshing data from backend every 24 hours. This file exports a method `refreshWorker` when called it initiates a sequence of actions. First of all this method is called whenever the application launches from an inactive or background mode. Then it checks if a data refresh is needed (24 hours have passed since last refresh) and shows a countdown timer though which the user can cancel the refresh within 5 seconds or after 5 seconds it initiates a refresh automatically. This file also exports another function `refresh` upon calling which the application initiates a refresh directly. This is used in the profile section from where the user can initiate a refresh manually and in `refreshWorker` internally.

- **cache.js:** This file simply exports a `cache` function used in creating memoized selectors. Thoroughly discussed in `selectors_and_memoization.md`.

- **comms.js:** Exports necessary methods needed to open other applications like Web, Call, Sms, Map etc.

- **config.js:** An applications can have initial configurations and environment variables and are read from a `config.json` file typically. This file reads the configuration values and exports all the necessary items needed in the application as a single JavaScript object.

- **debounce.js:** As the name suggests this file exports a method which can wrap another method to achieve a debounce behavior.

- **distribution.js:** The application has a feature of distributing orders into multiple invoicees and necessary utility methods needed for this feature are grouped here. Further description will be found in `docs/complex_features/order_distribution.md`.

- **futureTrip.js:** Through this application a guide can accept a future assignment and select reservation preferences. A set of business logic is involved in this process and are grouped into various methods in this file. Further description can be found in `docs/complex_features/guide_reservations.md`.

- **hacks.js:** All the hackish utilities are grouped here. For example we might need a `supplant` method added to the prototype of a String class. These are added here and this file is simply imported at the start of the application like `import './app/utils/hacks'` in `App.js`.

- **immutable.js** Immutable js wrapper methods described in `docs/immutable_data_structure_usage.md` are exported from this file.

- **initialState.js:** Exports a `getInitialState` method which returns an initial state object of the application. Whenever a new module with it's own reducers and slice of a state tree is added a new property must be added in the object being returned from the `getInitialState` method.

- **isEmpty.js:** Exports `isEmpty` method which checks if a javascript object is an empty object.

- **modifiedDataRestructure.js:** As the application stores all the generated data locally any change in data structure must be considered for backward compatibility and necessary methods are exported from this file. Further description can be found in `docs/complex_features/modified_data_restructure.md`

- **modifiedDataSync.js:** The app syncs all the locally generated data with backend in every 10 minutes which is done by the `startSyncData` exported from here.

- **persist.js:** Exports expo `SecureStore` utilities to the application.

- **reduxHelpers.js:** Exports two methods `createAction` and `createReducer` which are used in creating actions and reducers.

- **request.js:** This file exposed the http request utilities using `fetch` and logs http requests when necessary.

- **sagaHelpers.js:** Exports custom saga effects like `takeFirst` and an `eventEmitterChannel` to wrap any event based functionality like monitoring application status (background/foreground) or network status (online/offline).

- **sentry.js:** Sentry user context is set using `setSentryUser` method exported from this file. Further details can be found in `sentry_config_and_workflow.md` file.

- **stringHelpers.js:** String manipulation utilities like regex check, string shorten, creating hash from string, getting extension form file name etc. are exported from this file.

- **translator.js:** Exports a `translator` method which translates the static texts of the application into appropriate language based on locale.