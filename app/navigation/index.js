
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
import CurrentTripHomeScreen from '../modules/currentTrip/currentTripScreen'
import PaxScreen from '../modules/pax/paxScreen'
import ExcursionsScreen from '../modules/excursions/excursionsScreen'
import ReportsScreen from '../modules/reports/reportsScreen'

import Home from '../modules/home/home'

const authStack = createStackNavigator(
  {
    Signin: { screen: Login }
  },
  {
    initialRouteName: 'Signin',
    headerMode: 'none'
  }
)

const createTabNavigator = isIOS ? createBottomTabNavigator : createMaterialTopTabNavigator

const currentTripTabNav = createTabNavigator(
  {
    CurrentTripHome: { screen: CurrentTripHomeScreen },
    Pax: { screen: PaxScreen },
    Excursions: { screen: ExcursionsScreen },
    Reports: { screen: ReportsScreen }
  },
  {
    initialRouteName: 'CurrentTripHome',
    headerMode: 'none',
    tabBarPosition: 'bottom',
    lazy: false,
    tabBarComponent: ({ navigation, ...options }) => <TabBarComponent navigation={navigation} {...options} />
  }
)

const appStack = createStackNavigator(
  {
    CurrentTrip: { screen: currentTripTabNav },
    Home: { screen: Home }
  },
  {
    initialRouteName: 'CurrentTrip',
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
