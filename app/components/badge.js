import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors } from '../theme'

const BADGE_COLORS = {
  warning: Colors.fire
}

const TMBadge = ({ children, type }) => {
  return (
    <View style={[ss.badge, { backgroundColor: BADGE_COLORS[type] }]}>
      {children}
    </View>
  )
}

export default TMBadge

const ss = StyleSheet.create({
  badge: {
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
