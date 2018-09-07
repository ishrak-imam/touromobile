import React, { Component } from 'react'
import {
  Container, Content
} from 'native-base'
import { IonIcon } from '../../theme/'
import Header from '../../components/header'
import Translator from '../../utils/translator'
const _T = Translator('ReportsScreen')

export default class ReportsScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='report' size={25} color={tintColor} />
    },
    title: 'Reports'
  }

  render () {
    const { navigation } = this.props
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} />
        <Content />
      </Container>
    )
  }
}
