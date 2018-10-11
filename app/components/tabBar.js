
import React from 'react'
import isIOS from '../utils/isIOS'
import { Colors } from '../theme'
import { BottomTabBar, MaterialTopTabBar } from 'react-navigation-tabs'

const TabBarComponent = ({ navigation, ...options }) => {
  const TabBar = isIOS ? BottomTabBar : MaterialTopTabBar
  return (
    <TabBar
      navigation={navigation}
      {...options}
      showLabel={false}
      showIcon
      style={{ backgroundColor: Colors.sliver }}
      activeTintColor={Colors.blue}
      inactiveTintColor={Colors.charcoal}
    />
  )
}

export default TabBarComponent
