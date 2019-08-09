
## Module Structure

Features in this application are expressed as modules such as Trip, Orders, Reports etc. these are independent modules. A module can vary from another in terms of responsibility and complexity. A module will have at least one or more than one screens connected to the navigation stack.

Based on responsibility and complexity a module can consist of different files. For example,

- **action.js:** Groups all the redux actions needed to be performed by a module.
- **api.js:** A module can make multiple API requests which are grouped in this file.
- **immutable.js:** Each module will have it's own sub-tree in the redux store and initial immutable data structure of that module will be declared here and passed to the respective reducer.
- **reducer.js:** Each module will have it's own reducers grouped in this file.
- **saga.js:** As `redux-saga` is used to manage async operations in this application, all the sagas needed by a module will be grouped in this file.
- **scree.js** Each module has a primary screen connected to navigation stack. However, a module can have multiple other screens as required for better organization.