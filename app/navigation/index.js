
import React from 'react'
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createDrawerNavigator
} from 'react-navigation'

import isIOS from '../utils/isIOS'

import TabBarComponent from '../components/tabBar'
import DrawerComponent from '../components/drawer'

import LoadingScreen from '../modules/auth/loadingScreen'
import TripsLoadingScreen from '../modules/trips/tripsLoading'
import Login from '../modules/auth/login'
import CurrentTripsScreen from '../modules/trips/currentTripsScreen'
import TripScreen from '../modules/trips/screen'
import PaxScreen from '../modules/pax/screen'
import ExcursionsScreen from '../modules/excursions/screen'
import ReportsScreen from '../modules/reports/screen'
import FutureTripsScreen from '../modules/trips/futureTripsScreen'
import PastTripsScreen from '../modules/trips/pastTripsScreen'
import NoTripsScreen from '../modules/trips/noTrips'

import RestaurantScreen from '../modules/restaurant/screen'
import ExcursionDetailsScreen from '../modules/excursions/detailsScreen'
import PaxDetailsScreen from '../modules/pax/detailsScreen'
import ProfileScreen from '../modules/profile/screen'
import RollCallScreen from '../modules/rollCall/screen'
import OrdersScreen from '../modules/orders/screen'
import SMSScreen from '../modules/sms/screen'

const authStack = createStackNavigator(
  {
    Login: { screen: Login }
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none'
  }
)

const createTabNavigator = isIOS ? createBottomTabNavigator : createMaterialTopTabNavigator

const TripTabs = createTabNavigator(
  {
    Trip: { screen: TripScreen },
    Pax: { screen: PaxScreen },
    Excursions: { screen: ExcursionsScreen },
    Reports: { screen: ReportsScreen }
  },
  {
    initialRouteName: 'Trip',
    headerMode: 'none',
    tabBarPosition: 'bottom',
    lazy: false,
    tabBarComponent: props => <TabBarComponent {...props} />
  }
)

const appStack = createStackNavigator(
  {
    Home: { screen: TripTabs },
    TripsLoading: { screen: TripsLoadingScreen },
    NoTrips: { screen: NoTripsScreen },
    Restaurant: { screen: RestaurantScreen },
    ExcursionDetails: { screen: ExcursionDetailsScreen },
    PaxDetails: { screen: PaxDetailsScreen },
    CurrentTrips: { screen: CurrentTripsScreen },
    FutureTrips: { screen: FutureTripsScreen },
    PastTrips: { screen: PastTripsScreen },
    Profile: { screen: ProfileScreen },
    RollCall: { screen: RollCallScreen },
    Orders: { screen: OrdersScreen },
    SMS: { screen: SMSScreen }
  },
  {
    initialRouteName: 'TripsLoading',
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false
    }
  }
)

const drawerNav = createDrawerNavigator(
  {
    App: { screen: appStack }
  },
  {
    contentComponent: props => <DrawerComponent {...props} />
  }
)

const RootNavigator = createSwitchNavigator(
  {
    AuthLoading: LoadingScreen,
    App: drawerNav,
    Auth: authStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
)

export default RootNavigator
