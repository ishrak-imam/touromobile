import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setNavigator } from '../../navigation/service'
import { setCurrentScreen } from '../../navigation/action'
import RootNavigator from '../../navigation'

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
    return (
      <RootNavigator
        ref={navigatorRef => setNavigator(navigatorRef)}
        onNavigationStateChange={this._handleNavigationStateChange}
      />
    )
  }
}

export default connect(null, dispatch => ({ dispatch }))(App)
