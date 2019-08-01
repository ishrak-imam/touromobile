

## Selectors

Selectors are primarily functions with small footprints (generally pure) with responsibility to select data from redux store. In a react redux application we connect our container components to redux store and access data with a `mapStateToProps` function. Selectors plays a role here. The state object passed to the `mapStateToProps` function is passed again to a selector function and necessary sub-tree of the redux store is returned.

This application has separate selector file for each modules placed under `/selectors` directory and memoization is added to the selector functions where necessary.