import React, { Component } from 'react'
import {
  Container, Content
} from 'native-base'
import Header from '../../components/header'
import { IonIcon } from '../../theme/'
import { connect } from 'react-redux'
import Translator from '../../utils/translator'
const _T = Translator('PassengersScreen')

class PassengersScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='people' size={25} color={tintColor} />
    }
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

export default connect(null, dispatch => ({ dispatch }))(PassengersScreen)
