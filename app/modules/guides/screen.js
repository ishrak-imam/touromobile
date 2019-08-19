
import React, { Component } from 'react'
import { Container } from 'native-base'
import Header from '../../components/header'

export default class GuidesScreen extends Component {
  render () {
    const { navigation } = this.props
    return (
      <Container>
        <Header left='menu' title='Select Guide' navigation={navigation} />
      </Container>
    )
  }
}
