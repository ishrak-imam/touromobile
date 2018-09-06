
import React, { Component } from 'react'
import {
  Content, Container, View, Text,
  Footer
} from 'native-base'
import { StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Colors, Images, IonIcon } from '../theme'
import isIphoneX from '../utils/isIphoneX'
import { connect } from 'react-redux'
import { logoutReq } from '../modules/auth/action'

class TMDrawer extends Component {
  _logOut = () => {
    this.props.dispatch(logoutReq())
  }

  _renderHeader = () => {
    return (
      <View style={ss.header}>
        <View style={ss.headerContent}>
          <Image
            style={{
              alignSelf: 'center',
              height: 70,
              width: 70
            }}
            source={Images.logo}
          />
          <Text>User name</Text>
        </View>
      </View>
    )
  }

  _renderFooter = () => {
    return (
      <Footer style={ss.footer}>
        <TouchableOpacity style={ss.footerContainer} onPress={this._logOut}>
          <IonIcon name='logout' size={25} style={ss.icon} />
          <Text>Log out</Text>
        </TouchableOpacity>
      </Footer>
    )
  }

  render () {
    return (
      <Container>
        {this._renderHeader()}
        <Content />
        {this._renderFooter()}
      </Container>
    )
  }
}

export default connect(null, dispatch => ({ dispatch }))(TMDrawer)

const ss = StyleSheet.create({
  header: {
    height: 200,
    backgroundColor: Colors.headerBg
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
  }
})
