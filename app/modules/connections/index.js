
import React, { Component } from 'react'
import { Container } from 'native-base'
import Header from '../../components/header'
import _T from '../../utils/translator'

export default class Connections extends Component {
  render () {
    const { navigation } = this.props
    return (
      <Container>
        <Header left='back' title={_T('connections')} navigation={navigation} />
      </Container>
    )
  }
}
