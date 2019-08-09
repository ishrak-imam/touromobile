
## Redux Saga:

In this application `redux-saga` library is used to manage all the asynchronous operations and some synchronous operations as well. Redux-saga is a very interesting project as it used the ES6 generator functions under the hood.

The simplified philosophy which is adopted for using saga in this application is a watcher saga will listen for an action and fork/spawn a worker saga to perform that action. However, this application only uses the fork pattern and before we get to why let's shed some light on what fork and spawn mean.

Explanations are in terms of redux-saga's working principle.

- Fork: Forking means creating a new child process which is attached to the parent, meaning the parents next course of action will depend on the success or failure of child. Also every exception will bubble up from the child to the parent and can be caught in the parent. Parent will stop further execution if a forked child fails.

- Spawn: Spawning means creating a new child process which is not attached to the parent. So the parent process will not be able to catch any exception of a child and continue further execution upon child's success or failure.

In this application fork pattern is used inside a watcher/worker pattern. Any particular asynchronous operation is expressed as a saga which has two parts (watcher and worker). Now only the watcher sagas are exported from respective files and are forked in parallel. Please refer the file `store/rootSaga.js`. Each watcher saga can fork a worker saga when appropriate action is dispatched. As fork pattern is used because, when a saga fails the total saga middleware will stop. This is intentional because we want the application to stop if there's any problem and investigate which would be harder if spawn pattern was used as the application would not stop and parent sagas would continue execution.


### Usage with redux:

As redux saga registers all the sagas as middlewares we first need to create a SagaMiddleware by calling a function `createSagaMiddleware` provided by redux-saga and make it the first of all the registered redux middlewares. After that we just need to do

```
SagaMiddleware.run(rootSaga)
```

Here `rootSaga` is all the watcher sagas forked in parallel. For further description please refer to redux-saga documentation.