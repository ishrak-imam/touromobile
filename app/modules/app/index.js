import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setNavigator } from '../../navigation/service'
import { setCurrentScreen } from '../../navigation/action'
import RootNavigator from '../../navigation'
import { View, StyleSheet } from 'react-native'
import { getRefreshState } from '../../selectors'
import OverlaySpinner from '../../components/overlaySpinner'

class App extends Component {
  _handleNavigationStateChange = (prevState, currentState, action) => {
    const lev1 = currentState.routes[currentState.index]
    let lev3 = lev1.routes[lev1.index]
    if (lev3.routes) {
      lev3 = lev3.routes[lev3.index]
      if (lev3.routes) {
        lev3 = lev3.routes[lev3.index]
      }
    }
    this.props.dispatch(setCurrentScreen(lev3))
  }

  render () {
    const { refresh } = this.props
    const refreshing = refresh.get('loading')

    return (
      <View style={ss.container}>
        <RootNavigator
          ref={navigatorRef => setNavigator(navigatorRef)}
          onNavigationStateChange={this._handleNavigationStateChange}
        />
        {refreshing && <OverlaySpinner />}
      </View>
    )
  }
}

const stateToProps = state => ({
  refresh: getRefreshState(state)
})

export default connect(stateToProps, dispatch => ({ dispatch }))(App)

const ss = StyleSheet.create({
  container: {
    flex: 1
  }
})
