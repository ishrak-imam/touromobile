
import React, { Component } from 'react'
import {
  View, Text, CheckBox
} from 'native-base'

import { StyleSheet } from 'react-native'

export default class BeverageSelection extends Component {
  render () {
    return (
      <View style={ss.wrapper}>

        <View style={ss.container}>

          <Text note>Beverages</Text>

          <View style={ss.row}>
            <View style={ss.selection}>
              <CheckBox />
              <Text style={ss.name}>Beer</Text>
            </View>
            <View style={ss.selection}>
              <CheckBox />
              <Text style={ss.name}>Wine</Text>
            </View>
            <View style={ss.selection}>
              <CheckBox />
              <Text style={ss.name}>Fanta</Text>
            </View>
          </View>

          <View style={ss.row}>
            <View style={ss.selection}>
              <CheckBox />
              <Text style={ss.name}>Coke</Text>
            </View>
            <View style={ss.selection}>
              <CheckBox />
              <Text style={ss.name}>Sprite</Text>
            </View>
            <View style={ss.selection}>
              <CheckBox />
              <Text style={ss.name}>Water</Text>
            </View>
          </View>

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
