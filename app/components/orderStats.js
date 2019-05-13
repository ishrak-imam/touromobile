
import React, { Component } from 'react'
import {
  ListItem, Left, View, Text,
  Right
} from 'native-base'
import { StyleSheet, ScrollView } from 'react-native'
import OutHomeTab from './outHomeTab'
import { Colors } from '../theme'
import { listToMap, getSet, getList } from '../utils/immutable'
import _T from '../utils/translator'
import NoData from './noData'
import BookingsWithoutOrder from './bookingsWithoutOrder'
import BookingsWithIssues from './bookingsWithIssues'

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
      if (order.get('meal')) {
        const mealId = String(order.get('meal'))
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
      if (order.get('drink')) {
        const drinkId = String(order.get('drink'))
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

  get bookingsWithoutOrder () {
    const { orders, bookings, brand, departureId } = this.props
    const { tab } = this.state
    const direction = orders.get(tab)

    const bookingWithOrders = direction.reduce((set, o) => {
      return set.add(o.get('booking'))
    }, getSet([]))

    return bookings.reduce((list, b) => {
      const bookingId = String(b.get('id'))
      const pax = b.get('pax')
      if (!bookingWithOrders.has(bookingId) && pax.size > 0) {
        list = list.push({
          booking: b,
          brand,
          departureId
        })
      }
      return list
    }, getList([]))
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

  _renderOrderStats = () => {
    const { beverages, issues, orderIssues } = this.props

    return (
      <View>
        {this._renderHeader()}
        <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
          {this._renderMealOrders()}
          {beverages.get('out') && beverages.get('home') && this._renderBeverageOrders()}

          <BookingsWithoutOrder bookingsList={this.bookingsWithoutOrder} label='bookingsWithoutOrder' />

          {
            orderIssues.canUploadReport &&
            <BookingsWithIssues issues={issues} orderIssues={orderIssues} label='Bookings with issues' />
          }

        </ScrollView>
      </View>
    )
  }

  render () {
    const { isFlight } = this.props
    return (
      <View style={ss.container}>
        {
          isFlight
            ? <NoData text='flightTripNoOrder' textStyle={{ marginTop: 30 }} />
            : this._renderOrderStats()
        }
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
