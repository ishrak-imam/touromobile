import React, { Component } from 'react'
import {
  Container, CardItem, Text,
  View, Body, Right, Item
} from 'native-base'
import Header from '../../components/header'
import IconButton from '../../components/iconButton'
import { format } from 'date-fns'
import { StyleSheet, ScrollView } from 'react-native'
import { call, sms, web, map } from '../../utils/comms'
import { IonIcon } from '../../theme'
import isEmpty from '../../utils/isEmpty'
import Translator from '../../utils/translator'
import { listToMap } from '../../utils/immutable'

const DATE_FORMAT = 'YY MM DD, h:mm'
const _T = Translator('RestaurantScreen')

export default class RestaurantScreen extends Component {
  _renderRestaurant = restaurant => {
    const address = restaurant.get('address')
    const zip = restaurant.get('zip')
    const city = restaurant.get('city')
    const country = restaurant.get('country')
    const directions = restaurant.get('directions')
    const time = restaurant.get('time')
    const location = `${address}, ${zip}, ${city}, ${country}`
    return (
      <CardItem>
        <Body style={ss.restaurantBody}>
          <View>
            <Text style={ss.boldText}>{_T('address')}</Text>
            <Text>{address}</Text>
            <Text>{`${zip} ${city}`}</Text>
            <Text>{country}</Text>
            <Text style={ss.sectionHeader}>{_T('routeDirections')}</Text>
            <Text note>{directions}</Text>
            <Text style={ss.sectionHeader}>{_T('bookedTime')}</Text>
            <Text>{format(time, DATE_FORMAT)}</Text>
          </View>
          <Right style={ss.mapIcon}>
            <IconButton name='map' color='blue' onPress={() => map(location)} />
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
          {!!url && <IconButton name='web' color='blue' onPress={() => web(url)} />}
          <IconButton name='phone' color='green' onPress={() => call(phone)} />
          <IconButton name='sms' color='blue' onPress={() => sms(phone)} />
        </Body>
      </CardItem>
    )
  }

  _renderMeals = meals => {
    return (
      <CardItem>
        <Body>
          <Item style={ss.item}>
            <Text style={ss.boldText}>{_T('meals')}</Text>
            <Right><Text>{`${_T('adult')}/${_T('child')}`}</Text></Right>
          </Item>
          {meals.map(m => {
            const id = m.get('id')
            const name = m.get('name')
            const adult = m.get('adult')
            const child = m.get('child')
            const adultObj = adult === null ? <IonIcon name='x' color='red' size={14} /> : adult
            const childObj = child === null ? <IonIcon name='x' color='red' size={14} /> : child
            return (
              <Item key={id} style={ss.item}>
                <Text style={ss.itemText}>{name}</Text>
                <Right style={ss.itemRight}>
                  <Text>{adultObj} / {childObj}</Text>
                </Right>
              </Item>
            )
          })}
        </Body>
      </CardItem>
    )
  }

  _renderOrders = (orders, restaurant) => {
    const meals = listToMap(restaurant.get('meals'), 'id')
    const beverages = listToMap(restaurant.get('beverages'), 'id')

    let adultMealOrders = {}
    let childMealOrders = {}
    let beverageOrders = {}

    orders.map(o => {
      const mealCount = o.get('adult')
        ? adultMealOrders[o.get('meal')] || 0
        : childMealOrders[o.get('meal')] || 0

      o.get('adult')
        ? adultMealOrders[o.get('meal')] = mealCount + 1
        : childMealOrders[o.get('meal')] = mealCount + 1

      const beverageCount = beverageOrders[o.get('drink')] || 0
      beverageOrders[o.get('drink')] = beverageCount + 1
    })

    const showAge = !isEmpty(childMealOrders)

    const renderOrder = (id, name, right) => {
      return (
        <Item key={id} style={ss.item}>
          <Text style={ss.itemText}>{name}</Text>
          <Right style={ss.itemRight}>
            <Text>{right}</Text>
          </Right>
        </Item>
      )
    }

    const renderOrderSummary = (orders, lookup) => {
      return Object.keys(orders).map(k => renderOrder(k, lookup.get(k).get('name'), orders[k]))
    }

    return (
      <CardItem>
        <Body>
          <Item style={ss.item}>
            <Text style={ss.boldText}>{_T('orders')}</Text>
            <Right><Text>{_T('amount')}</Text></Right>
          </Item>

          <Text note>{_T('meals')}</Text>
          {showAge && <Text note>{_T('adults')}</Text>}
          {renderOrderSummary(adultMealOrders, meals)}

          {showAge && <Text note>{_T('children')}</Text>}
          {renderOrderSummary(childMealOrders, meals)}

          <Text note>{_T('beverages')}</Text>
          {renderOrderSummary(beverageOrders, beverages)}
        </Body>
      </CardItem>
    )
  }

  render () {
    const { navigation } = this.props
    const direction = navigation.getParam('direction')
    const restaurant = navigation.getParam('restaurant')
    const orders = navigation.getParam('orders')
    const brand = navigation.getParam('brand')
    const meals = restaurant.get('meals')

    return (
      <Container>
        <Header left='back' title={restaurant.get('name')} navigation={navigation} brand={brand} />
        <ScrollView>
          <View style={ss.containerCard}>
            {this._renderRestaurant(restaurant)}
            {this._renderComs(restaurant)}
            {this._renderMeals(meals)}
            {!!orders && this._renderOrders(orders.get(direction), restaurant)}
          </View>
        </ScrollView>
      </Container>
    )
  }
}

const ss = StyleSheet.create({
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
  item: {
    paddingVertical: 5
  },
  itemRight: {
    alignContent: 'center'
  },
  itemText: {
    flex: 1
  },
  comms: {
    flexDirection: 'row'
  },
  mapIcon: {
    alignSelf: 'flex-start'
  }
})
