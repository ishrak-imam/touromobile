
import React from 'react'
import {
  TouchableOpacity, Text, StyleSheet
} from 'react-native'

const OutLineButton = ({ onPress, text, textColor, style }) => {
  return (
    <TouchableOpacity style={[ss.button, style]} onPress={onPress}>
      <Text style={{ color: textColor }}>{text}</Text>
    </TouchableOpacity>
  )
}

export default OutLineButton

const ss = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  }
})
