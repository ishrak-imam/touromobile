
import React, { Component } from 'react'
import { Spinner } from 'native-base'
import {
  StyleSheet, Dimensions,
  TouchableOpacity
} from 'react-native'
import { Colors, IonIcon } from '../theme'
import isIphoneX from '../utils/isIphoneX'

const { width, height } = Dimensions.get('window')

let left = width - 85
// let top = height - 80 // 130
// if (isIphoneX) {
//   top = height - 115 // 165
// }

export default class FloatingButton extends Component {
  render () {
    let { onPress, loading, icon, topOffset } = this.props

    const top = isIphoneX ? height - (topOffset + 35) : height - topOffset

    return (
      <TouchableOpacity style={[ss.button, { top }]} onPress={onPress}>
        {!loading && <IonIcon name={icon} color={Colors.white} size={30} />}
        {loading && <Spinner color={Colors.white} />}
      </TouchableOpacity>
    )
  }
}

const ss = StyleSheet.create({
  button: {
    width: 66,
    height: 66,
    borderRadius: 33,
    position: 'absolute',
    left,
    right: 0,
    // top,
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
