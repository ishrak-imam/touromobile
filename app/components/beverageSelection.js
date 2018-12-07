
import React, { Component } from 'react'
import {
  View, Text, CheckBox
} from 'native-base'
import { StyleSheet, TouchableOpacity } from 'react-native'
import beverages from '../utils/beverages'
import { chunkList } from '../utils/immutable'

const chunkedBeverages = chunkList(beverages, 3)

export default class BeverageSelection extends Component {
  _onSelect = item => {
    const { onSelect } = this.props
    return () => {
      onSelect(item)
    }
  }

  _renderVeverages = () => {
    const { selected } = this.props
    return chunkedBeverages.map((row, index) => (
      <View key={index} style={ss.row}>
        {row.map(item => {
          // && selected.get('adult') === !child
          const isSelected = selected.get('drink') === item.get('id')
          return (
            <TouchableOpacity key={item.get('id')} style={ss.selection} onPress={this._onSelect(item)}>
              <CheckBox disabled checked={isSelected} />
              <Text style={ss.name}>{item.get('name')}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    ))
  }

  render () {
    const { label } = this.props
    return (
      <View style={ss.wrapper}>
        <View style={ss.container}>
          <Text note>{label}</Text>
          {this._renderVeverages()}
        </View>
      </View>
    )
  }
}

const ss = StyleSheet.create({
  wrapper: {
    marginTop: 10
  },
  container: {
    height: 100,
    width: '100%',
    paddingRight: 15
  },
  selection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: -10
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  name: {
    marginLeft: 20
  }
})
