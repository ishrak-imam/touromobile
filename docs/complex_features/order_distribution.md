
## Order Distribution

Order distribution is one of the important features of this application. The users of this application can take orders from passengers grouped under different bookings. Generally the orders are categorized under meal order, excursion orders and extra orders. Meal orders include both food item orders and drink orders.

Consider a scenario where all the orders are taken and an invoicee is selected who will be billed for all the orders. Now if the group of passengers decides that there will be more than one invoicees i.e. they will share the billed amount among them. The sharing can be in two different ways. One is all the invoicees share all the order items or sharing based on particular order item, meaning one invoicee can choose to pay for all the excursion orders and other invoicee can go for all the meal orders.

So the application needs to provide some sort of bucket mechanism from where the guide can distribute the order items as per passenger demand. The application uses the `addItemsToBucket.js` and `invoiceeMonitor.js` middlewares to manage this process.


### invoiceeMonitor.js

This middleware monitors the following actions and works accordingly.
```
SELECT_INVOICEE
DELETE_INVOICEE
```

- **SELECT_INVOICEE:** Monitors this action to track when the number of invoicee is getting more than one and if so the middleware creates a bucket object with all the order items and make it available for distribution among the invoicees.

- **DELETE_INVOICEE:** Monitors this action to track when an invoicee is deleted and if that invoicee had any distributed orders the middleware puts them in the bucket object making them ready for redistribution. Also if the number of invoicees drops to one the middleware deletes the bucket object.



### addItemsToBucket.js

This middleware monitors the following actions and works accordingly.
```
  TAKE_EXTRA_ORDER
  SET_PARTICIPANTS
  TAKE_ORDER
  TAKE_ALLERGY_ORDER
  SET_ALLERGY_ORDER
```
All the actions above are responsible for taking different type of orders and in simple terms taking an order is just an increment or decrement in number of meal items and adding or removing participants in excursion.

The responsibility of this middleware is a bit different as it needs to work under following conditions.

The common condition is that it performs any type of actions if the number of invoicees are more then one. Others are:

1. If a new order is taken the middleware makes it ready in the bucket object for distribution.

2. If an order is removed which is already distributed the middleware removes it from the individual bucket of the respective invoicee.

3. If an order is removed which is not distributed yet the middleware removes it from the bucket object.


### utils/distribution.js

This file exposes an utility method `checkIfAllDistributed` which is called on every distribution and it let's the app know if all the items in the bucket is distributed or not through a boolean value.