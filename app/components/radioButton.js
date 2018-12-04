
import React, { Component } from 'react'
import {
  ListItem, Left, Body, Text,
  CheckBox, View
} from 'native-base'
import { StyleSheet } from 'react-native'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'

export default class RadioButton extends Component {
  _renderItem = ({ item }) => {
    const name = item.get('name')
    return (
      <ListItem style={ss.item} onPress={() => {}}>
        <Left style={ss.left}>
          <CheckBox disabled />
        </Left>
        <Body style={ss.right}>
          <Text>{name}</Text>
        </Body>
      </ListItem>
    )
  }

  render () {
    const { items, direction, label } = this.props
    return (
      <View>
        <Text note style={ss.label}>{label}</Text>
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
  label: {
    marginLeft: 10
  },
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
