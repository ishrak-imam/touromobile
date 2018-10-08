import React, { Component } from 'react'
import {
  Container, CardItem, Button, Text
} from 'native-base'
import { StyleSheet } from 'react-native'
import { IonIcon } from '../../theme/'
import Header from '../../components/header'
import Translator from '../../utils/translator'
import {
  getParticipatingPax, currentTripSelector,
  getParticipants, getTripExcursions, getPax
} from '../../selectors'
import Stats from '../../components/stats'
import { connect } from 'react-redux'
import { getMap } from '../../utils/immutable'
import { networkActionDispatcher } from '../../utils/actionDispatcher'
import { uploadStatsReq } from './action'

const _T = Translator('ReportsScreen')

class ReportsScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='report' color={tintColor} />
    }
  }

  _onUpload = () => {
    const { excursions, participants, currentTrip } = this.props
    const trip = currentTrip.get('trip')
    const pax = getPax(trip)
    const excursionPaxCounts = excursions.reduce((m, e) => {
      const excursionId = e.get('id')
      const participatingPax = getParticipatingPax(getMap({ pax, participants: participants.get(String(excursionId)) }))
      m.push({
        excursionId,
        participantCount: participatingPax.size
      })
      return m
    }, [])

    const statsData = {
      excursions: excursionPaxCounts,
      totalPassengers: pax.size
    }

    networkActionDispatcher(uploadStatsReq({
      isNeedJwt: true,
      departureId: trip.get('departureId'),
      data: statsData
    }))
  }

  render () {
    const { currentTrip, participants, excursions, navigation } = this.props
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} />
        <Stats
          participants={participants}
          excursions={excursions}
          trip={currentTrip.get('trip')}
          navigation={navigation}
        />
        <CardItem>
          <Button iconLeft style={ss.footerButton} onPress={this._onUpload}>
            <IonIcon name='upload' color='white' />
            <Text>{_T('upload')}</Text>
          </Button>
        </CardItem>
      </Container>
    )
  }
}

const stateToProps = state => ({
  currentTrip: currentTripSelector(state),
  participants: getParticipants(state),
  excursions: getTripExcursions(state)
})

export default connect(stateToProps, null)(ReportsScreen)

const ss = StyleSheet.create({
  footerButton: {
    flex: 1,
    justifyContent: 'center'
  }
})
