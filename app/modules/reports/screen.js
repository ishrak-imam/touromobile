import React, { Component } from 'react'
import {
  Container, Content, Text
} from 'native-base'
import { IonIcon } from '../../theme/'
import Header from '../../components/header'
import Translator from '../../utils/translator'
const _T = Translator('ReportsScreen')

export default class ReportsScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='report' color={tintColor} />
    },
    title: 'Reports'
  }

  render () {
    const { navigation } = this.props
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} />
        <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Reports</Text>
        </Content>
      </Container>
    )
  }
}
