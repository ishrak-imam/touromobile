import React, { Component } from 'react'
import {
  Container, Content, Text
} from 'native-base'
import { TouchableOpacity } from 'react-native'
import Header from '../../components/header'
import { IonIcon } from '../../theme/'
import { connect } from 'react-redux'
import { logoutReq } from '../auth/action'

class CurrenTripScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='home' size={25} color={tintColor} />
    }
  }

  _logOut = () => {
    this.props.dispatch(logoutReq())
  }

  render () {
    return (
      <Container>
        <Header left='menu' title='Current Trip' />
        <Content>
          <TouchableOpacity onPress={this._logOut} style={{ marginTop: 20 }}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </Content>
      </Container>

    )
  }
}

export default connect(null, dispatch => ({ dispatch }))(CurrenTripScreen)
