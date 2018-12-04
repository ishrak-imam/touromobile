
import React, { Component } from 'react'
import {
  View, TouchableOpacity, Text,
  StyleSheet
} from 'react-native'
import { Colors } from '../theme'

import Translator from '../utils/translator'

const _T = Translator('OutHomeTab')

export const TABS = {
  OUT: 'out',
  HOME: 'home'
}

class OutHomeTab extends Component {
  // constructor (props) {
  //   super(props)
  //   const { onPress } = props
  //   onPress(TABS.OUT)() // initialization(closure)
  // }

  render () {
    const { selected, onPress } = this.props
    return (
      <View style={ss.tabContainer}>
        <TouchableOpacity
          style={[ss.tab, {
            backgroundColor: selected === TABS.OUT ? Colors.blue : Colors.steel,
            borderTopLeftRadius: 3,
            borderBottomLeftRadius: 3
          }]}
          onPress={onPress(TABS.OUT)}
        >
          <Text style={{ color: selected === TABS.OUT ? Colors.silver : Colors.black }}>{_T('out')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ss.tab, {
            backgroundColor: selected === TABS.HOME ? Colors.blue : Colors.steel,
            borderTopRightRadius: 3,
            borderBottomRightRadius: 3
          }]}
          onPress={onPress(TABS.HOME)}
        >
          <Text style={{ color: selected === TABS.HOME ? Colors.silver : Colors.black }}>{_T('home')}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default OutHomeTab

const ss = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  tab: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4
  }
})
