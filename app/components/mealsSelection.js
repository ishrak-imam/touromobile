
import React, { Component } from 'react'
import {
  ListItem, Body, Text,
  CheckBox, View
} from 'native-base'
import { StyleSheet } from 'react-native'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'

export default class MealsSelection extends Component {
  _onSelect = item => {
    const { onSelect } = this.props
    return () => {
      onSelect(item)
    }
  }

  _renderItem = ({ item }) => {
    const { selected, isChild } = this.props
    const isSelected = selected.get('meal') === item.get('id') && selected.get('adult') !== isChild
    const name = item.get('name')

    return (
      <ListItem style={ss.item} onPress={this._onSelect(item)}>
        <CheckBox disabled checked={isSelected} />
        <Body style={ss.right}>
          <Text>{name}</Text>
        </Body>
      </ListItem>
    )
  }

  render () {
    const { items, label } = this.props
    return (
      <View>
        <Text note>{label}</Text>
        <ImmutableVirtualizedList
          immutableData={items}
          renderItem={this._renderItem}
          keyExtractor={item => String(item.get('id'))}
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
  left: {
    flex: 0.5
  },
  right: {
    flex: 4
  }
})