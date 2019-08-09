
## Navigation

Apps initialized with expo uses `react-navigation` by default. In this application navigation is considered as a separate module having it's own reducers, actions, sagas etc.

In this application screen tracking is added through `onNavigationStateChange` prop and whenever user navigates to a screen necessary information is tracked in redux store.

Ideally `react-navigation` passes a navigator instance as a prop to every component mounted as a screen in the navigation stack and screen to screen navigation is done using that instance from a react component. However, sometimes it is needed to perform screen navigation from out side a react component. That's why when the navigation component is mounted a reference of the navigator instance is cached through
```
ref={navigatorRef => setNavigator(navigatorRef)}
```
and `setNavigator` is a method exported by `navigation/service.js` file which stores a copy of the navigation instance for later use. The file also exports `navigate`, `navigateBack`, `resetToScene` these methods which can be used to perform necessary navigation actions from outside a react component.