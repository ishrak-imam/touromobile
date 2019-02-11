
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Container, View, Text } from 'native-base'
import Header from '../../components/header'
import Translator from '../../utils/translator'

const _T = Translator('NoTrips')

export default class NoTrips extends Component {
  render () {
    const { navigation } = this.props
    return (
      <Container>
        <Header
          left='back'
          title={_T('title')}
          navigation={navigation}
        />
        <View style={ss.screen}>
          <Text>
          You have no current, past, or future trips. Please contact Pier or IT if you believe this is wrong.
          </Text>
        </View>
      </Container>
    )
  }
}

const ss = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  }
})
