
import React, { Component } from 'react'
import { Root } from 'native-base'
import { Provider } from 'react-redux'
import App from './app/modules/app'
import { store, persistor } from './app/store'
import { PersistGate } from 'redux-persist/integration/react'
import { AppLoading } from 'expo'
import cacheAssestsAsync from './app/utils/assetsCache'
import I18n from './app/i18n'
console.disableYellowBox = true

export default class TouroMobile extends Component {
  constructor () {
    super()
    this.state = {
      isAppReady: false
    }
  }

  componentWillMount () {
    I18n.initAsync() // initialization for picking device locale and configure accordingly
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
    } finally {
      this.setState({ isAppReady: true })
    }
  }

  render () {
    return (
      this.state.isAppReady
        ? <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Root>
              <App />
            </Root>
          </PersistGate>
        </Provider>
        : <AppLoading />
    )
  }
}
