
import React, { Component } from 'react'
import {
  CardItem, Left,
  Body, Right, Text
} from 'native-base'
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'
import IconButton from '../components/iconButton'
import { IonIcon, Colors } from '../theme'
import Translator from '../utils/translator'
import { format } from 'date-fns'
import { getPax } from '../selectors'
import { Call, Text as Sms } from 'react-native-openanything'
import Button from '../components/button'
import ImageCache from './imageCache'

const _T = Translator('CurrentTripScreen')
const DATE_FORMAT = 'YY MM DD'

export default class Trip extends Component {
  _renderPhone = phone => (
    <IconButton name='phone' color='green' onPress={() => Call(phone)} />
  )

  _renderSMS = phone => (
    <IconButton name='sms' color='blue' onPress={() => Sms(phone)} />
  )

  _renderHeader = trip => {
    const name = trip.get('name')
    const outDate = format(trip.get('outDate'), DATE_FORMAT)
    const homeDate = format(trip.get('homeDate'), DATE_FORMAT)
    return (
      <CardItem>
        <Body><Text style={ss.boldText}>{name}</Text></Body>
        <Right>
          <Text note>{`${outDate} - ${homeDate}`}</Text>
        </Right>
      </CardItem>
    )
  }

  _renderImage = image => {
    return (
      <CardItem cardBody>
        <ImageCache uri={image} style={ss.tripImage} />
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
      <CardItem style={ss.cardItem}>
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
      <CardItem style={ss.cardItem}>
        <Text style={ss.boldText}>{_T('lunchRestaurants')}</Text>

        <TouchableOpacity onPress={this._toRestaurant('out', out)} style={ss.restaurantsItem}>
          <Text note>{_T('out')}</Text>
          <Body style={ss.body}>
            <Left style={{ flex: 2 }}>
              <Text style={ss.restaurantName}>{out.get('name')}</Text>
            </Left>
            <Right style={ss.right}>
              {this._renderPhone(outPhone)}
              {this._renderSMS(outPhone)}
            </Right>
          </Body>
        </TouchableOpacity>

        <TouchableOpacity onPress={this._toRestaurant('home', home)} style={ss.restaurantsItem}>
          <Text note>{_T('home')}</Text>
          <Body style={ss.body}>
            <Left style={{ flex: 2 }}>
              <Text style={ss.restaurantName}>{home.get('name')}</Text>
            </Left>
            <Right style={ss.right}>
              {this._renderPhone(homePhone)}
              {this._renderSMS(homePhone)}
            </Right>
          </Body>
        </TouchableOpacity>

      </CardItem>
    )
  }

  _smsAll = trip => {
    const pax = getPax(trip)
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
    const image = trip.get('image')
    return (
      <ScrollView>
        {this._renderHeader(trip)}
        {!!image && this._renderImage(image)}
        {!!transport && this._renderSchedule(transport)}
        {!!transport && this._renderDrivers(transport.get('drivers'))}
        {!!launches && this._renderRestaurants(launches)}
        {this._renderFooter(trip)}
      </ScrollView>
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
  restaurantsItem: {
    marginTop: 10,
    width: '100%'
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
  },
  cardItem: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  restaurantName: {
    color: Colors.headerBg
  }
})
