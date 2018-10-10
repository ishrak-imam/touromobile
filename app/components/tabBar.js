
import React from 'react'
import isIOS from '../utils/isIOS'
import { Colors } from '../theme'
import { BottomTabBar, MaterialTopTabBar } from 'react-navigation-tabs'

const TabBarComponent = (props) => {
  const { navigation, ...options } = props
  const TabBar = isIOS ? BottomTabBar : MaterialTopTabBar
  return (
    <TabBar
      navigation={navigation} {...options}
      showLabel={false}
      showIcon
      style={{ backgroundColor: Colors.sliver }}
      activeTintColor={Colors.blue}
      inactiveTintColor={Colors.charcoal}
    />
  )
}

export default TabBarComponent
