
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
import { Text } from 'native-base'

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
      return (
        <MenuOption
          key={index}
          style={ss.menuItem}
          onSelect={this._onSelect(item)}
        >
          <IonIcon name={item.icon} size={20} />
          <Text style={ss.itemText}>{_T(item.text)}</Text>
        </MenuOption>
      )
    })
  }

  render () {
    const { icon, options, label } = this.props
    return (
      <Menu>
        <MenuTrigger>
          <IonIcon style={ss.rightIcon} name={icon} color={Colors.black} />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption disabled style={ss.menuItemHeader}>
            <Text style={ss.headerText}>{_T(label)}</Text>
          </MenuOption>
          {this._renderOptions(options)}
        </MenuOptions>
      </Menu>
    )
  }
}

const ss = StyleSheet.create({
  rightIcon: {
    padding: 10,
    marginHorizontal: 10,
    zIndex: 5
  },
  menuItem: {
    paddingVertical: 15,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderColor: Colors.steel,
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuItemHeader: {
    paddingVertical: 15,
    paddingLeft: 10,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    marginLeft: 10
  },
  headerText: {
    color: Colors.silver,
    fontWeight: 'bold'
  }
})
