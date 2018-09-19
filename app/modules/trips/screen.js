import React, { Component } from 'react'
import {
  Container, Content
} from 'native-base'
import { StyleSheet } from 'react-native'
import Header from '../../components/header'
import { IonIcon } from '../../theme/'
import { connect } from 'react-redux'
import Translator from '../../utils/translator'
import { tripsReq } from './action'
import { networkActionDispatcher } from '../../utils/actionDispatcher'
import TripCard from '../../components/tripCard'
import { getTrips, getUser } from '../../selectors'
const _T = Translator('CurrentTripScreen')

class TripScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='home' size={25} color={tintColor} />
    }
  }

  componentDidMount () {
    const { trips, user } = this.props
    const isLocalData = trips.get('data').size
    if (!isLocalData) {
      networkActionDispatcher(tripsReq({
        isNeedjwt: true, guideId: user.get('id')
      }))
    }
  }

  render () {
    const { navigation, trips } = this.props
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} />
        <Content style={ss.content}>
          <TripCard
            trip={trips.get('current')}
            navigation={navigation}
          />
        </Content>
      </Container>

    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state),
  user: getUser(state)
})

export default connect(stateToProps, null)(TripScreen)

const ss = StyleSheet.create({
  content: {
    // padding: 3
  }
})
