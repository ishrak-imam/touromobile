import React, { Component } from 'react'
import {
  Container, Content
} from 'native-base'
import Header from '../../components/header'
import { IonIcon } from '../../theme/'

export default class ExcursionsScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='excursion' size={25} color={tintColor} />
    }
  }

  render () {
    const { navigation } = this.props
    return (
      <Container>
        <Header left='menu' title='Excursions' navigation={navigation} />
        <Content />
      </Container>
    )
  }
}
