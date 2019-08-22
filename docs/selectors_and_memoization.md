

## Selectors

Selectors are primarily functions with small footprints (generally pure) with responsibility to select data from redux store. In a react redux application we connect our container components to redux store and access data with a `mapStateToProps` function. Selectors plays a role here. The state object passed to the `mapStateToProps` function is passed again to a selector function and necessary sub-tree of the redux store is returned.

This application has separate selector file for each modules placed under `/selectors` directory and memoization is added to the selector functions where necessary.


### Memoization:

Memoization is a special feature of a function to cache previously computed value and return it without computing again if the arguments are same. To achieve this a Cache function (`cache.js`) used. Whenever memoization is needed for a selector function it calls the cache function to receive a closure wrapped around a resolver function which will compute the data. The resolver function is passed to the cache function in first call. Later when calling the returned closure, necessary data and other arguments are passed, upon which the resolver will compute.

As immutable data structure (`Immutable-JS`) is used in this application the deep equality check of an immutable object is inexpensive. Leveraging this the closure returned by cache first checks if computed value is present in memory and arguments are same. Later return either the newly computed value or stored computed value.

This is particularly useful in scenarios when a list is needed to be sorted and the sort function used in multiple places in the application. Now if the function responsible for sorting a list can cache a sorted copy of the list during the first call and later onwards the cached result is returned if the input unsorted list is same, it can help in maintaining a high frame rate of the application by putting less pressure on JavaScript thread.