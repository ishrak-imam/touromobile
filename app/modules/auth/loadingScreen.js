
import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Spinner } from 'native-base'
import isIOS from '../../utils/isIOS'
import { connect } from 'react-redux'
import { init } from '../auth/action'
import { Colors } from '../../theme'
import { startConnectionMonitor, checkConnection } from '../../connection/action'

class LoadingScreen extends Component {
  componentDidMount () {
    if (!isIOS) this.props.dispatch(checkConnection())
    this.props.dispatch(startConnectionMonitor())
    this.props.dispatch(init())
  }
  render () {
    return (
      <View style={ss.container}>
        <Spinner size='large' color={Colors.headerBg} />
      </View>
    )
  }
}

export default connect(null, dispatch => ({ dispatch }))(LoadingScreen)

const ss = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
