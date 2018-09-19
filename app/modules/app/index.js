import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setNavigator } from '../../navigation/service'
import { setCurrentScreen } from '../../navigation/action'
import RootNavigator from '../../navigation'

class App extends Component {
  _handleNavigationStateChange = (prevState, currentState, action) => {
    this.props.dispatch(setCurrentScreen(currentState.routes[currentState.index]))
  }

  render () {
    return (
      <RootNavigator
        ref={navigatorRef => setNavigator(navigatorRef)}
        onNavigationStateChange={this._handleNavigationStateChange}
      />
    )
  }
}

export default connect(null, dispatch => ({ dispatch }))(App)
