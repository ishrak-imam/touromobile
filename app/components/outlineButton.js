
import React from 'react'
import {
  TouchableOpacity, Text, StyleSheet
} from 'react-native'
import { Colors } from '../theme'

const OutLineButton = ({ onPress, text, textColor, style }) => {
  return (
    <TouchableOpacity style={[ss.button, style]} onPress={onPress}>
      <Text style={ss.text}>{text}</Text>
    </TouchableOpacity>
  )
}

export default OutLineButton

const ss = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    borderRadius: 3,
    marginLeft: 15
  },
  text: {
    color: Colors.silver,
    fontWeight: 'bold'
  }
})
