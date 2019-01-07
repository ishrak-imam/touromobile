
import React from 'react'
import { View, StyleSheet } from 'react-native'

const DisableContent = () => {
  return (
    <View style={ss.view} />
  )
}

export default DisableContent

const ss = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1
  }
})
