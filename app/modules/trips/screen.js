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
import Trip from '../../components/trip'
import { getTrips, getUser } from '../../selectors'
import NoData from '../../components/noData'
const _T = Translator('CurrentTripScreen')

class TripScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='home' color={tintColor} />
    }
  }

  shouldComponentUpdate (nextProps) {
    return !nextProps.trips.equals(this.props.trips)
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

  render () {
    const { navigation, trips } = this.props
    const isLoading = trips.get('isLoading')
    const current = trips.get('current')
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} />
        {
          isLoading
            ? <NoData text='Fetching data from Touro...' textStyle={{ marginTop: 30 }} />
            : current.get('has')
              ? current.get('has') && <Trip trip={current.get('trip')} navigation={navigation} />
              : <NoData text='No more trips' textStyle={{ marginTop: 30 }} />
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
