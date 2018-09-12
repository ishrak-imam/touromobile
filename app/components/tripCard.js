
import React, { Component } from 'react'
import {
  Card, CardItem, Body, Right, Text,
  Content, Button
} from 'native-base'
import { StyleSheet, Image, View, TouchableOpacity } from 'react-native'
import RoundIconButton from '../components/roundedIconButton'
import { IonIcon } from '../theme'
import Translator from '../utils/translator'
import moment from 'moment'
import { getPax } from '../selectors'
import { Call, Text as Sms } from 'react-native-openanything'

const _T = Translator('CurrentTripScreen')
const DATE_FORMAT = 'YY MM DD'

export default class TripCard extends Component {
  _renderPhone = phone => (
    <RoundIconButton name='phone' color='green' onPress={() => Call(phone)} />
  )

  _renderSMS = phone => (
    <RoundIconButton name='sms' color='blue' onPress={() => Sms(phone)} />
  )

  _renderHeader = trip => {
    const name = trip.get('name')
    const outDate = moment(trip.get('outDate')).format(DATE_FORMAT)
    const homeDate = moment(trip.get('homeDate')).format(DATE_FORMAT)
    return (
      <CardItem>
        <Body><Text style={ss.boldText}>{name}</Text></Body>
        <Right>
          <Text note>{`${outDate} - ${homeDate}`}</Text>
        </Right>
      </CardItem>
    )
  }

  _renderImage = () => {
    return (
      <CardItem cardBody>
        <Image source={{ uri: 'https://picsum.photos/700/500/?image=182' }} style={ss.tripImage} />
      </CardItem>
    )
  }

  _renderSchedule = transport => {
    const departure = transport.get('departure')
    const bus = transport.get('regno')
    const platform = transport.get('platform')
    return (
      <View style={ss.scheduleContainer}>
        <CardItem>
          <Body><Text>{_T('departureTime')}</Text></Body>
          <Right><Text>{departure}</Text></Right>
        </CardItem>
        <CardItem>
          <Body><Text note>{`${_T('bus')}: ${bus}. ${_T('platform')}: ${platform}`}</Text></Body>
        </CardItem>
      </View>
    )
  }

  _renderDrivers = drivers => {
    return (
      <CardItem>
        <Content>
          <Text style={ss.boldText}>{_T('drivers')}</Text>
          {
            drivers.map(driver => {
              const id = driver.get('id')
              const name = driver.get('name')
              const phone = driver.get('phone')
              return (
                <Body style={ss.body} key={id}>
                  <Text>{name}</Text>
                  <Right style={ss.right}>
                    {this._renderPhone(phone)}
                    {this._renderSMS(phone)}
                  </Right>
                </Body>
              )
            })
          }
        </Content>
      </CardItem>
    )
  }

  _toRestaurant = (direction, restaurant) => {
    const { trip, navigation } = this.props
    return () => {
      navigation.navigate('Restaurant', { trip, direction, restaurant })
    }
  }

  _renderRestaurants = launches => {
    const out = launches.get('out')
    const home = launches.get('home')
    const outPhone = out.get('phone')
    const homePhone = home.get('phone')
    return (
      <CardItem>
        <Content>
          <Text style={ss.boldText}>{_T('lunchRestaurants')}</Text>
          <TouchableOpacity onPress={this._toRestaurant('out', out)}>
            <Body style={ss.body}>
              <Text>{`${_T('out')}: ${out.get('name')}`}</Text>
              <Right style={ss.right}>
                {this._renderPhone(outPhone)}
                {this._renderSMS(outPhone)}
              </Right>
            </Body>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._toRestaurant('home', home)}>
            <Body style={ss.body}>
              <Text>{`${_T('home')}: ${home.get('name')}`}</Text>
              <Right style={ss.right}>
                {this._renderPhone(homePhone)}
                {this._renderSMS(homePhone)}
              </Right>
            </Body>
          </TouchableOpacity>
        </Content>
      </CardItem>
    )
  }

  _smsAll = trip => {
    const pax = getPax(trip.get('bookings'))
    const numbers = pax
      .filter(p => !!p.get('phone'))
      .map(p => p.get('phone'))
      .join(',')
    Sms(numbers)
  }

  _renderFooter =trip => {
    return (
      <CardItem footer>
        <Button iconLeft style={ss.footerButton} onPress={() => this._smsAll(trip)}>
          <IonIcon name='sms' color='white' />
          <Text>{_T('textAllPax')}</Text>
        </Button>
      </CardItem>
    )
  }

  render () {
    const { trip } = this.props
    const transport = trip.get('transport')
    const launches = trip.get('lunches')
    return (
      <Card>
        {this._renderHeader(trip)}
        {this._renderImage()}
        {!!transport && this._renderSchedule(transport)}
        {!!transport && this._renderDrivers(transport.get('drivers'))}
        {!!launches && this._renderRestaurants(launches)}
        {this._renderFooter(trip)}
      </Card>
    )
  }
}

const ss = StyleSheet.create({
  boldText: {
    fontWeight: 'bold'
  },
  tripImage: {
    height: 150,
    width: null,
    flex: 1
  },
  scheduleContainer: {
    marginTop: 10
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  footerButton: {
    flex: 1,
    justifyContent: 'center'
  }
})
