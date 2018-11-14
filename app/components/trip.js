
import React, { Component } from 'react'
import {
  CardItem, Left,
  Body, Right, Text
} from 'native-base'
import {
  StyleSheet, View,
  TouchableOpacity, ScrollView
} from 'react-native'
import IconButton from '../components/iconButton'
import { IonIcon, Colors } from '../theme'
import Translator from '../utils/translator'
import { format } from 'date-fns'
import {
  getPax, getModifiedPax,
  getPhoneNumbers, getFlightPaxPhones
} from '../selectors'
import { call, sms } from '../utils/comms'
import Button from '../components/button'
import ImageCache from './imageCache'
import { connect } from 'react-redux'
import { getMap } from '../utils/immutable'

const _T = Translator('CurrentTripScreen')

const DATE_FORMAT = 'DD/MM'

class Trip extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.modifiedPax.equals(this.props.modifiedPax) ||
            !nextProps.trip.equals(this.props.trip)
  }

  _renderPhone = phone => (
    <IconButton name='phone' color='green' onPress={() => call(phone)} />
  )

  _renderSMS = phone => (
    <IconButton name='sms' color='blue' onPress={() => sms(phone)} />
  )

  _smsAll = pax => {
    const { modifiedPax } = this.props
    const numbers = getPhoneNumbers(getMap({ pax, modifiedPax }))
    sms(numbers)
  }

  _renderHeader = trip => {
    const name = trip.get('name')
    const outDate = format(trip.get('outDate'), DATE_FORMAT)
    const homeDate = format(trip.get('homeDate'), DATE_FORMAT)
    const brand = trip.get('brand')
    const transport = trip.get('transport')
    const iconName = transport ? transport.get('type') : null
    return (
      <CardItem style={{ backgroundColor: Colors[`${brand}Brand`], borderRadius: 0 }}>
        <Left style={ss.headerLeft}>
          <Text numberOfLines={1} style={ss.headerLeftText}>{brand}  {name}</Text>
        </Left>
        <Body style={ss.headerBody}>
          <Text>{`${outDate} - ${homeDate}`}</Text>
        </Body>
        <Right style={ss.headerRight}>
          {iconName && <IonIcon name={iconName} />}
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

  _renderPaxCount = paxCount => {
    return (
      <CardItem>
        <Body><Text style={ss.boldText}>{_T('pax')}</Text></Body>
        <Right><Text style={ss.boldText}>{paxCount}</Text></Right>
      </CardItem>
    )
  }

  _renderSchedule = transport => {
    const departure = transport.get('departure')
    const bus = transport.get('regno')
    const platform = transport.get('platform')
    return (
      <View style={ss.scheduleContainer}>
        {
          departure &&
          <CardItem>
            <Body><Text style={ss.boldText}>{_T('departureTime')}</Text></Body>
            <Right><Text>{departure}</Text></Right>
          </CardItem>
        }
        {
          bus && platform &&
          <CardItem>
            <Body><Text note>{`${_T('bus')}: ${bus}. ${_T('platform')}: ${platform}`}</Text></Body>}
          </CardItem>
        }
      </View>
    )
  }

  _renderDrivers = drivers => {
    return drivers &&
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
                  {!!phone && this._renderPhone(phone)}
                  {!!phone && this._renderSMS(phone)}
                </Right>
              </Body>
            )
          })
        }
      </CardItem>
  }

  _renderBus = transport => {
    return (
      <View>
        {this._renderSchedule(transport)}
        {this._renderDrivers(transport.get('drivers'))}
      </View>
    )
  }

  // _smsFlightPax = (pax, flightPax) => {
  //   const { modifiedPax } = this.props
  //   const numbers = getFlightPaxPhones(getMap({ pax, flightPax, modifiedPax }))
  //   sms(numbers)
  // }

  _renderFlight = (transport, pax) => {
    const { modifiedPax } = this.props
    const flights = transport.get('flights')

    return flights && flights.map(f => {
      const key = f.get('key')
      const name = f.get('name')

      const out = f.get('out')
      const home = f.get('home')

      const outTime = `${out.get('departure')} - ${out.get('arrival')}`
      const homeTime = `${home.get('departure')} - ${home.get('arrival')}`

      const outFlight = out.get('flightNo')
      const homeFlight = out.get('flightNo')

      const flightPax = f.get('passengers')

      const numbers = getFlightPaxPhones(getMap({ pax, flightPax, modifiedPax }))

      return (
        <View style={ss.flightCard} key={key}>
          <View style={ss.cardHeader}>
            <Text>{key}</Text>
            <Text>{name}</Text>
            <Text />
          </View>
          <View style={ss.cardBody}>
            <View style={ss.cardTop}>
              <View style={{ paddingLeft: 10, paddingTop: 15 }}>
                <Text>
                  <Text style={ss.boldText}>{_T('out')}:</Text>       <Text>{outTime}</Text>      <Text style={ss.boldText}>{outFlight}</Text>
                </Text>
                <Text>
                  <Text style={ss.boldText}>{_T('home')}:</Text>   <Text>{homeTime}</Text>      <Text style={ss.boldText}>{homeFlight}</Text>
                </Text>
              </View>
            </View>
            <View style={ss.cardBottom}>
              <View style={ss.bottomLeft}>
                <Text>{_T('pax')}: {flightPax.size}</Text>
              </View>
              <View style={ss.bottomRight}>
                {!!numbers && <IconButton name='sms' color='blue' onPress={() => sms(numbers)} />}
              </View>
            </View>
          </View>
        </View>
      )
    })
  }

  _toRestaurant = (direction, restaurant) => {
    const { trip, navigation } = this.props
    return () => {
      const orders = trip.get('orders')
      const brand = trip.get('brand')
      navigation.navigate('Restaurant', { orders, brand, direction, restaurant })
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
              {!!outPhone && this._renderPhone(outPhone)}
              {!!outPhone && this._renderSMS(outPhone)}
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
              {!!homePhone && this._renderPhone(homePhone)}
              {!!homePhone && this._renderSMS(homePhone)}
            </Right>
          </Body>
        </TouchableOpacity>

      </CardItem>
    )
  }

  _renderFooter = pax => {
    return (
      <CardItem footer>
        <Button iconLeft style={ss.footerButton} onPress={() => this._smsAll(pax)}>
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
    const pax = getPax(trip)

    const isFlight = transport ? transport.get('type') === 'flight' : false
    const isBus = transport ? transport.get('type') === 'bus' : false

    return (
      <ScrollView contentContainerStyle={{ justifyContent: 'center' }}>
        {this._renderHeader(trip)}
        {!!image && this._renderImage(image)}
        {this._renderPaxCount(pax.size)}

        {isFlight && this._renderFlight(transport, pax)}

        {isBus && this._renderBus(transport)}

        {!!launches && this._renderRestaurants(launches)}
        {this._renderFooter(pax)}
      </ScrollView>
    )
  }
}

const stateToProps = (state, props) => {
  const { trip } = props
  const departureId = String(trip.get('departureId'))
  return {
    modifiedPax: getModifiedPax(state, departureId)
  }
}

export default connect(stateToProps, null)(Trip)

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
    color: Colors.blue
  },
  headerLeft: {
    flex: 3
  },
  headerLeftText: {
    fontWeight: 'bold',
    marginLeft: 0
  },
  headerBody: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerRight: {
    flex: 0.5
  },

  flightCard: {
    height: 150,
    marginHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.steel,
    marginVertical: 10
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardBody: {
    flex: 1
  },
  cardTop: {
    flex: 3
  },
  cardBottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  bottomLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
  },
  bottomRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 10
  }
})
