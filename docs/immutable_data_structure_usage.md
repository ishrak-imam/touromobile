
## Immutable Data Structure:

If redux is used for state management in an application reducers can not mutate any data. This convention must be followed for the application to work.

Now immutability in an application comes with a cost. The reducers must be pure functions, meaning immutable update patterns must be followed and while doing that the cost of copying data to produce a new reference comes into play. The library `immutable-js` tries to address this problem by focusing structural sharing while copying. For further description on how `immutable-js` works please refer to it's respective documentation.

In this application the global state is a plain javascript object and starting from first level properties and onwards all are immutable-js instances of Maps, Sets, Lists etc. Each module in this application if it has it's own subset of the state tree then it has an `immutable.js` file where an initial representation of how this module's data structure looks like can be found.


### utils/immutable.js

No immutable-js methods are used directly in this application rather through a thin wrapper which can be found in `utils/immutable.js` file. The wrapper is nothing more than a collection of custom functions which expose certain functionalities of immutable-js library to the application. This is done in order to make the process of opting out of using immutable-js easier. No reducers are needed to be changed, only this wrapper methods needs to operate on plain JavaScript objects. Also this wrapper gives an idea of what immutable-js features are being used in this application. If any new immutable-js feature is needed it is recommended that a wrapper method is created here first and use the feature through this wrapper in the application.