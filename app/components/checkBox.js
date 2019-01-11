
import React from 'react'
import { View } from 'react-native'
import { Colors, IonIcon } from '../theme'

const CheckBox = ({ checked, disabled }) => {
  const color = disabled ? Colors.steel : Colors.blue
  return (
    <View>
      {!checked && <IonIcon name='radioOff' color={color} size={27} />}
      {checked && <IonIcon name='checkFill' color={color} size={27} />}
    </View>
  )
}

export default CheckBox
