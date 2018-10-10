import React, { Component } from 'react'
import {
  Container, CardItem, Text,
  Spinner, View
} from 'native-base'
import { StyleSheet } from 'react-native'
import { IonIcon, Colors } from '../../theme/'
import Header from '../../components/header'
import Translator from '../../utils/translator'
import {
  currentTripSelector, getStatsData,
  getParticipants, getTripExcursions, getReports
} from '../../selectors'
import Stats from '../../components/stats'
import { connect } from 'react-redux'
import { networkActionDispatcher } from '../../utils/actionDispatcher'
import { uploadStatsReq } from './action'
import Button from '../../components/button'

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
    const departureId = String(trip.get('departureId'))
    const statsData = getStatsData(excursions, participants, trip)
    networkActionDispatcher(uploadStatsReq({
      isNeedJwt: true,
      departureId,
      statsData
    }))
  }

  _renderUploadButton = (reports, brand) => {
    const footerButton = StyleSheet.flatten([
      ss.footerButton,
      { backgroundColor: Colors[`${brand}Brand`] || Colors.blue }
    ])
    const isLoading = reports.get('isLoading')
    return (
      <CardItem>
        <Button iconLeft style={footerButton} onPress={this._onUpload} disabled={isLoading}>
          {
            isLoading
              ? <Spinner color={Colors.blue} />
              : <View style={ss.buttonItem}>
                <IonIcon name='upload' color='white' style={ss.buttonIcon} />
                <Text style={ss.buttonText}>{_T('upload')}</Text>
              </View>
          }
        </Button>
      </CardItem>
    )
  }

  render () {
    const { currentTrip, participants, excursions, reports, navigation } = this.props
    const trip = currentTrip.get('trip')
    const brand = trip.get('brand')

    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} brand={brand} />
        <Stats
          participants={participants}
          excursions={excursions}
          trip={trip}
          navigation={navigation}
        />
        {currentTrip.get('has') && this._renderUploadButton(reports, brand)}
      </Container>
    )
  }
}

const stateToProps = state => {
  const currentTrip = currentTripSelector(state)
  const departureId = String(currentTrip.get('trip').get('departureId'))
  return {
    currentTrip,
    participants: getParticipants(state, departureId),
    excursions: getTripExcursions(state),
    reports: getReports(state)
  }
}

export default connect(stateToProps, null)(ReportsScreen)

const ss = StyleSheet.create({
  footerButton: {
    flex: 1,
    justifyContent: 'center'
  },
  buttonItem: {
    flexDirection: 'row'
  },
  buttonIcon: {
    marginRight: 10
  },
  buttonText: {
    color: Colors.silver,
    marginTop: 2,
    marginLeft: 10
  }
})
