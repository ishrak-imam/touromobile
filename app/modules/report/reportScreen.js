import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { IonIcon } from '../../theme/'

export default class ReportScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='report' size={25} color={tintColor} />
    },
    title: 'Reports'
  }

  render () {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>ReportScreen</Text>
      </View>
    )
  }
}
