
import React from 'react'
import {
  View, ActivityIndicator, StyleSheet
} from 'react-native'
import { Colors } from '../theme'

const OverlaySpinner = () => {
  return (
    <View style={ss.view}>
      <ActivityIndicator size='large' color={Colors.blue} />
    </View>
  )
}

export default OverlaySpinner

const ss = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)'
  }
})
