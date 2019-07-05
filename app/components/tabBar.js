
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import isIOS from '../utils/isIOS'
import { Colors } from '../theme'
import { BottomTabBar, MaterialTopTabBar } from 'react-navigation-tabs'
import { getProfile } from '../selectors'
import { connect } from 'react-redux'

class TabBarComponent extends Component {
  render () {
    const TabBar = isIOS ? BottomTabBar : MaterialTopTabBar
    const { navigation, profile, ...options } = this.props
    const showLabel = profile.get('showLabel')
    const height = showLabel ? 50 : 45
    return (
      <TabBar
        navigation={navigation}
        {...options}
        showLabel={showLabel}
        labelStyle={ss.labelStyle}
        upperCaseLabel={false}
        showIcon
        style={{ backgroundColor: Colors.sliver, height }}
        activeTintColor={Colors.blue}
        inactiveTintColor={Colors.charcoal}
        indicatorStyle={{ backgroundColor: Colors.blue }}
      />
    )
  }
}

const stateToProps = state => ({
  profile: getProfile(state)
})

export default connect(stateToProps, null)(TabBarComponent)

const ss = StyleSheet.create({
  labelStyle: {
    fontSize: 8,
    marginTop: 0
  }
})
