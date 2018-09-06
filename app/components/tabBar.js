
import React from 'react'
import isIOS from '../utils/isIOS'
import { BottomTabBar, MaterialTopTabBar  } from 'react-navigation-tabs'

const TabBarComponent = (props) => {
  const { navigation, ...options } = props
  const TabBar = isIOS ? BottomTabBar : MaterialTopTabBar
  return (
    <TabBar
      navigation={navigation} {...options}
      showLabel={false}
      showIcon
    />
  )
}

export default TabBarComponent
