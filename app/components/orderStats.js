
import React, { Component } from 'react'
import {
  ListItem, Left, View, Text,
  Right
} from 'native-base'
import { StyleSheet, ScrollView } from 'react-native'
import OutHomeTab from './outHomeTab'
import { Colors } from '../theme'
import { listToMap, getSet } from '../utils/immutable'
import Translator from '../utils/translator'
import PaxWithoutOrder from './paxWithoutOrder'
import BookingsWithoutOrder from './bookingsWithoutOrder'

const _T = Translator('ReportsScreen')

const INDIVIDUAL_MODE = 'INDIVIDUAL'
const SUMMARY_MODE = 'SUMMARY'

export default class OrderStats extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 'out'
    }
  }

  get mealsData () {
    const { orders, meals } = this.props
    const { tab } = this.state
    const direction = orders.get(tab)

    const mealsData = direction.reduce((map, order) => {
      const isAdult = order.get('adult')
      const mealId = String(order.get('meal'))
      if (mealId !== 'null') {
        const item = map.orders[mealId] || { meal: mealId, adultCount: 0, childCount: 0 }
        if (!map[mealId]) { // new meal
          if (isAdult) map.total.adult = map.total.adult + 1
          if (!isAdult) map.total.child = map.total.child + 1
        }
        if (isAdult) item.adultCount = item.adultCount + 1
        if (!isAdult) item.childCount = item.childCount + 1
        map.orders[mealId] = item
      }

      return map
    }, { orders: {}, total: { adult: 0, child: 0 } })

    mealsData.meals = listToMap(meals.get(tab), 'id')
    return mealsData
  }

  get beveragesData () {
    const { orders, beverages } = this.props
    const { tab } = this.state
    const direction = orders.get(tab)

    const beveragesData = direction.reduce((map, order) => {
      const isAdult = order.get('adult')
      const drinkId = String(order.get('drink'))
      if (drinkId !== 'null') {
        const item = map.orders[drinkId] || { drink: drinkId, adultCount: 0, childCount: 0 }
        if (!map[drinkId]) { // new drink
          if (isAdult) map.total.adult = map.total.adult + 1
          if (!isAdult) map.total.child = map.total.child + 1
        }
        if (isAdult) item.adultCount = item.adultCount + 1
        if (!isAdult) item.childCount = item.childCount + 1
        map.orders[drinkId] = item
      }

      return map
    }, { orders: {}, total: { adult: 0, child: 0 } })

    beveragesData.drinks = listToMap(beverages.get(tab), 'id')
    return beveragesData
  }

  get paxWithoutOrder () {
    const { orders, pax } = this.props
    const { tab } = this.state
    const direction = orders.get(tab)

    const paxWithOrders = direction.reduce((set, o) => {
      return set.add(o.get('pax'))
    }, getSet([]))

    return pax.filter(p => {
      const paxId = String(p.get('id'))
      return !paxWithOrders.has(paxId)
    })
  }

  get bookingsWithoutOrder () {
    const { orders, bookings } = this.props
    const { tab } = this.state
    const direction = orders.get(tab)

    const bookingWithOrders = direction.reduce((set, o) => {
      return set.add(o.get('booking'))
    }, getSet([]))

    return bookings.filter(b => {
      const bookingId = String(b.get('id'))
      return !bookingWithOrders.has(bookingId)
    })
  }

  _onTabSwitch = tab => {
    return () => {
      this.setState({ tab })
    }
  }

  _renderHeader = () => {
    const { tab } = this.state
    return (
      <ListItem style={ss.header}>
        <Left style={ss.headerLeft}>
          <Text style={ss.headerText}>{_T('orderSummary')}</Text>
        </Left>
        <Right style={ss.headerRight}>
          <OutHomeTab selected={tab} onPress={this._onTabSwitch} />
        </Right>
      </ListItem>
    )
  }

  _renderMealOrders = () => {
    const { pax } = this.props
    const { orders, total, meals } = this.mealsData
    return (
      <View style={ss.mealItem}>
        <ListItem style={ss.header}>
          <Left style={ss.topLeft}>
            <Text style={ss.boldText}>{_T('meals')}</Text>
          </Left>
          <Right style={ss.topRight}>
            <View style={ss.cell}>
              <Text style={ss.boldText}>{_T('adult')}</Text>
            </View>

            <View style={ss.cell}>
              <Text style={ss.boldText}>{_T('child')}</Text>
            </View>

            <View style={ss.cell}>
              <Text style={ss.boldText}>{_T('total')}</Text>
            </View>
          </Right>
        </ListItem>

        {
          Object.values(orders).map(o => {
            return (
              <ListItem style={ss.item} key={o.meal}>
                <Left style={ss.itemLeft}>
                  <Text style={ss.itemName}>{meals.get(o.meal).get('name')}</Text>
                </Left>
                <Right style={ss.itemRight}>
                  <View style={ss.cell}>
                    <Text>{o.adultCount}</Text>
                  </View>
                  <View style={ss.cell}>
                    <Text>{o.childCount}</Text>
                  </View>
                  <View style={ss.cell}>
                    <Text>{o.adultCount + o.childCount}</Text>
                  </View>
                </Right>
              </ListItem>
            )
          })
        }

        <ListItem style={ss.item}>
          <Left style={ss.itemLeft} />
          <Right style={ss.itemRight}>
            <View style={ss.cell}>
              <Text style={ss.boldText}>{total.adult}</Text>
            </View>

            <View style={ss.cell}>
              <Text style={ss.boldText}>{total.child}</Text>
            </View>

            <View style={ss.cell}>
              <Text style={ss.boldText}>{`${total.adult + total.child}/${pax.size}`}</Text>
            </View>
          </Right>
        </ListItem>
      </View>
    )
  }

  _renderBeverageOrders = () => {
    const { pax } = this.props
    const { orders, total, drinks } = this.beveragesData

    return (
      <View style={ss.mealItem}>
        <ListItem style={ss.header}>
          <Left style={ss.topLeft}>
            <Text style={ss.boldText}>{_T('beverages')}</Text>
          </Left>
          <Right style={ss.topRight}>
            <View style={ss.cell}>
              <Text style={ss.boldText}>{_T('adult')}</Text>
            </View>

            <View style={ss.cell}>
              <Text style={ss.boldText}>{_T('child')}</Text>
            </View>

            <View style={ss.cell}>
              <Text style={ss.boldText}>{_T('total')}</Text>
            </View>
          </Right>
        </ListItem>

        {
          Object.values(orders).map(o => {
            return (
              <ListItem style={ss.item} key={o.drink}>
                <Left style={ss.itemLeft}>
                  <Text style={ss.itemName}>{drinks.get(o.drink).get('name')}</Text>
                </Left>
                <Right style={ss.itemRight}>
                  <View style={ss.cell}>
                    <Text>{o.adultCount}</Text>
                  </View>
                  <View style={ss.cell}>
                    <Text>{o.childCount}</Text>
                  </View>
                  <View style={ss.cell}>
                    <Text>{o.adultCount + o.childCount}</Text>
                  </View>
                </Right>
              </ListItem>
            )
          })
        }

        <ListItem style={ss.item}>
          <Left style={ss.itemLeft} />
          <Right style={ss.itemRight}>
            <View style={ss.cell}>
              <Text style={ss.boldText}>{total.adult}</Text>
            </View>

            <View style={ss.cell}>
              <Text style={ss.boldText}>{total.child}</Text>
            </View>

            <View style={ss.cell}>
              <Text style={ss.boldText}>{`${total.adult + total.child}/${pax.size}`}</Text>
            </View>
          </Right>
        </ListItem>
      </View>
    )
  }

  render () {
    const { enableScrollViewScroll } = this.state
    const { orderMode } = this.props
    return (
      <View style={ss.container}>
        {this._renderHeader()}
        <ScrollView scrollEnabled={enableScrollViewScroll}>
          {this._renderMealOrders()}
          {this._renderBeverageOrders()}

          {
            orderMode === SUMMARY_MODE &&
            <BookingsWithoutOrder bookingsList={this.bookingsWithoutOrder} label='bookingsWithoutOrder' />
          }

          {
            orderMode === INDIVIDUAL_MODE &&
            <PaxWithoutOrder paxList={this.paxWithoutOrder} label='paxWithoutOrder' />
          }

        </ScrollView>
      </View>
    )
  }
}

const ss = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    marginRight: 15,
    paddingBottom: 5,
    borderBottomColor: Colors.steel,
    borderBottomWidth: 1,
    paddingRight: 0,
    marginLeft: 15,
    marginBottom: 10
  },
  mealItem: {
    marginBottom: 20
  },
  item: {
    marginRight: 15,
    paddingBottom: 5,
    borderBottomWidth: 0,
    paddingRight: 0,
    marginLeft: 15,
    marginBottom: 10
  },
  itemName: {
    paddingRight: 10
  },
  headerLeft: {
    flex: 3
  },
  headerRight: {
    flex: 2
  },
  headerText: {
    fontWeight: 'bold'
  },
  topLeft: {
    flex: 1
  },
  topRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemLeft: {
    flex: 1
  },
  itemRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 14
  }
})
