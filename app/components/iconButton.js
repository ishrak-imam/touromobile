import React from 'react'
import { Button } from 'native-base'
import { IonIcon } from '../theme'

const RoundIconButton = (props) => {
  const { name, size = 22, onPress, ...rest } = props

  return (
    <Button
      transparent
      rounded
      onPress={onPress}
      style={{
        borderRadius: size,
        width: size * 2,
        height: size * 2,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <IonIcon name={name} {...rest} />
    </Button>
  )
}

export default RoundIconButton
