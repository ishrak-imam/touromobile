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
import { IonIcon, Colors } from '../../theme'
// import isEmpty from '../../utils/isEmpty'
import isIphoneX from '../../utils/isIphoneX'
import Translator from '../../utils/translator'
import { listToMap } from '../../utils/immutable'
import beverageList from '../../utils/beverages'
import { connect } from 'react-redux'
import { getOrdersByDirection } from '../../selectors'

const DATE_FORMAT = 'YYYY-MM-DD HH:mm'

const _T = Translator('RestaurantScreen')

class RestaurantScreen extends Component {
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

            {
              !!directions &&
              <View>
                <Text style={ss.sectionHeader}>{_T('routeDirections')}</Text>
                <Text note>{directions}</Text>
              </View>
            }

            {
              !!time &&
              <View>
                <Text style={ss.sectionHeader}>{_T('bookedTime')}</Text>
                <Text>{format(time, DATE_FORMAT)}</Text>
              </View>
            }

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

  _renderMeals = meals => {
    return (
      <CardItem>
        <Body>
          <Item style={ss.item}>
            <Text style={ss.boldText}>{_T('meals')}</Text>
            <Right><Text style={ss.boldText}>{`${_T('adult')}/${_T('child')}`}</Text></Right>
          </Item>
          {meals.map(m => {
            const id = m.get('id')
            const name = m.get('name')
            const adult = m.get('adult')
            const child = m.get('child')
            const adultObj = adult === null ? <IonIcon name='x' color={Colors.fire} size={14} /> : adult
            const childObj = child === null ? <IonIcon name='x' color={Colors.fire} size={14} /> : child
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
    // const beverages = listToMap(restaurant.get('beverages'), 'id')
    const beverages = listToMap(beverageList, 'id')

    let adultMealOrders = {}
    let childMealOrders = {}
    let beverageOrders = {}

    orders.map(o => {
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

    // const showAge = !isEmpty(childMealOrders)

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
            <Right><Text style={ss.boldText}>{_T('amount')}</Text></Right>
          </Item>

          {/* <Text note>{_T('meals')}</Text> */}
          <Text note style={ss.label}>{_T('adults')}</Text>
          {renderOrderSummary(adultMealOrders, meals)}

          <Text note style={ss.label}>{_T('children')}</Text>
          {renderOrderSummary(childMealOrders, meals)}

          <Text note style={ss.label}>{_T('beverages')}</Text>
          {renderOrderSummary(beverageOrders, beverages)}
        </Body>
      </CardItem>
    )
  }

  render () {
    const { navigation, orders } = this.props
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
            {!!meals && this._renderMeals(meals)}
            {!!orders && this._renderOrders(orders, restaurant)}
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

  return {
    orders: getOrdersByDirection(state, departureId, direction)
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
