
import React, { Component } from 'react'
import {
  Card, CardItem, Body, Right, Text,
  Content, Button
} from 'native-base'
import { StyleSheet, Image, View } from 'react-native'
import RoundIconButton from '../components/roundedIconButton'
import { IonIcon } from '../theme'
import Translator from '../utils/translator'
import moment from 'moment'

const _T = Translator('CurrentTripScreen')
const DATE_FORMAT = 'YY MM DD'

export default class TripCard extends Component {
  _renderPhone = (phone) => (
    <RoundIconButton name='phone' color='green' onPress={() => {}} />
  )

  _renderSMS = (phone) => (
    <RoundIconButton name='sms' color='blue' onPress={() => {}} />
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

  _renderRestaurants = launches => {
    const out = launches.get('out')
    const home = launches.get('home')
    return (
      <CardItem>
        <Content>
          <Text style={ss.boldText}>{_T('lunchRestaurants')}</Text>
          <Body style={ss.body}>
            <Text>{`${_T('out')}: ${out.get('name')}`}</Text>
            <Right style={ss.right}>
              {this._renderPhone('asdjalsjd')}
              {this._renderSMS('asdklas;kd')}
            </Right>
          </Body>
          <Body style={ss.body}>
            <Text>{`${_T('home')}: ${home.get('name')}`}</Text>
            <Right style={ss.right}>
              {this._renderPhone('asdjalsjd')}
              {this._renderSMS('asdklas;kd')}
            </Right>
          </Body>
        </Content>
      </CardItem>
    )
  }

  _renderFooter = () => {
    return (
      <CardItem footer>
        <Button iconLeft style={ss.footerButton} onPress={() => {}}>
          <IonIcon name='sms' color='white' />
          <Text>{_T('textMessageAllPax')}</Text>
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
        {transport && this._renderSchedule(transport)}
        {transport && this._renderDrivers(transport.get('drivers'))}
        {launches && this._renderRestaurants(launches)}
        {this._renderFooter()}
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
