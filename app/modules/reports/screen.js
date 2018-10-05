import React, { Component } from 'react'
import {
  Container, CardItem, Button, Text
} from 'native-base'
import { StyleSheet } from 'react-native'
import { IonIcon } from '../../theme/'
import Header from '../../components/header'
import Translator from '../../utils/translator'
import {
  getPax, getParticipatingPax,
  getTrips, getParticipants, getTripExcursions
} from '../../selectors'
import Stats from '../../components/stats'
import { connect } from 'react-redux'
import { getMap } from '../../utils/immutable'

const _T = Translator('ReportsScreen')

class ReportsScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='report' color={tintColor} />
    }
  }

  _onUpload = () => {
    const { excursions, participants, trips } = this.props
    const trip = trips.getIn(['current', 'trip'])
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

    console.log(statsData)
  }

  render () {
    const { trips, participants, excursions, navigation } = this.props
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} />
        <Stats
          participants={participants}
          excursions={excursions}
          trip={trips.getIn(['current', 'trip'])}
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
  trips: getTrips(state),
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
