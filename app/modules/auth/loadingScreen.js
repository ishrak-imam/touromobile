
import React, { Component } from 'react'
import { View, ActivityIndicator } from 'react-native'
import isIOS from '../../utils/isIOS'
import { connect } from 'react-redux'
import { init } from '../auth/action'
import { startConnectionMonitor, checkConnection } from '../connection/action'

class LoadingScreen extends Component {
  componentDidMount () {
    if (!isIOS) this.props.dispatch(checkConnection())
    this.props.dispatch(startConnectionMonitor())
    this.props.dispatch(init())
  }
  render () {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    )
  }
}

export default connect(null, dispatch => ({ dispatch }))(LoadingScreen)
