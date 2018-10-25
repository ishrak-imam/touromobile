
import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import OutLineButton from './outlineButton'
import { Colors } from '../theme'
import Translator from '../utils/translator'

const _T = Translator('FooterButtons')

export default class FooterButtons extends Component {
  render () {
    const { onCancel, onSave, style, disabled } = this.props
    return (
      <View style={StyleSheet.flatten([ss.item, style])}>

        <OutLineButton
          disabled={disabled}
          text={_T('cancel')}
          color={Colors.cancel}
          onPress={onCancel}
        />

        <OutLineButton
          disabled={disabled}
          text={_T('save')}
          color={Colors.green}
          onPress={onSave}
        />

      </View>
    )
  }
}

const ss = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
})
