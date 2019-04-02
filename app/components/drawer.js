
import React, { Component } from 'react'
import {
  Container, View, Text,
  Footer, ListItem, Body, Right
} from 'native-base'
import {
  StyleSheet, Image,
  TouchableOpacity, ScrollView
} from 'react-native'
// import { StackActions, NavigationActions } from 'react-navigation'
import { Colors, Images, IonIcon } from '../theme'
import isIphoneX from '../utils/isIphoneX'
import { connect } from 'react-redux'
import { logoutReq } from '../modules/auth/action'
import { clearLocalData } from '../modules/app/action'
import { actionDispatcher } from '../utils/actionDispatcher'
import Badge from '../components/badge'
import {
  getLogin,
  getNavigation,
  pendingStatsUploadCount,
  remainingFutureTripsCount,
  // getTrips,
  currentTripSelector,
  futureTripsSelector,
  pendingSmsCount
} from '../selectors'
import _T from '../utils/translator'
import config from '../utils/config'

// import { showModal } from '../modal/action'

const menuItems = [
  { routeName: 'Trip', text: 'currentTrip', icon: 'home' },
  { routeName: 'FutureTrips', text: 'futureTrips', icon: 'futureTrips' },
  { routeName: 'PastTrips', text: 'pastTrips', icon: 'pastTrips' },
  { routeName: 'PendingSms', text: 'pendingSms', icon: 'sms' }
]

class TMDrawer extends Component {
  _logOut = () => {
    actionDispatcher(logoutReq())
  }

  _showWarning = () => {
    // actionDispatcher(showModal({
    //   type: 'warning',
    //   text: 'Modified trip data will be lost permanently.',
    //   onOk: this._logOut
    // }))
    this._logOut()
  }

  _toProfile = () => {
    const { navigation, currentTrip } = this.props
    const departureId = currentTrip.get('has') ? String(currentTrip.get('trip').get('departureId')) : null
    navigation.navigate('Profile', { departureId })
  }

  _renderVersionNumber = () => {
    return (
      <View style={ss.version}>
        <Text style={ss.versionText}>{config.version}</Text>
      </View>
    )
  }

  _renderHeader = () => {
    const { user } = this.props
    const fullName = `${user.get('firstName')} ${user.get('lastName')}`
    return (
      <View style={ss.header}>
        {this._renderVersionNumber()}
        <View style={ss.headerContent}>
          <Image
            style={ss.drawerImage}
            source={Images.logo}
          />
          <TouchableOpacity onPress={this._toProfile} style={ss.headerName}>
            <IonIcon name='settings' size={20} color={Colors.silver} />
            <Text style={ss.headerNameText}>{fullName}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _onMenuItemPress = item => {
    const { navigation } = this.props
    return () => {
      const currentRoute = this.props.nav.get('screen')
      if (item.routeName === currentRoute) {
        navigation.closeDrawer()
        return
      }
      if (item.routeName === 'Trip') {
        // const navigateAction = NavigationActions.navigate({
        //   routeName: 'Home',
        //   action: NavigationActions.navigate({ routeName: 'Trip' })
        // })
        // const resetAction = StackActions.reset({
        //   index: 0,
        //   actions: [navigateAction]
        // })
        // navigation.dispatch(resetAction)
        // return

        navigation.goBack('Home')
      }
      navigation.navigate(item.routeName)
    }
  }

  _renderMenuItems = () => {
    const { pendingUploadCount, remainingFutureTrips, pendingSmsCount, currentTrip, futureTrips } = this.props
    const hasCurrentTrip = currentTrip.get('has')
    const hasFutureTrips = futureTrips.get('has')
    return menuItems.map((item, index) => {
      const { icon, routeName, text } = item
      const currentRoute = this.props.nav.get('screen')

      const isSelected = routeName === currentRoute
      const isDisabled = (!hasCurrentTrip && routeName === 'Trip') ||
                          (!pendingSmsCount && routeName === 'PendingSms') ||
                          (!hasFutureTrips && routeName === 'FutureTrips')

      let backgroundColor = 'transparent'
      let color = Colors.black
      let onPress = this._onMenuItemPress(item)

      if (isSelected) {
        backgroundColor = Colors.blue
        color = Colors.silver
      }

      if (isDisabled) {
        backgroundColor = 'transparent'
        color = Colors.steel
        onPress = null
      }

      return (
        <ListItem style={[ss.menuItem, { backgroundColor }]} key={index} onPress={onPress}>
          <IonIcon name={icon} style={ss.icon} color={color} />
          <Body>
            <Text style={{ color }}>{_T(text)}</Text>
          </Body>
          <Right>
            {
              (routeName === 'PastTrips' && !!pendingUploadCount) &&
              <Badge type='warning'><Text style={ss.badgeText}>{pendingUploadCount}</Text></Badge>
            }
            {
              (routeName === 'FutureTrips' && !!remainingFutureTrips) &&
              <Badge type='warning'><Text style={ss.badgeText}>{remainingFutureTrips}</Text></Badge>
            }
            {
              (routeName === 'PendingSms' && !!pendingSmsCount) &&
              <Badge type='warning'><Text style={ss.badgeText}>{pendingSmsCount}</Text></Badge>
            }
          </Right>
        </ListItem>
      )
    })
  }

  _clearData = async () => {
    actionDispatcher(clearLocalData())
  }

  _renderClearData = () => {
    return (
      <ListItem style={ss.menuItem} key={'del'} onPress={this._clearData}>
        <IonIcon name='delete' style={ss.icon} color={Colors.black} />
        <Body>
          <Text>Clear local data</Text>
        </Body>
      </ListItem>
    )
  }

  _renderMenu = () => {
    return (
      <ScrollView contentContainerStyle={{ marginVertical: 10 }}>
        {this._renderMenuItems()}
        {config.isDev && this._renderClearData()}
      </ScrollView>
    )
  }

  _renderFooter = () => {
    return (
      <Footer style={ss.footer}>
        <TouchableOpacity style={ss.footerContainer} onPress={this._showWarning}>
          <IonIcon name='logout' style={ss.icon} />
          <Text>{_T('logout')}</Text>
        </TouchableOpacity>
      </Footer>
    )
  }

  render () {
    return (
      <Container>
        {this._renderHeader()}
        {this._renderMenu()}
        {this._renderFooter()}
      </Container>
    )
  }
}

const stateToProps = state => ({
  user: getLogin(state).get('user'),
  nav: getNavigation(state),
  pendingUploadCount: pendingStatsUploadCount(state),
  pendingSmsCount: pendingSmsCount(state),
  remainingFutureTrips: remainingFutureTripsCount(state),
  // trips: getTrips(state)
  currentTrip: currentTripSelector(state),
  futureTrips: futureTripsSelector(state)
})

export default connect(stateToProps, null)(TMDrawer)

const ss = StyleSheet.create({
  header: {
    height: 200,
    backgroundColor: Colors.blue
  },
  headerName: {
    flexDirection: 'row'
  },
  headerNameText: {
    color: Colors.silver,
    marginLeft: 10
  },
  headerContent: {
    flex: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 50
  },
  version: {
    position: 'absolute',
    top: isIphoneX ? 40 : 30,
    bottom: 0,
    left: 10,
    right: 0
  },
  versionText: {
    fontSize: 12,
    color: Colors.white
  },
  footer: {
    backgroundColor: Colors.snow,
    height: 60
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: isIphoneX ? 30 : 0
  },
  icon: {
    marginHorizontal: 20
  },
  drawerImage: {
    alignSelf: 'center',
    height: 70,
    width: 70
  },
  menuItem: {
    marginLeft: 0
  },
  badgeText: {
    color: Colors.silver
  }
})
