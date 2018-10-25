
import React, { Component } from 'react'
import {
  TouchableOpacity, Text,
  StyleSheet
} from 'react-native'
import { Colors } from '../theme'

export default class OutLineButton extends Component {
  render () {
    const { onPress, text, disabled, color } = this.props
    const backgroundColor = disabled ? Colors.steel : color
    const textColor = disabled ? Colors.charcoal : Colors.silver
    return (
      <TouchableOpacity style={[ss.button, { backgroundColor }]} onPress={onPress} disabled={disabled}>
        <Text style={{ color: textColor }}>{text}</Text>
      </TouchableOpacity>
    )
  }
}

const ss = StyleSheet.create({
  button: {
    paddingHorizontal: 5,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    borderRadius: 3,
    marginLeft: 15
  }
})
