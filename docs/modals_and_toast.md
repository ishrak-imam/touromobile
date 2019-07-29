## Modals and Toast

### Modal:

Modals are independent pieces of UI controlled from different part of the application in order to provide user a convenient way to interact with the app or show information and warnings. In this app modals are categorized into types like following.
1. Information: Shows information to the user and terminates on OK press.
2. Warning: Asks confirmation from user before initiating any irreversible action and terminates and initiates action on Cancel and Ok press respectively.
3. Selection: Presents user a list of options to select from.
4. Distribution: This is a special modal providing a convenient way of distributing orders into multiple invoicees.

### Modal workflow:

- Following components are mounted initially at the root level of the application (App component in `App.js` file).
```
  <InfoModal />
  <WarningModal />
  <SelectionModal />
  <DistributionModal />
```

- When a modal is needed to be shown a redux action is dispatched with necessary payload.
```
{
  onOk: f(),
  onCancel: f(),
  type: 'warning/info/selection/distribution'
}
```

- Based on the `type` value in payload modal data is stored with specific keys in the redux store and each modal component mounted before listens for it's respective data in store and activated.
```
modal: {
  info: {},
  warning: {},
  selection: {},
  distribution: {}
}
```

- After that user performs necessary interactions in the modal.

----

### Toast:

Toast is a small piece of utility used only to show user a notification without blocking any other user interaction. In this application `NativeBase` toast is used.

### Toast workflow:

- As instructed in the `NativeBase` documentation the main component of the application is wrapped with a `Root` component from `NativeBase`. Please refer to the file `App.js`.

- Now a preregistered saga listens for a `showToast` action.

- When `showToast` action dispatched the toast message is pulled from the payload and native base's toast method is called like following. Please refer the file `toast/toast.js`
```
import {Toast} from 'native-base'

const displayToast = message => {
  Toast.show({
    text: message,
    buttonText: 'Ok'
  })
}
```

