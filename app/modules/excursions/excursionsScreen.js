import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { IonIcon } from '../../theme/'

export default class ExcursionsScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='excursion' size={25} color={tintColor} />
    },
    title: 'Utflykter'
  }

  render () {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>ExcursionsScreen</Text>
      </View>
    )
  }
}
