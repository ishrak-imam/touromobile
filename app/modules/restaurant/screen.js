import React, { Component } from 'react'
import {
  Container, CardItem, Text,
  View, Body, Right, Item
} from 'native-base'
import Header from '../../components/header'
import IconButton from '../../components/iconButton'
// import { format } from 'date-fns'
import { StyleSheet, ScrollView, FlatList } from 'react-native'
import { call, sms, web, map } from '../../utils/comms'
import { IonIcon, Colors } from '../../theme'
// import isEmpty from '../../utils/isEmpty'
import isIphoneX from '../../utils/isIphoneX'
import _T from '../../utils/translator'
import { listToMap } from '../../utils/immutable'
import { connect } from 'react-redux'
import { getOrdersByDirection, getPaxByHotel, getOrderMode } from '../../selectors'
import PaxInThisHotel from '../../components/paxWithoutOrder'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'

// const DATE_FORMAT = 'YYYY-MM-DD HH:mm'

class RestaurantScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showMeals: false,
      showOrders: false,
      showPaxInHotel: false
    }
  }

  componentDidMount () {
    /**
     * Screen transition optimization
     * by delayed rendering.
     */
    this._showMeals()
    this._showOrders()
    this._showPaxInHotel()
  }

  _showMeals = () => {
    setTimeout(() => this.setState({ showMeals: true }), 250)
  }

  _showOrders = () => {
    setTimeout(() => this.setState({ showOrders: true }), 500)
  }

  _showPaxInHotel = () => {
    setTimeout(() => this.setState({ showPaxInHotel: true }), 250)
  }

  _renderRestaurant = restaurant => {
    const address = restaurant.get('address')
    const zip = restaurant.get('zip')
    const city = restaurant.get('city')
    const country = restaurant.get('country')
    const directions = restaurant.get('directions')
    // const time = restaurant.get('time')
    const location = `${address}, ${zip}, ${city}, ${country}`
    return (
      <CardItem>
        <Body style={ss.restaurantBody}>
          <View>
            <Text style={ss.boldText}>{_T('address')}</Text>
            <Text>{address}</Text>
            <Text>{`${zip} ${city}`}</Text>
            <Text>{country}</Text>

            {
              !!directions &&
              <View>
                <Text style={ss.sectionHeader}>{_T('routeDirections')}</Text>
                <Text note>{directions}</Text>
              </View>
            }

            {/* {
              !!time &&
              <View>
                <Text style={ss.sectionHeader}>{_T('bookedTime')}</Text>
                <Text>{format(time, DATE_FORMAT)}</Text>
              </View>
            } */}

          </View>
          <Right style={ss.mapIcon}>
            <IconButton name='map' color={Colors.blue} onPress={() => map(location)} />
          </Right>
        </Body>
      </CardItem>
    )
  }

  _renderComs = restaurant => {
    const url = restaurant.get('url')
    const phone = restaurant.get('phone')
    return (
      <CardItem>
        <Body style={ss.comms}>
          {!!url && <IconButton name='web' color={Colors.blue} onPress={() => web(url)} />}
          {!!phone && <IconButton name='phone' color={Colors.green} onPress={() => call(phone)} />}
          {!!phone && <IconButton name='sms' color={Colors.blue} onPress={() => sms(phone)} />}
        </Body>
      </CardItem>
    )
  }

  _renderMealItem = ({ item }) => {
    const name = item.get('name')
    const adult = item.get('adult')
    const child = item.get('child')
    const adultObj = adult === null ? <IonIcon name='x' color={Colors.fire} size={14} /> : adult
    const childObj = child === null ? <IonIcon name='x' color={Colors.fire} size={14} /> : child
    return (
      <Item style={ss.item}>
        <Text style={ss.itemText}>{name}</Text>
        <Right style={ss.itemRight}>
          <Text>{adultObj} / {childObj}</Text>
        </Right>
      </Item>
    )
  }

  _renderMeals = meals => {
    return (
      <View style={ss.mealContainer}>
        <Item style={ss.item}>
          <Text style={ss.boldText}>{_T('meals')}</Text>
          <Right><Text style={ss.boldText}>{`${_T('adult')}/${_T('child')}`}</Text></Right>
        </Item>
        <ImmutableVirtualizedList
          immutableData={meals}
          renderItem={this._renderMealItem}
          keyExtractor={item => String(item.get('id'))}
          renderEmpty={_T('noMealData')}
        />
      </View>
    )
  }

  _renderAllergyOrder = (lookup, orders) => {
    return ({ item }) => {
      const name = `${lookup.get(item).get('name')} (${orders[item].allergyText})`
      const count = orders[item].count
      return (
        <Item style={ss.item}>
          <Text style={ss.itemText}>{name}</Text>
          <Right style={ss.itemRight}>
            <Text>{count}</Text>
          </Right>
        </Item>
      )
    }
  }

  _renderOrder = (lookup, orders) => {
    return ({ item }) => {
      const name = lookup.get(item).get('name')
      const count = orders[item]
      return (
        <Item style={ss.item}>
          <Text style={ss.itemText}>{name}</Text>
          <Right style={ss.itemRight}>
            <Text>{count}</Text>
          </Right>
        </Item>
      )
    }
  }

  _renderOrders = (orders, restaurant) => {
    const meals = listToMap(restaurant.get('meals'), 'id')
    const beverages = listToMap(restaurant.get('beverages'), 'id')

    let adultMealOrders = {}
    let childMealOrders = {}
    let beverageOrders = {}

    let adultAllergyOrders = {}
    let childAllergyOrders = {}

    const regularOrders = orders.filter(o => !o.get('allergyText'))
    const allergyOrders = orders.filter(o => o.get('allergyText'))

    regularOrders.map(o => {
      if (o.get('meal')) {
        const mealCount = o.get('adult')
          ? adultMealOrders[o.get('meal')] || 0
          : childMealOrders[o.get('meal')] || 0

        o.get('adult')
          ? adultMealOrders[o.get('meal')] = mealCount + 1
          : childMealOrders[o.get('meal')] = mealCount + 1
      }

      if (o.get('drink')) {
        const beverageCount = beverageOrders[o.get('drink')] || 0
        beverageOrders[o.get('drink')] = beverageCount + 1
      }
    })

    allergyOrders.map(o => {
      if (o.get('meal')) {
        const meal = o.get('adult')
          ? adultAllergyOrders[o.get('meal')] || { count: 0, allergyText: '' }
          : childAllergyOrders[o.get('meal')] || { count: 0, allergyText: '' }

        o.get('adult')
          ? adultAllergyOrders[o.get('meal')] = { count: meal.count + 1, allergyText: o.get('allergyText') }
          : childAllergyOrders[o.get('meal')] = { count: meal.count + 1, allergyText: o.get('allergyText') }
      }
    })

    return (
      <View style={ss.orderContainer}>
        <Item style={ss.item}>
          <Text style={ss.boldText}>{_T('orders')}</Text>
          <Right><Text style={ss.boldText}>{_T('amount')}</Text></Right>
        </Item>

        {/* <Text note>{_T('meals')}</Text> */}
        <Text note style={ss.label}>{_T('adult')}</Text>
        <FlatList
          data={Object.keys(adultMealOrders)}
          keyExtractor={item => item}
          renderItem={this._renderOrder(meals, adultMealOrders)}
        />
        <FlatList
          data={Object.keys(adultAllergyOrders)}
          keyExtractor={item => item}
          renderItem={this._renderAllergyOrder(meals, adultAllergyOrders)}
        />

        <Text note style={ss.label}>{_T('children')}</Text>
        <FlatList
          data={Object.keys(childMealOrders)}
          keyExtractor={item => item}
          renderItem={this._renderOrder(meals, childMealOrders)}
        />
        <FlatList
          data={Object.keys(childAllergyOrders)}
          keyExtractor={item => item}
          renderItem={this._renderAllergyOrder(meals, childAllergyOrders)}
        />

        <Text note style={ss.label}>{_T('beverages')}</Text>
        <FlatList
          data={Object.keys(beverageOrders)}
          keyExtractor={item => item}
          renderItem={this._renderOrder(beverages, beverageOrders)}
        />
      </View>
    )
  }

  render () {
    const { showMeals, showOrders, showPaxInHotel } = this.state
    const { navigation, orders, paxByHotel } = this.props
    const restaurant = navigation.getParam('restaurant')
    const brand = navigation.getParam('brand')
    const meals = restaurant.get('meals')

    return (
      <Container>
        <Header left='back' title={restaurant.get('name')} navigation={navigation} brand={brand} />
        <ScrollView contentContainerStyle={ss.container}>
          <View style={ss.containerCard}>
            {!!restaurant && this._renderRestaurant(restaurant)}
            {!!restaurant && this._renderComs(restaurant)}
            {showMeals && !!meals && this._renderMeals(meals)}
            {showOrders && !!orders.size && this._renderOrders(orders, restaurant)}
            {
              showPaxInHotel && !!paxByHotel.size &&
              <PaxInThisHotel paxList={paxByHotel} label='paxInThisHotel' />
            }
          </View>
        </ScrollView>
      </Container>
    )
  }
}

const stateToProps = (state, props) => {
  const { navigation } = props
  const direction = navigation.getParam('direction')
  const departureId = navigation.getParam('departureId')
  const restaurant = navigation.getParam('restaurant')
  const orderMode = getOrderMode(state)
  return {
    orders: getOrdersByDirection(state, departureId, direction, orderMode),
    paxByHotel: getPaxByHotel(state, restaurant.get('id'))
  }
}

export default connect(stateToProps, null)(RestaurantScreen)

const ss = StyleSheet.create({
  container: {
    paddingBottom: isIphoneX ? 20 : 0
  },
  containerCard: {
    paddingBottom: 10
  },
  restaurantBody: {
    flexDirection: 'row'
  },
  boldText: {
    fontWeight: 'bold'
  },
  sectionHeader: {
    fontWeight: 'bold',
    marginTop: 12
  },
  mealContainer: {
    margin: 10
  },
  orderContainer: {
    margin: 10
  },
  item: {
    paddingVertical: 5
  },
  itemRight: {
    alignContent: 'center',
    paddingRight: 10
  },
  itemText: {
    flex: 1
  },
  comms: {
    flexDirection: 'row'
  },
  mapIcon: {
    alignSelf: 'flex-start'
  },
  label: {
    marginTop: 15
  }
})
