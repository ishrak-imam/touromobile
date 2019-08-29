## Middlewares

Middlewares in this application are conventional redux middlewares having the following signature
```
const middlewareFunction => store => next => action => {
  return next(action)
}
```

Since a particular middleware can be activated by passing specific values in the payload or tracking particular action type, it can be used to isolate business logic. All the middlewares in this application and their purpose are described below.

**addItemsToBucket:** In this application when a guide takes orders (meals/excursions) sometimes it is needed to split the orders into more than one invoicees. In this scenario if more then one invoicees are selected the orders must be accumulated into a different object (bucket) from where it can be distributed among the individual buckets of the invoicees. Also after initial distribution if more or changed orders are requested then this middlware will manage inserting and removal of the items from the bucket and make the bucket available for distribution again. The middleware will track specific actions (order taking actions) and change the bucket object accordingly.

**attachJwt:** Whenever the application dispatches a network request a JWT might be needed in the request payload which can be found in the redux store. However, picking the JWT and attaching it with the payload every time the app needs to make a network request is a tedious process. Instead the app adds a flag `isNeedJwt: true` with the action payload and this middleware looks for this flag in the payload and picks up the JWT from redux store to attach with request payload.

**clearAccommodation:** In case of guide reservation if transfer options is selected to `No Transfer` then the app needs to clear any previously selected accommodation value. This middleware keeps an eye on the transfer selection value and works accordingly.

**clearBag:** This middleware works same as the previous one. Clears the bag selection value in guide reservation. The logic is if Education trip is selected in `Home` direction then there will be no value for bag in `Out` direction and vice versa.

**clearTransferCity:** Concept is same as the previous one. The are two sets of transfer cities. One is for transfer option `Direct` and other is for transfer option `Overnight`. Now if transfer option `Direct` is selected and transfer city is selected accordingly and after that transfer option is change `Overnight` the previous transfer city selection needs to cleared which this middleware does.

**invoiceeMonitor:** Consider a scenario of a booking which has more the one invoicee and the orders are already distributed among the invoicees. Now the invoicee might change (delete/add new) and the orders distributed to his/her bucket must be available again in the main bucket for re-distribution. This middleware monitors for this case and works accordingly.

**requestManager:** Whenever a network request is made the application keeps track of that by simply holding a copy of the dispatched action in `requests` object of redux store. This middleware release the corresponding tracked request upon success or failure. This is introduced because of a scenario explained in `complex_features/request_manager.md` file.

**setSentryUser:** This middleware decouples the sentry user context set-up from the main application flow. It looks for the login success action and set-up sentry user context when it supposed to. Further details can be found in `docs/sentry_config_and_workflow.md` file.

**syncData:** A backend data sync action id dispatched every ten minutes from the app. Using this middleware the app only dispatches the action that a sync is needed now. The rest of the work of preparing the data and attaching with payload is done by this middleware by monitoring for the sync data action type.

**toast:** To show a toast notification the app doesn't need to dispatch `showToast` action from everywhere it's needed. Usually toast notifications are shown in an app to let the user know some information which is caused by a previous action success or fail action. Now the app just attaches additional data in the previous action (success/fail) payload like following.
````
payload: {
  ....
  toast: true,
  message: 'Some toast message'
}
````

And the toast middleware tracks the toast boolean flag and dispatches a `showToast` action with the message as payload.

**toggleAcceptSave:** In guide reservation section the Save/Cancel buttons need to remain disabled until the reservation selection satisfies the business logic. This middleware checks the reservation selections whenever any change in selection or new selection is made and decides to enable or disable the Save/Cancel buttons of the reservations sections.