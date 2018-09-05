
import React, { Component } from 'react'
import { Root } from 'native-base'
import { Provider } from 'react-redux'
import RootNav from './app/navigation'
import store from './app/store'
import { setNavigator } from './app/navigation/service'
import { AppLoading } from 'expo'
import cacheAssestsAsync from './app/utils/cacheAssetsAsync'
console.disableYellowBox = true

export default class TouroMobile extends Component {
  constructor () {
    super()
    this.state = {
      isAppReady: false
    }
  }

  componentWillMount () {
    this._loadAssetsAsync()
  }

  async _loadAssetsAsync () {
    try {
      await cacheAssestsAsync({
        images: [],
        fonts: [
          {
            Roboto: require('native-base/Fonts/Roboto.ttf'),
            Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')
          }
        ]
      })
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      )
      console.log(e.message)
    } finally {
      this.setState({ isAppReady: true })
    }
  }

  render () {
    return (
      this.state.isAppReady
        ? <Provider store={store}>
          <Root>
            <RootNav ref={navigatorRef => setNavigator(navigatorRef)} />
          </Root>
        </Provider>
        : <AppLoading />
    )
  }
}
