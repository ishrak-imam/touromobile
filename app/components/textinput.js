
import React, { PureComponent } from 'react'
import { TextInput } from 'react-native'
import debounce from '../utils/debounce'

export default class TMTextInput extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      text: props.value
    }
    this._onChangeDebounce = debounce(this._onChange, 500)
  }

  _onChange = () => {
    const { onChange } = this.props
    onChange(this.state.text)
  }

  _onCahngeText = text => {
    this.setState({ text }, this._onChangeDebounce)
  }

  render () {
    const { placeholder, style } = this.props
    return (
      <TextInput
        underlineColorAndroid='transparent'
        placeholder={placeholder}
        value={this.state.text}
        style={style}
        onChangeText={this._onCahngeText}
      />
    )
  }
}
