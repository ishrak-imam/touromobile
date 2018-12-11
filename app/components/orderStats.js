
import React, { Component } from 'react'
import {
  ListItem, Left, View, Text,
  Right
} from 'native-base'
import { StyleSheet, ScrollView } from 'react-native'
import OutHomeTab from './outHomeTab'
import { Colors } from '../theme'
import { listToMap } from '../utils/immutable'

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
      const item = map.orders[mealId] || { meal: mealId, adultCount: 0, childCount: 0 }
      if (!map[mealId]) { // new meal
        if (isAdult) map.total.adult = map.total.adult + 1
        if (!isAdult) map.total.child = map.total.child + 1
      }
      if (isAdult) item.adultCount = item.adultCount + 1
      if (!isAdult) item.childCount = item.childCount + 1
      map.orders[mealId] = item
      return map
    }, { orders: {}, total: { adult: 0, child: 0 } })

    mealsData.meals = listToMap(meals.get(tab), 'id')
    return mealsData
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
          <Text style={ss.headerText}>Order Summary</Text>
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
            <Text style={ss.boldText}>Meals</Text>
          </Left>
          <Right style={ss.topRight}>
            <Text style={ss.boldText}>Adult</Text>
            <Text style={ss.boldText}>Child</Text>
            <Text style={ss.boldText}>Total</Text>
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
                  <Text>{o.adultCount}</Text>
                  <Text>{o.childCount}</Text>
                  <Text>{o.adultCount + o.childCount}</Text>
                </Right>
              </ListItem>
            )
          })
        }
        <ListItem style={ss.item}>
          <Left style={ss.itemLeft} />
          <Right style={ss.itemRight}>
            <Text style={ss.boldText}>{total.adult}</Text>
            <Text style={ss.boldText}>{total.child}</Text>
            <Text style={ss.boldText}>{`${total.adult + total.child}/${pax.size}`}</Text>
          </Right>
        </ListItem>
      </View>
    )
  }

  _renderBeverageOrders = () => {
    return (
      <View style={ss.mealItem}>
        <ListItem style={ss.header}>
          <Left style={ss.topLeft}>
            <Text style={ss.boldText}>Beverages</Text>
          </Left>
          <Right style={ss.topRight}>
            <View style={ss.cell}>
              <Text style={ss.boldText}>Adult</Text>
            </View>

            <View style={ss.cell}>
              <Text style={ss.boldText}>Child</Text>
            </View>

            <View style={ss.cell}>
              <Text style={ss.boldText}>Total</Text>
            </View>
          </Right>
        </ListItem>

        <ListItem style={ss.item}>
          <Left style={ss.itemLeft}>
            <Text style={ss.itemName}>Coke</Text>
          </Left>
          <Right style={ss.itemRight}>

            <View style={ss.cell}>
              <Text>32</Text>
            </View>

            <View style={ss.cell}>
              <Text>32</Text>
            </View>

            <View style={ss.cell}>
              <Text>32</Text>
            </View>

          </Right>
        </ListItem>

        <ListItem style={ss.item}>
          <Left style={ss.itemLeft}>
            <Text style={ss.itemName}>Beer</Text>
          </Left>
          <Right style={ss.itemRight}>
            <View style={ss.cell}>
              <Text>32</Text>
            </View>

            <View style={ss.cell}>
              <Text>32</Text>
            </View>

            <View style={ss.cell}>
              <Text>32</Text>
            </View>
          </Right>
        </ListItem>

        <ListItem style={ss.item}>
          <Left style={ss.itemLeft} />
          <Right style={ss.itemRight}>
            <View style={ss.cell}>
              <Text style={ss.boldText}>32</Text>
            </View>

            <View style={ss.cell}>
              <Text style={ss.boldText}>32</Text>
            </View>

            <View style={ss.cell}>
              <Text style={ss.boldText}>32/100</Text>
            </View>
          </Right>
        </ListItem>
      </View>
    )
  }

  _renderWithoutOrder = () => {
    return (
      <View style={ss.mealItem}>
        <ListItem style={ss.header}>
          <Left style={ss.bottomLeft}>
            <Text style={ss.boldText}>Passengers without order</Text>
          </Left>
          <Right style={ss.bottomRight}>
            <Text style={ss.boldText}>Booking</Text>
          </Right>
        </ListItem>

        <ListItem style={ss.item}>
          <Left style={ss.bottomLeft}>
            <Text>Ishrak Imam</Text>
          </Left>
          <Right style={ss.bottomRight}>
            <Text>123456</Text>
          </Right>
        </ListItem>

        <ListItem style={ss.item}>
          <Left style={ss.bottomLeft}>
            <Text>Ishrak Imam</Text>
          </Left>
          <Right style={ss.bottomRight}>
            <Text>123456</Text>
          </Right>
        </ListItem>
      </View>
    )
  }

  render () {
    // const { orders, pax, meals } = this.props
    // const { tab } = this.state
    // const direction = orders.get(tab)

    // console.log(direction.toJS())
    // console.log(pax.toJS())
    // console.log(meals.toJS())

    // console.log(this.mealsData)

    return (
      <View style={ss.container}>
        {this._renderHeader()}
        <ScrollView>
          {this._renderMealOrders()}
          {/* {this._renderBeverageOrders()}
          {this._renderWithoutOrder()} */}
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
    justifyContent: 'space-around'
  },
  itemLeft: {
    flex: 1
  },
  itemRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  bottomLeft: {
    flex: 2
  },
  bottomRight: {
    flex: 1,
    paddingRight: 10
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
