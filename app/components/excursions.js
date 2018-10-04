import React, { Component } from 'react'
import {
  View, Text, Card,
  CardItem, Left, Body, Right
} from 'native-base'
import { IonIcon } from '../theme'
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

const _T = Translator('ExcursionsScreen')
const DATE_FORMAT = 'YY MM DD, h:mm'

class ExcursionCard extends Component {
  shouldComponentUpdate (nexProps) {
    return !!nexProps.participants && !nexProps.participants.equals(this.props.participants)
  }
  _smsAll = (pax, modifiedPax) => {
    const data = getMap({ pax, modifiedPax })
    sms(getPhoneNumbers(data))
  }

  render () {
    const { item, onPress, trip, participants, modifiedPax } = this.props
    const id = item.get('id')
    const name = item.get('name')
    const description = item.get('description')
    const start = item.get('start')
    const pax = getPax(trip)
    const participatingPax = getParticipatingPax(getMap({ pax, participants }))

    return (
      <TouchableOpacity onPress={onPress(item)} key={id}>
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
            <Button iconLeft style={ss.button} onPress={() => this._smsAll(pax, modifiedPax)}>
              <IonIcon name='sms' color='white' />
              <Text>{_T('textAllParticipants')}</Text>
            </Button>
          </CardItem>
        </Card>
      </TouchableOpacity>
    )
  }
}

class Excursions extends Component {
  _toDetails = (excursion) => {
    const { navigation } = this.props
    return () => {
      navigation.navigate('ExcursionDetails', { excursion })
    }
  }

  _renderExcursionCard = ({ item }) => {
    const { trip, participants, modifiedPax } = this.props
    return (
      <ExcursionCard
        item={item}
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
        {!!excursions && excursions.size && this._renderExcursions()}
      </View>
    )
  }
}

const stateToProps = state => ({
  participants: getParticipants(state),
  modifiedPax: getModifiedPax(state)
})

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
    justifyContent: 'center'
  }
})
