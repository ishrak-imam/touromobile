
import React, { Component } from 'react'
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

console.log(width, height)

export default class FloatingButton extends Component {
  render () {
    return (
      <TouchableOpacity style={ss.button}>
        <IonIcon name='upload' color={Colors.white} size={30} />
      </TouchableOpacity>
    )
  }
}

const ss = StyleSheet.create({
  button: {
    width: 76,
    height: 76,
    borderRadius: 38,
    position: 'absolute',
    left,
    right: 0,
    top,
    bottom: 0,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
