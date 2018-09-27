import React, { Component } from 'react'
import {
  View, Text, Card,
  CardItem, Left, Body, Right
} from 'native-base'
import { IonIcon } from '../theme'
import { getPax, getParticipants, getSortedExcursions } from '../selectors'
import Translator from '../utils/translator'
import { format } from 'date-fns'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text as Sms } from 'react-native-openanything'
import Button from '../components/button'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { connect } from 'react-redux'

const _T = Translator('ExcursionsScreen')
const DATE_FORMAT = 'YY MM DD, h:mm'

class ExcursionCard extends Component {
  shouldComponentUpdate (nexProps) {
    return !!nexProps.participants && !nexProps.participants.equals(this.props.participants)
  }
  _smsAll = pax => {
    const numbers = pax
      .filter(p => !!p.get('phone'))
      .map(p => p.get('phone'))
      .join(',')
    Sms(numbers)
  }

  render () {
    const { item, onPress, trip, participants } = this.props
    const id = item.get('id')
    const name = item.get('name')
    const description = item.get('description')
    const start = item.get('start')
    const allPax = getPax(trip)
    const count = allPax.filter(p => p.get('excursionPack') === true).size
    const others = participants ? participants.size : 0

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
              <Text style={ss.boldText}>{count + others}/{allPax.size}</Text>
            </Right>
          </CardItem>
          <CardItem>
            <Body>
              <Text note>{description}</Text>
            </Body>
          </CardItem>
          <CardItem footer>
            <Button iconLeft style={ss.button} onPress={() => this._smsAll(allPax)}>
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
    const { trip, participants } = this.props
    return (
      <ExcursionCard
        item={item}
        onPress={this._toDetails}
        trip={trip}
        participants={participants.get(String(item.get('id')))}
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
        {excursions.size && this._renderExcursions()}
      </View>
    )
  }
}

const stateToProps = state => ({
  participants: getParticipants(state)
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
