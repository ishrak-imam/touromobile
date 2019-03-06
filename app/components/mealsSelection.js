
import React, { Component } from 'react'
import {
  ListItem, Body, Text, View
} from 'native-base'
import { StyleSheet } from 'react-native'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import CheckBox from './checkBox'
import Translator from '../utils/translator'

const _T = Translator('OrdersScreen')

export default class MealsSelection extends Component {
  shouldComponentUpdate (nextProps) {
    /**
     * No need to re-render meal selection component if
     * new drink selected or if meal id remains same
     */
    return nextProps.selected.get('meal') !== this.props.selected.get('meal') ||
          nextProps.isChild !== this.props.isChild
  }

  _onSelect = item => {
    const { onSelect, selected } = this.props
    return () => {
      /**
       * no need to dispatch action if same meal
       * is selected again
       */
      if (selected.get('meal') !== item.get('id')) {
        onSelect(item)
      }
    }
  }

  _renderItem = ({ item }) => {
    const { selected, isChild } = this.props
    const isSelected = selected.get('meal') === item.get('id') && selected.get('adult') !== isChild
    const name = item.get('name')
    const prefix = isChild ? `(${_T('child')}) ` : ''

    return (
      <ListItem style={ss.item} onPress={this._onSelect(item)}>
        <CheckBox checked={isSelected} />
        <Body style={ss.right}>
          <Text>{prefix}{name}</Text>
        </Body>
      </ListItem>
    )
  }

  render () {
    const { items, label, listKey } = this.props
    return (
      <View>
        <Text note>{label}</Text>
        <ImmutableVirtualizedList
          listKey={listKey}
          immutableData={items}
          renderItem={this._renderItem}
          keyExtractor={item => String(item.get('id'))}
          renderEmpty={_T('noMealData')}
        />
      </View>
    )
  }
}

const ss = StyleSheet.create({
  item: {
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingTop: 10,
    paddingBottom: 10
  },
  right: {
    flex: 4
  }
})
