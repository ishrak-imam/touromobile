
## Offline Data Store

Since the application needs to be working seamlessly even without an active network connection, API data and application generated data must be stored locally.

In order to achieve that `redux-persist` package is used to store the entire redux store in local storage so that when the application starts again stored data can be reused.

Redux-persist package dumps a stringified version of the store object into the storage option configured upon every action dispatched. This naive approach is optimized by throttling and implementing other techniques. During application start-up redux-persist tries to hydrate the state tree by retrieving data from local storage. Please refer to `redux-persist` documentation if further understanding is needed.

### Data storage:

While configuring storage option for redux-persist this application faced a challenge in terms of amount of data needed to be stored. In case of large amount of data react-natives `AsyncStorage` functionality doesn't works well. SQLite storage offered by `expo` was then used and it also failed quickly because the total data was being stored in a single cell of a table and it fails when the maximum limit is reached.

To address these problems file system storage was introduced. Its a simple object having methods `getItem`, `setItem` and `clearData` which are needed for redux-persist. The storage engine uses the expo FileSystem module and stringified store data is placed in a .json file in expo document directory provided by expo file system.

