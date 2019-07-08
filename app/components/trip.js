
import React, { Component } from 'react'
import {
  CardItem, Left,
  Body, Right, Text
} from 'native-base'
import {
  StyleSheet, View, TouchableOpacity
} from 'react-native'
import IconButton from '../components/iconButton'
import { IonIcon, Colors } from '../theme'
import _T from '../utils/translator'
import { format, isSameDay } from 'date-fns'
import {
  getPax, getModifiedPax, checkIfFlightTrip, getPhoneNumbers,
  getFlightPax, getFlightPaxPhones, checkIfBusTrip,
  getHideMyPhone
} from '../selectors'
import { call, sms } from '../utils/comms'
import Button from '../components/button'
import ImageCache from './imageCache'
import { connect } from 'react-redux'
import { getMap, getSet } from '../utils/immutable'
import { tripNameFormatter, formatPhone } from '../utils/stringHelpers'
import { navigate } from '../navigation/service'

const DATE_FORMAT = 'DD/MM'
const FLIGHT_TIME_FORMAT = 'HH:mm'
const FLIGHT_TIME_FORMAT_LONG = 'YY/MM/DD HH:mm'

class Trip extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.modifiedPax.equals(this.props.modifiedPax) ||
            !nextProps.trip.equals(this.props.trip) ||
            nextProps.isRefreshing !== this.props.isRefreshing
  }

  _renderPhone = phone => (
    <IconButton name='phone' color={Colors.green} onPress={() => call(phone)} />
  )

  _sms = (phone, brand) => {
    const { hideMyPhone } = this.props
    hideMyPhone
      ? navigate('SMS', { numbers: getSet([phone]), brand })
      : sms(phone)
  }

  _renderSMS = (phone, brand) => (
    <IconButton name='sms' color={Colors.blue} onPress={() => this._sms(phone, brand)} />
  )

  _smsAll = (pax, brand) => {
    const { modifiedPax } = this.props
    const numbers = getPhoneNumbers(getMap({ pax, modifiedPax }))
    const { navigation } = this.props
    navigation.navigate('SMS', { numbers, brand })
  }

  _smsFlightPax = (numbers, brand) => () => {
    const { navigation } = this.props
    navigation.navigate('SMS', { numbers, brand })
  }

  _renderHeader = trip => {
    const name = trip.get('name')
    const { title, subtitle } = tripNameFormatter(name, 15)
    const outDate = format(trip.get('outDate'), DATE_FORMAT)
    const homeDate = format(trip.get('homeDate'), DATE_FORMAT)
    const brand = trip.get('brand')
    const transport = trip.get('transport')
    const iconName = transport ? transport.get('type') : null
    const paddingBottom = subtitle ? 0 : 7

    return (
      <View>
        <View style={[ss.titleContainer, { backgroundColor: Colors[`${brand}Brand`], paddingBottom }]}>
          <View style={ss.headerLeft}>
            <Text numberOfLines={1} style={ss.headerLeftText}>{brand}   {title}</Text>
          </View>
          <View style={ss.headerBody}>
            <Text>{`${outDate} - ${homeDate}`}</Text>
          </View>
          <View style={ss.headeRight}>
            {iconName && <IonIcon name={iconName} />}
          </View>
        </View>
        {
          !!subtitle &&
          <View style={[ss.subtitleContainer, { backgroundColor: Colors[`${brand}Brand`] }]}>
            <Text numberOfLines={1} style={ss.subtitle}>{subtitle}</Text>
          </View>
        }
      </View>
    )
  }

  _renderImage = (image, transportType) => {
    return (
      <CardItem cardBody>
        <ImageCache uri={image} style={ss.tripImage} transportType={transportType} />
      </CardItem>
    )
  }

  _toRollCall = () => {
    const { navigation } = this.props
    navigation.navigate('RollCall')
  }

  _renderPaxCount = paxCount => {
    return (
      <CardItem>
        <Body style={ss.paxCountBody}>
          <Text style={ss.boldText}>{_T('pax')}: {paxCount}</Text>
        </Body>
        <Right style={ss.paxCountRight}>
          <TouchableOpacity style={ss.rollCallButton} onPress={this._toRollCall}>
            <Text style={ss.rollCallText}>{_T('rollCall')}</Text>
          </TouchableOpacity>
        </Right>
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
            <Body><Text note>{`${_T('bus')}: ${bus}. ${_T('platform')}: ${platform}`}</Text></Body>
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
            const phone = formatPhone(driver.get('phone'))
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

  _renderFlight = (transport, pax, brand) => {
    const { modifiedPax } = this.props
    const flights = transport.get('flights')

    return flights && flights.map(f => {
      const key = f.get('key')
      const name = f.get('name')

      const out = f.get('out')
      const home = f.get('home')

      const outDep = out.get('departure')
      const outArr = out.get('arrival')
      let outTime = `${format(out.get('departure'), FLIGHT_TIME_FORMAT)} - ${format(out.get('arrival'), FLIGHT_TIME_FORMAT_LONG)}`
      if (isSameDay(outDep, outArr)) {
        outTime = `${format(out.get('departure'), FLIGHT_TIME_FORMAT)} - ${format(out.get('arrival'), FLIGHT_TIME_FORMAT)}`
      }

      const homeDep = home.get('departure')
      const homeArr = home.get('arrival')
      let homeTime = `${format(home.get('departure'), FLIGHT_TIME_FORMAT)} - ${format(home.get('arrival'), FLIGHT_TIME_FORMAT_LONG)}`
      if (isSameDay(homeDep, homeArr)) {
        homeTime = `${format(home.get('departure'), FLIGHT_TIME_FORMAT)} - ${format(home.get('arrival'), FLIGHT_TIME_FORMAT)}`
      }

      const outFlight = out.get('flightNo')
      const homeFlight = home.get('flightNo')

      const flightPax = getFlightPax(pax, key)
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
              <View style={ss.flightCon}>
                <Text note>{_T('out')}</Text>
                <Text>
                  <Text style={ss.boldText}>{outFlight}:</Text>  <Text>{outTime}</Text>
                </Text>
                <Text note style={{ marginTop: 10 }}>{_T('home')}</Text>
                <Text>
                  <Text style={ss.boldText}>{homeFlight}:</Text>  <Text>{homeTime}</Text>
                </Text>
              </View>
            </View>
            <View style={ss.cardBottom}>
              <View style={ss.bottomLeft}>
                <Text>{_T('pax')}: {flightPax.size}</Text>
              </View>
              <View style={ss.bottomRight}>
                {!!numbers.size && <IconButton name='sms' color={Colors.blue} onPress={this._smsFlightPax(numbers, brand)} />}
              </View>
            </View>
          </View>
        </View>
      )
    })
  }

  _toRestaurant = (direction, restaurant) => {
    const { trip, navigation } = this.props
    const departureId = String(trip.get('departureId'))
    const brand = trip.get('brand')
    return () => {
      navigation.navigate('Restaurant', { departureId, brand, direction, restaurant })
    }
  }

  _toHotel = hotel => {
    const { trip, navigation } = this.props
    const brand = trip.get('brand')
    return () => {
      navigation.navigate('Restaurant', { brand, restaurant: hotel })
    }
  }

  _toMyOrders = () => {
    const { navigation } = this.props
    navigation.navigate('MyOrders')
  }

  _renderHotels = (hotels, brand) => {
    return (
      <CardItem style={ss.cardItem}>
        <Text style={ss.boldText}>{_T('hotels')}</Text>
        {
          hotels.map((hotel, index) => {
            const id = String(hotel.get('id'))
            const name = hotel.get('name')
            const phone = hotel.get('phone')
            return (
              <TouchableOpacity key={id} onPress={this._toHotel(hotel)} style={ss.restaurantsItem}>
                <Body style={ss.body}>
                  <Text style={{ marginRight: 10, fontWeight: 'bold' }}>{`H${++index}`}</Text>
                  <Left style={ss.left}>
                    <Text style={ss.restaurantName}>{name}</Text>
                  </Left>
                  <Right style={ss.right}>
                    {!!phone && this._renderPhone(phone)}
                    {!!phone && this._renderSMS(phone, brand)}
                  </Right>
                </Body>
              </TouchableOpacity>
            )
          })
        }
      </CardItem>
    )
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
            <Left style={ss.left}>
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
            <Left style={ss.left}>
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

  _renderFooter = (pax, brand) => {
    return (
      <CardItem footer>
        <Button style={ss.footerButton} onPress={() => this._smsAll(pax, brand)}>
          <IonIcon name='sms' color={Colors.white} />
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
    const hotels = trip.get('hotels')
    const brand = trip.get('brand')

    const isFlight = checkIfFlightTrip(trip)
    const isBus = checkIfBusTrip(trip)

    const transportType = transport ? transport.get('type') : ''

    return (
      <View style={ss.wrapper}>

        {this._renderHeader(trip)}
        {!!image && this._renderImage(image, transportType)}
        {this._renderPaxCount(pax.size)}

        {isFlight && this._renderFlight(transport, pax, brand)}

        {isBus && this._renderBus(transport)}

        {!!hotels && this._renderHotels(hotels, brand)}

        {!!launches && !isFlight && this._renderRestaurants(launches)}

        <CardItem>
          <Body style={ss.paxCountBody}>
            <Text style={ss.boldText}>{_T('myOrders')}</Text>
          </Body>
          <Right style={ss.paxCountRight}>
            <TouchableOpacity style={ss.rollCallButton} onPress={this._toMyOrders}>
              <Text style={ss.rollCallText}>{_T('show')}</Text>
            </TouchableOpacity>
          </Right>
        </CardItem>

        {this._renderFooter(pax, brand)}

      </View>
    )
  }
}

const stateToProps = (state, props) => {
  const { trip } = props
  const departureId = String(trip.get('departureId'))
  return {
    hideMyPhone: getHideMyPhone(state),
    modifiedPax: getModifiedPax(state, departureId)
  }
}

export default connect(stateToProps, null)(Trip)

const ss = StyleSheet.create({
  wrapper: {
    flex: 1
  },
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
    justifyContent: 'center',
    backgroundColor: Colors.blue
  },
  cardItem: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  restaurantName: {
    color: Colors.blue
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 7
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
    paddingBottom: 7
  },
  subtitle: {
    fontSize: 13
  },
  headerLeft: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'flex-start'
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
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paxCountBody: {
    flex: 4,
    alignItems: 'center',
    flexDirection: 'row'
  },
  paxCountRight: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  rollCallButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 4,
    backgroundColor: Colors.blue
    // marginRight: 20
  },
  rollCallText: {
    color: Colors.white,
    fontWeight: 'bold'
  },
  flightCon: {
    paddingLeft: 10,
    paddingTop: 15
  },
  flightCard: {
    height: 180,
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
  },
  left: {
    flex: 2
  }
})
