import React, { Component } from 'react'
import {
  Container, Content
} from 'native-base'
import { IonIcon } from '../../theme/'
import Header from '../../components/header'

export default class ReportScreen extends Component {
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
        <Header left='menu' title='Reports' navigation={navigation} />
        <Content />
      </Container>
    )
  }
}
