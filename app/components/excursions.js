import React, { Component } from 'react'
import {
  View, Text, Card,
  CardItem, Left, Body, Right
} from 'native-base'
import { IonIcon } from '../theme'
import { getPax } from '../selectors'
import Translator from '../utils/translator'
import moment from 'moment'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text as Sms } from 'react-native-openanything'
import Button from '../components/button'

const _T = Translator('ExcursionsScreen')
const DATE_FORMAT = 'YY MM DD, h:mm'

export default class Excursions extends Component {
  _toDetails = (trip, excursion) => {
    const { navigation } = this.props
    return () => {
      navigation.navigate('ExcursionDetails', { trip, excursion })
    }
  }

  _smsAll = pax => {
    const numbers = pax
      .filter(p => !!p.get('phone'))
      .map(p => p.get('phone'))
      .join(',')
    Sms(numbers)
  }

  _renderExcursionCard = excursion => {
    const { trip } = this.props
    const id = excursion.get('id')
    const name = excursion.get('name')
    const description = excursion.get('description')
    const start = excursion.get('start')

    const allPax = getPax(trip.get('bookings'))
    let pax = allPax.filter(p => p.get('excursionPack') === true)
    const count = pax.size

    return (
      <TouchableOpacity onPress={this._toDetails(trip, excursion)} key={id}>
        <Card>
          <CardItem>
            <Left>
              <IonIcon name='excursion' />
              <Body>
                <Text>{name}</Text>
                <Text note>{moment(start).format(DATE_FORMAT)}</Text>
              </Body>
            </Left>
            <Right>
              <Text style={ss.boldText}>{count}/{allPax.size}</Text>
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

  _renderExcursions = excursions => {
    const sortedExcursions = excursions.sortBy(e => e.get('start'))
    return (
      sortedExcursions.map(e => this._renderExcursionCard(e))
    )
  }

  render () {
    const { trip } = this.props
    const excursions = trip.get('excursions')
    return (
      <View>
        {!!excursions && this._renderExcursions(excursions)}
      </View>
    )
  }
}

const ss = StyleSheet.create({
  boldText: {
    fontWeight: 'bold'
  },
  button: {
    flex: 1,
    justifyContent: 'center'
  }
})
