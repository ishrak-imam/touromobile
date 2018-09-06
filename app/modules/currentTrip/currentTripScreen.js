import React, { Component } from 'react'
import {
  Container, Content
} from 'native-base'
import Header from '../../components/header'
import { IonIcon } from '../../theme/'
import { connect } from 'react-redux'

class CurrenTripScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='home' size={25} color={tintColor} />
    }
  }

  render () {
    const { navigation } = this.props
    return (
      <Container>
        <Header left='menu' title='Current Trip' navigation={navigation} />
        <Content />
      </Container>

    )
  }
}

export default connect(null, dispatch => ({ dispatch }))(CurrenTripScreen)
