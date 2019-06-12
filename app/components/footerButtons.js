
import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import OutLineButton from './outlineButton'
import { Colors } from '../theme'
import _T from '../utils/translator'

export default class FooterButtons extends Component {
  render () {
    const {
      onCancel, onSave, style, saveText,
      disabled, hideCancel, buttonHeight
    } = this.props
    return (
      <View style={StyleSheet.flatten([ss.item, style])}>

        {
          hideCancel
            ? null
            : <OutLineButton
              buttonHeight={buttonHeight}
              disabled={disabled}
              text={_T('cancel')}
              color={Colors.cancel}
              onPress={onCancel}
            />
        }

        <OutLineButton
          buttonHeight={buttonHeight}
          disabled={disabled}
          text={saveText || _T('save')}
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
