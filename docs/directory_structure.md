## Directory Structure

The application resides in the `app` directory and following is a detailed structure of directories and sub-directories inside `app`.

```
app
|___components
|   |___imageCache
|   |   |___action.js
|   |   |___immutable.js
|   |   |___index.js
|   |   |___reducer.js
|   |   |___saga.js
|   |___component-1.js
|   |___component-2.js
|   ....
|   |___component-n.js
|___connection
|___i18n
|___images
|___middlewares
|   |___middleware-1.js
|   |___middleware-2.js
|   ....
|   |___middleware-n.js
|___mockData
|___modal
|___modules
|   |___module-1
|   |   |___action.js
|   |   |___api.js
|   |   |___immutable.js
|   |   |___reducer.js
|   |   |___saga.js
|   |   |___screen.js (main screen)
|   |   |___<other_screen-1>.js
|   |   |___<other_screen-2>.js
|   |   ...
|   |   |___<other_screen-n>.js
|   |___module-2
|   ....
|   |___module-n
|___navigation
|   |___action.js
|   |___immutable.js
|   |___reducer.js
|   |___saga.js
|   |___Service.js
|___selectors
|   |___selector-1.js
|   |___selector-2.js
|   ....
|   |___selector-n.js
|   |___index.js
|___store
|   |___filesystem.js
|   |___index.js
|   |___rootReducer.js
|   |___rootSaga.js
|___theme
|   |___colors.js
|   |___icons.js
|   |___images.js
|   |___index.js
|___toast
|___utils
|   |___utility_file-1.js
|   |___utility_file-2.js
|   ....
|   |___utility_file-n.js
```

The structure above is a detailed map of how the directories and files are organized followed by detailed description of individual directories and what type of files are grouped under those.


**components:** All the reusable components which are not connected directly to a navigation screen are placed under this directory. Components here can be a redux connected component or a dumb presentational component. A more complex component for caching images which the app receives over network is also placed here. Detailed explanation about this can be found in separate `image_cache.md` file.

**connection:** This directory is a module itself serving the purpose of monitoring the network connection status (online/offline) of the device and updating respective values like network status and connection type into the redux store.

**i18n:** Files in this directory manages the internationalization process of static texts used in the app.


**images:** Static images such as background, placeholder images, logos are placed in this directory.

**middlewares:** Apart from the basic logger middleware this application manages a significant amount business logic through redux-middlewares and all of them are placed here which are exported from a single point in the `index.js` file. More detailed explanation can be found in the separate `middlewares.md` file.

**mockData:** In order to minimize dependency of the backend during development api responses are mocked here. In dev environment the app will not initiate any api request rather collect necessary data from json files placed in this directory.

**modal:** This is also an independent module serving the need of showing various modals such as warning, info, selection in the app. More detailed explanation can be found in separate `modals_and_toast.md` file.

**modules:** This directory contains different modules of the application as sub-directories. Usually a module is a screen which can be navigated to. In other words they are the container or smart components. A module can have one or more screens connected to the navigation stack along with other files line api, saga, reducer etc. Detailed description of structure of a module can be found in separate `module_structure.md` file.

**navigation:** This can be treated as the navigation module of the application where all the navigation configuration of the application resides.

**selectors:** Connected components need to read data from redux store but they don't do it directly in this application. In the mapStateToProps method selector functions (pure functions returning specific values from redux store) are passed. Thus reusability is ensured when multiple connected component needs same data from redux store and memoization can be applied in selector functions. Detailed description can be found in separate `selectors_and_memoization.md` file.

**store:** Redux store related configuration files resides here. Detailed description on how the store is created and managed can be found in combination of following files. `offline_data_store.md`, `redux_and_redux_saga_wiring.md`, `immutable_data_structure_usage.md`.

**theme:** Colors and Icons related configurations along with static image object files resides in this directory.

**toast:** Similar to a module with necessary files used to show toast notifications.

**utils:** contains all the utility methods like generic action dispatcher, selector cache, string helpers etc grouped into multiple files based on the type of utility the functions provides. Detail description will be found in separate `utils.md` file.