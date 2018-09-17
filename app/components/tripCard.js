
import React, { Component } from 'react'
import {
  Card, CardItem,
  Body, Right, Text, Content
} from 'native-base'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import IconButton from '../components/iconButton'
import { IonIcon } from '../theme'
import Translator from '../utils/translator'
import { format } from 'date-fns'
import { getPax } from '../selectors'
import { Call, Text as Sms } from 'react-native-openanything'
import Button from '../components/button'
import ImageCache from '../modules/imageCache'

const _T = Translator('CurrentTripScreen')
const DATE_FORMAT = 'YY MM DD'

export default class TripCard extends Component {
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

  _renderImage = () => {
    const arr = Array.from(new Array(5), (val, index) => ++index)
    return (
      <CardItem cardBody>
        {arr.map(item => {
          return <ImageCache key={item} uri={`http://www.gstatic.com/webp/gallery/${item}.jpg`} style={ss.tripImage} />
        })}
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
