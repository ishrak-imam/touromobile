import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>CurrenTripScreen</Text>

        <TouchableOpacity onPress={this._logOut} style={{ marginTop: 20 }}>
          <Text>Logout</Text>
        </TouchableOpacity>

      </View>
    )
  }
}

export default connect(null, dispatch => ({ dispatch }))(CurrenTripScreen)
