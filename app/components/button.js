import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'native-base'

const TMButton = ({ onPress, children, style, ...rest }) => (
  <Button onPress={onPress} {...rest} style={[style, ss.button]}>
    {children}
  </Button>
)

export default TMButton

const ss = StyleSheet.create({
  button: {
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0,
    elevation: 0
  }
})
