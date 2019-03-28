
import React from 'react'
import {
  View, Text, StyleSheet
} from 'react-native'

import _T from '../utils/translator'

const noData = ({ text, textStyle }) => {
  return (
    <View style={ss.wrapper}>
      <Text style={textStyle}>{_T(text)}</Text>
    </View>
  )
}

const ss = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center'
  }
})

export default noData
