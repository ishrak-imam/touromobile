import React, { Component } from 'react'
import {
  View, Text, Card,
  CardItem, Left, Body, Right
} from 'native-base'
import { IonIcon, Colors } from '../theme'
import {
  getPax, getParticipants,
  getSortedExcursions, getModifiedPax,
  getParticipatingPax, getPhoneNumbers
} from '../selectors'
import Translator from '../utils/translator'
import { format } from 'date-fns'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { sms } from '../utils/comms'
import Button from '../components/button'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { connect } from 'react-redux'
import { getMap } from '../utils/immutable'
import NoData from './noData'

const _T = Translator('ExcursionsScreen')

const DATE_FORMAT = 'YYYY-MM-DD HH:mm'

class ExcursionCard extends Component {
  shouldComponentUpdate (nexProps) {
    return !!nexProps.participants && !nexProps.participants.equals(this.props.participants)
  }
  _smsAll = (pax, modifiedPax) => {
    const data = getMap({ pax, modifiedPax })
    const numbers = getPhoneNumbers(data)
    sms(numbers)
  }

  render () {
    const { excursion, onPress, trip, participants, modifiedPax } = this.props
    const id = excursion.get('id')
    const name = excursion.get('name')
    const description = excursion.get('description')
    const start = excursion.get('start')
    const pax = getPax(trip)
    const brand = trip.get('brand')
    const participatingPax = getParticipatingPax(getMap({ pax, participants }))

    return (
      <TouchableOpacity onPress={onPress(excursion, brand)} key={id}>
        <Card>
          <CardItem>
            <Left>
              <IonIcon name='excursion' />
              <Body>
                <Text>{name}</Text>
                <Text note>{format(start, DATE_FORMAT)}</Text>
              </Body>
            </Left>
            <Right>
              <Text style={ss.boldText}>{participatingPax.size}/{pax.size}</Text>
            </Right>
          </CardItem>
          <CardItem>
            <Body>
              <Text note>{description}</Text>
            </Body>
          </CardItem>
          <CardItem footer>
            <Button style={ss.button} onPress={() => this._smsAll(pax, modifiedPax)}>
              <IonIcon name='sms' color={Colors.white} />
              <Text>{_T('textAllParticipants')}</Text>
            </Button>
          </CardItem>
        </Card>
      </TouchableOpacity>
    )
  }
}

class Excursions extends Component {
  _toDetails = (excursion, brand) => {
    const { navigation } = this.props
    return () => {
      navigation.navigate('ExcursionDetails', { excursion, brand })
    }
  }

  _renderExcursionCard = ({ item }) => {
    const { trip, participants, modifiedPax } = this.props
    return (
      <ExcursionCard
        excursion={item}
        onPress={this._toDetails}
        trip={trip}
        participants={participants.get(String(item.get('id')))}
        modifiedPax={modifiedPax}
      />
    )
  }

  _renderExcursions = () => {
    const { trip } = this.props
    const sortedExcursions = getSortedExcursions(trip)
    return (
      <ImmutableVirtualizedList
        immutableData={sortedExcursions}
        renderItem={this._renderExcursionCard}
        keyExtractor={item => String(item.get('id'))}
      />
    )
  }

  render () {
    const { trip } = this.props
    const excursions = trip.get('excursions')
    return (
      <View style={ss.container}>
        {
          excursions && excursions.size
            ? this._renderExcursions()
            : <NoData text='noExcursions' textStyle={{ marginTop: 30 }} />
        }
      </View>
    )
  }
}

const stateToProps = (state, props) => {
  const { trip } = props
  const departureId = String(trip.get('departureId'))
  return {
    participants: getParticipants(state, departureId),
    modifiedPax: getModifiedPax(state, departureId)
  }
}

export default connect(stateToProps, null)(Excursions)

const ss = StyleSheet.create({
  container: {
    flex: 1
  },
  boldText: {
    fontWeight: 'bold'
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.blue
  }
})
