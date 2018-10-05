
import React, { Component } from 'react'
import {
  Container, View, Text,
  Footer, ListItem, Body
} from 'native-base'
import {
  StyleSheet, Image,
  TouchableOpacity, ScrollView
} from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
import { Colors, Images, IonIcon } from '../theme'
import isIphoneX from '../utils/isIphoneX'
import { connect } from 'react-redux'
import { logoutReq } from '../modules/auth/action'
import {
  getLogin,
  getNavigation
  // getTrips
} from '../selectors'
import Translator from '../utils/translator'
const _T = Translator('DrawerScreen')

const menuItems = [
  { routeName: 'Trip', text: 'currentTrip', icon: 'home' },
  { routeName: 'FutureTrips', text: 'futureTrips', icon: 'futureTrips' }
]

console.log(menuItems)

class TMDrawer extends Component {
  _logOut = () => {
    this.props.dispatch(logoutReq())
  }

  _renderHeader = () => {
    const { user } = this.props
    const userName = user.get('full_name')
    return (
      <View style={ss.header}>
        <View style={ss.headerContent}>
          <Image
            style={ss.drawerImage}
            source={Images.logo}
          />
          <Text style={ss.headerName}>{userName}</Text>
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
        const navigateAction = NavigationActions.navigate({
          routeName: 'Home',
          action: NavigationActions.navigate({ routeName: 'Trip' })
        })
        const resetAction = StackActions.reset({
          index: 0,
          actions: [navigateAction]
        })
        navigation.dispatch(resetAction)
        return
      }
      navigation.navigate(item.routeName)
    }
  }

  _renderMenuItems = () => {
    // const { trips } = this.props
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
        backgroundColor = Colors.headerBg
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
        </ListItem>
      )
    })
  }

  _renderMenu = () => {
    return (
      <ScrollView contentContainerStyle={{ marginVertical: 10 }}>
        {this._renderMenuItems()}
      </ScrollView>
    )
  }

  _renderFooter = () => {
    return (
      <Footer style={ss.footer}>
        <TouchableOpacity style={ss.footerContainer} onPress={this._logOut}>
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
  nav: getNavigation(state)
  // trips: getTrips(state)
})

export default connect(stateToProps, dispatch => ({ dispatch }))(TMDrawer)

const ss = StyleSheet.create({
  header: {
    height: 200,
    backgroundColor: Colors.headerBg
  },
  headerName: {
    color: Colors.silver
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
  }
})
