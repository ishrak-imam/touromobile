
import React, { Component } from 'react'
import { Spinner } from 'native-base'
import {
  StyleSheet, Dimensions,
  TouchableOpacity
} from 'react-native'
import { Colors, IonIcon } from '../theme'
import isIphoneX from '../utils/isIphoneX'

const { width, height } = Dimensions.get('window')

let left = width - 95
let top = height - 140
if (isIphoneX) {
  top = height - 175
}

export default class FloatingButton extends Component {
  render () {
    const { onPress, loading } = this.props
    return (
      <TouchableOpacity style={ss.button} onPress={onPress}>
        {!loading && <IonIcon name='upload' color={Colors.white} size={30} />}
        {loading && <Spinner color={Colors.white} />}
      </TouchableOpacity>
    )
  }
}

const ss = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    position: 'absolute',
    left,
    right: 0,
    top,
    bottom: 0,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8
  }
})
