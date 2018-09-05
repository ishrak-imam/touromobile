import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { logoutReq } from '../auth/action'

class Home extends Component {
  _logOut = () => {
    this.props.dispatch(logoutReq())
  }

  render () {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={this._logOut}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default connect(null, dispatch => ({ dispatch }))(Home)
