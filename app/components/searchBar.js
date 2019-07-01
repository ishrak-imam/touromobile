import React, { Component } from 'react'
import {
  View, StyleSheet, TextInput,
  Keyboard
} from 'react-native'
import { IonIcon, Colors } from '../theme'
import debounce from '../utils/debounce'

export default class TMSearchBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      text: ''
    }
    this._onSearchDebounce = debounce(this._onSearch, 200)
  }

  _renderCancel = (icon, text) => {
    return (
      text
        ? <IonIcon style={ss.righIcon} name='circleX' color={Colors.black} onPress={this._onCancel} />
        : <IonIcon style={ss.righIcon} name={icon} color={Colors.black} />
    )
  }

  _renderRight = (icon, right) => {
    const { text } = this.state
    return (
      right && !text ? right : this._renderCancel(icon, text)
    )
  }

  _onSearch = () => {
    const { onSearch } = this.props
    onSearch(this.state.text.toLocaleLowerCase())
  }

  _onChangeText = text => {
    this.setState({ text }, this._onSearchDebounce)
  }

  _onCancel = () => {
    Keyboard.dismiss()
    this.setState({ text: '' }, () => {
      this._onSearch()
    })
  }

  render () {
    const { placeholder, icon, onSearch, right, ...rest } = this.props
    return (
      <View style={ss.wrapper}>
        <View style={ss.searchSection}>
          <IonIcon style={ss.searchIcon} name='search' color={Colors.black} />
          <TextInput
            value={this.state.text}
            style={ss.input}
            placeholder={placeholder}
            onChangeText={text => this._onChangeText(text)}
            underlineColorAndroid='transparent'
            autoCorrect={false}
            {...rest}
          />
          {this._renderRight(icon, right)}
        </View>
      </View>
    )
  }
}

const ss = StyleSheet.create({
  wrapper: {
    height: 55
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cloud,
    paddingHorizontal: 5
  },
  searchIcon: {
    padding: 10
  },
  input: {
    flex: 1,
    height: 35,
    padding: 5,
    paddingLeft: 10,
    backgroundColor: Colors.white,
    borderRadius: 7,
    fontSize: 16
  },
  righIcon: {
    padding: 10,
    marginHorizontal: 10,
    zIndex: 5
  }
})
