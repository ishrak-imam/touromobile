
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
  pendingStatsUploadCount
  // getTrips,
} from '../selectors'
import Translator from '../utils/translator'
import config from '../utils/config'

// import { showModal } from '../modal/action'

const _T = Translator('DrawerScreen')

const menuItems = [
  { routeName: 'Trip', text: 'currentTrip', icon: 'home' },
  { routeName: 'FutureTrips', text: 'futureTrips', icon: 'futureTrips' },
  { routeName: 'PastTrips', text: 'pastTrips', icon: 'pastTrips' }
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
    const { navigation } = this.props
    navigation.navigate('Profile')
  }

  _renderHeader = () => {
    const { user } = this.props
    const fullName = `${user.get('firstName')} ${user.get('lastName')}`
    return (
      <View style={ss.header}>
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
    const { pendingUploadCount } = this.props
    // const hasFutureTrips = trips.getIn(['future', 'has'])
    return menuItems.map((item, index) => {
      const { icon, routeName, text } = item
      const currentRoute = this.props.nav.get('screen')

      const isSelected = routeName === currentRoute
      // const isDisabled = !hasFutureTrips && routeName === 'FutureTrips'

      let backgroundColor = 'transparent'
      let color = Colors.black
      let onPress = this._onMenuItemPress(item)

      if (isSelected) {
        backgroundColor = Colors.blue
        color = Colors.silver
      }

      // if (isDisabled) {
      //   backgroundColor = 'transparent'
      //   color = Colors.loginBg
      //   onPress = null
      // }

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
  pendingUploadCount: pendingStatsUploadCount(state)
  // trips: getTrips(state)
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
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 50
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
