
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
import Login from '../modules/auth/login'
import TripScreen from '../modules/trips/screen'
import PaxScreen from '../modules/pax/screen'
import ExcursionsScreen from '../modules/excursions/screen'
import ReportsScreen from '../modules/reports/screen'
import FutureTripsScreen from '../modules/trips/futureTripsScreen'
import PastTripsScreen from '../modules/trips/pastTripsScreen'

import RestaurantScreen from '../modules/restaurant/screen'
import ExcursionDetailsScreen from '../modules/excursions/detailsScreen'
import PaxDetailsScreen from '../modules/pax/detailsScreen'
import ProfileScreen from '../modules/profile/screen'
import RollCallScreen from '../modules/rollCall/screen'

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
    Restaurant: { screen: RestaurantScreen },
    ExcursionDetails: { screen: ExcursionDetailsScreen },
    PaxDetails: { screen: PaxDetailsScreen },
    FutureTrips: { screen: FutureTripsScreen },
    PastTrips: { screen: PastTripsScreen },
    Profile: { screen: ProfileScreen },
    RollCall: { screen: RollCallScreen }
  },
  {
    initialRouteName: 'Home',
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
