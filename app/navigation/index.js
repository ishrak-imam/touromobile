
import React from 'react'
import {
  createStackNavigator,
  createSwitchNavigator,
  createTabNavigator,
  createDrawerNavigator
} from 'react-navigation'

import TabBarComponent from '../components/tabBarComponent'
import DrawerComponent from '../components/drawer'

import LoadingScreen from '../modules/auth/loadingScreen'
import Login from '../modules/auth/login'
import CurrentTripHomeScreen from '../modules/currentTrip/currentTripScreen'
import PassengersScreen from '../modules/passengers/passengersScreen'
import ExcursionsScreen from '../modules/excursions/excursionsScreen'
import ReportScreen from '../modules/report/reportScreen'

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

const currentTripTabNav = createTabNavigator(
  {
    CurrentTripHome: { screen: CurrentTripHomeScreen },
    Passengers: { screen: PassengersScreen },
    Excursions: { screen: ExcursionsScreen },
    Report: { screen: ReportScreen }
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
