
import React, { Component } from 'react'
import { View, Text } from 'native-base'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { chunkList } from '../utils/immutable'
import CheckBox from './checkBox'
import NoData from './noData'

export default class BeverageSelection extends Component {
  shouldComponentUpdate (nextProps) {
    /**
     * No need to re-render beverage selection component if
     * new meal selected or if drink id remains same
     */
    return nextProps.selected.get('drink') !== this.props.selected.get('drink')
  }

  _onSelect = item => {
    const { onSelect, selected } = this.props
    return () => {
      if (selected.get('drink') !== item.get('id')) {
        onSelect(item)
      }
    }
  }

  _renderVeverages = () => {
    const { selected, items } = this.props
    const chunkedBeverages = chunkList(items, 3)

    return items.size
      ? chunkedBeverages.map((row, index) => (
        <View key={index} style={ss.row}>
          {row.map(item => {
          // && selected.get('adult') === !child
            const isSelected = selected.get('drink') === item.get('id')
            return (
              <TouchableOpacity key={item.get('id')} style={ss.selection} onPress={this._onSelect(item)}>
                <CheckBox checked={isSelected} />
                <Text style={ss.name}>{item.get('name')}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      ))

      : <NoData text='noBeverageData' textStyle={{ marginTop: 30 }} />
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
    // height: 100,
    width: '100%',
    paddingRight: 15
  },
  selection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
    // marginLeft: -10
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 2
  },
  name: {
    marginLeft: 15
  }
})
