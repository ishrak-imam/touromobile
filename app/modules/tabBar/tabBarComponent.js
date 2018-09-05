
import React from 'react'
import { Platform } from 'react-native'
import { TabBarBottom, TabBarTop } from 'react-navigation'

const TabBarComponent = (props) => {
  const { navigation, ...options } = props
  const isIOS = Platform.OS === 'ios'
  const TabBar = isIOS ? TabBarBottom : TabBarTop
  return <TabBar navigation={navigation} {...options} showLabel={false} showIcon />
}

export default TabBarComponent
