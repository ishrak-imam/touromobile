
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
import TripScreen from '../modules/trip/screen'
import PaxScreen from '../modules/pax/screen'
import ExcursionsScreen from '../modules/excursions/screen'
import ReportsScreen from '../modules/reports/screen'

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
    tabBarComponent: ({ navigation, ...options }) => <TabBarComponent navigation={navigation} {...options} />
  }
)

const appStack = createStackNavigator(
  {
    Home: { screen: TripTabs }
  },
  {
    initialRouteName: 'Home',
    mode: 'modal',
    headerMode: 'none'
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

const Navigator = createSwitchNavigator(
  {
    AuthLoading: LoadingScreen,
    App: drawerNav,
    Auth: authStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
)

export default Navigator
