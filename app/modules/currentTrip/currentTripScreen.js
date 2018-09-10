import React, { Component } from 'react'
import {
  Container, Content
} from 'native-base'
import { StyleSheet } from 'react-native'
import Header from '../../components/header'
import { IonIcon } from '../../theme/'
import { connect } from 'react-redux'
import Translator from '../../utils/translator'
import { currentTripReq } from './action'
import { networkActionDispatcher } from '../../utils/actionDispatcher'
import TripCard from '../../components/tripCard'
import { getCurrentTrip } from '../../selectors'
const _T = Translator('CurrentTripScreen')

class CurrenTripScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='home' size={25} color={tintColor} />
    }
  }

  componentDidMount () {
    networkActionDispatcher(currentTripReq({
      isNeedjwt: true
    }))
  }

  render () {
    const { navigation, currentTrip } = this.props
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} />
        <Content style={ss.content}>
          <TripCard trip={currentTrip.get('data')} />
        </Content>
      </Container>

    )
  }
}

const stateToProps = state => ({
  currentTrip: getCurrentTrip(state)
})

export default connect(stateToProps, null)(CurrenTripScreen)

const ss = StyleSheet.create({
  content: {
    // padding: 3
  }
})
