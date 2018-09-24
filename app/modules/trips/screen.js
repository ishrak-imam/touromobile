import React, { Component } from 'react'
import {
  Container, Text, View
} from 'native-base'
import { StyleSheet } from 'react-native'
import Header from '../../components/header'
import { IonIcon } from '../../theme/'
import { connect } from 'react-redux'
import Translator from '../../utils/translator'
import { tripsReq, getCurrentTrip, getFutureTrips } from './action'
import {
  networkActionDispatcher, actionDispatcher
} from '../../utils/actionDispatcher'
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
    const isLocalData = trips.get('data').size > 0
    if (!isLocalData) {
      networkActionDispatcher(tripsReq({
        isNeedjwt: true, guideId: user.get('id')
      }))
    } else {
      actionDispatcher(getCurrentTrip())
      actionDispatcher(getFutureTrips())
    }
  }

  _renderLoader = msg => {
    return (
      <View style={ss.centerAlign}>
        <Text>{msg}</Text>
      </View>
    )
  }

  render () {
    const { navigation, trips } = this.props
    const isLoading = trips.get('isLoading')
    const current = trips.get('current')
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} />
        {
          isLoading
            ? this._renderLoader('Fetching data from Touro...')
            : current.get('noMore')
              ? this._renderLoader('No more trips')
              : !!current.get('trip').size && <TripCard trip={current.get('trip')} navigation={navigation} />
        }
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
  },
  centerAlign: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
