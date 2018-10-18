
import React, { Component } from 'react'
import {
  CardItem
} from 'native-base'
import OutLineButton from './outlineButton'
import { Colors } from '../theme'
import Translator from '../utils/translator'

const _T = Translator('FooterButtons')

export default class FooterButtons extends Component {
  render () {
    const { onCancel, onSave } = this.props
    return (
      <CardItem style={{ justifyContent: 'flex-end' }}>
        <OutLineButton text={_T('cancel')} style={{ backgroundColor: Colors.cancel }} onPress={onCancel} />
        <OutLineButton text={_T('save')} style={{ backgroundColor: Colors.green }} onPress={onSave} />
      </CardItem>
    )
  }
}
