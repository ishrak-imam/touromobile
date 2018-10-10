
// import React from 'react'
// import isIOS from '../utils/isIOS'
// import { BottomTabBar, MaterialTopTabBar } from 'react-navigation-tabs'

// const TabBarComponent = (props) => {
// const { navigation, ...options } = props
// const TabBar = isIOS ? BottomTabBar : MaterialTopTabBar
// return (
//   <TabBar
//     navigation={navigation}
//     {...options}
//     showLabel={false}
//     showIcon
//   />
// )
// }

// export default TabBarComponent

import React, { Component } from 'react'
import isIOS from '../utils/isIOS'
import { BottomTabBar, MaterialTopTabBar } from 'react-navigation-tabs'
import { currentTripSelector } from '../selectors'
import { connect } from 'react-redux'
import { Colors } from '../theme'

class TabBarComponent extends Component {
  render () {
    const { navigation, trip, ...options } = this.props
    const TabBar = isIOS ? BottomTabBar : MaterialTopTabBar
    const brand = trip.get('brand')

    const color = Colors[`${brand}Brand`] || Colors.blue

    // const others = {
    //   style: {}
    // }
    // isIOS
    //   ? others.activeTintColor = color
    //   : others.style.backgroundColor = color

    const others = {
      activeTintColor: color,
      style: {
        backgroundColor: Colors.silver
      }
    }

    return (
      <TabBar
        navigation={navigation}
        {...options}
        showLabel={false}
        showIcon
        {...others}
        inactiveTintColor={Colors.charcoal}
      />
    )
  }
}

const stateToProps = state => ({
  trip: currentTripSelector(state).get('trip')
})

export default connect(stateToProps, null)(TabBarComponent)
