
import React from 'react'
import {
  View, Text, StyleSheet
} from 'react-native'

const noData = ({ text, textStyle }) => {
  return (
    <View style={ss.wrapper}>
      <Text style={textStyle}>{text}</Text>
    </View>
  )
}

const ss = StyleSheet.create({
  wrapper: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center'
  }
})

export default noData
