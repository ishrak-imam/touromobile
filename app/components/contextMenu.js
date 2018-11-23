
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu'
import { Colors, IonIcon } from '../theme'
import Translator from '../utils/translator'

const _T = Translator('ContextMenu')

export default class ContextMenu extends Component {
  _onSelect = item => {
    const { onSelect } = this.props
    return () => {
      onSelect(item)
    }
  }

  _renderOptions = options => {
    return options.map((item, index) => {
      return <MenuOption
        key={index}
        onSelect={this._onSelect(item)}
        text={_T(item.text)}
        style={ss.menuItem}
      />
    })
  }

  render () {
    const { icon, options } = this.props
    return (
      <Menu>
        <MenuTrigger>
          <IonIcon style={ss.righIcon} name={icon} color={Colors.black} />
        </MenuTrigger>
        <MenuOptions>
          {this._renderOptions(options)}
        </MenuOptions>
      </Menu>
    )
  }
}

const ss = StyleSheet.create({
  righIcon: {
    padding: 10,
    marginHorizontal: 10,
    zIndex: 5
  },
  menuItem: {
    paddingVertical: 15,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderColor: Colors.steel
  }
})
