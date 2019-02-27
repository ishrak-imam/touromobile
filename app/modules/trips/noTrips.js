
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Container, View, Text } from 'native-base'
import Header from '../../components/header'
import Translator from '../../utils/translator'

const _T = Translator('NoTripsScreen')

export default class NoTrips extends Component {
  render () {
    const { navigation } = this.props
    return (
      <Container>
        <Header left='back' title={_T('title')} navigation={navigation} />
        <View style={ss.screen}>
          <Text>{_T('text')}</Text>
        </View>
      </Container>
    )
  }
}

const ss = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 30
  }
})
