
import React from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated
} from 'react-native'

import { Colors } from '../theme'

export default class TMSwitch extends React.Component {
  static calculateDimensions (size) {
    switch (size) {
      case 'small':
        return ({
          width: 40, padding: 10, circleWidth: 15, circleHeight: 15, translateX: 22
        })
      case 'large':
        return ({
          width: 100, padding: 20, circleWidth: 30, circleHeight: 30, translateX: 38
        })
      case 'medium':
        return ({
          width: 50, padding: 13, circleWidth: 20, circleHeight: 20, translateX: 24
        })
      default:
        return ({
          // width: 50, padding: 12, circleWidth: 20, circleHeight: 20, translateX: 26
          width: 45, padding: 10, circleWidth: 16, circleHeight: 16, translateX: 20
        })
    }
  }

  static defaultProps = {
    isOn: false,
    onColor: '#634fc9',
    offColor: '#ecf0f1',
    size: 'medium',
    icon: null
  }

  offsetX = new Animated.Value(0);
  dimensions = TMSwitch.calculateDimensions(this.props.size);

  createToggleSwitchStyle = () => ({
    justifyContent: 'center',
    width: this.dimensions.width,
    borderRadius: 20,
    padding: this.dimensions.padding,
    backgroundColor: (this.props.isOn) ? this.props.onColor : this.props.offColor
  })

  createInsideCircleStyle = () => ({
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    position: 'absolute',
    backgroundColor: 'white',
    transform: [{ translateX: this.offsetX }],
    width: this.dimensions.circleWidth,
    height: this.dimensions.circleHeight,
    borderRadius: (this.dimensions.circleWidth / 2)
  });

  render () {
    const toValue = this.props.isOn
      ? this.dimensions.width - this.dimensions.translateX
      : 0

    Animated.timing(
      this.offsetX,
      {
        toValue,
        duration: 100,
        useNativeDriver: true
      }
    ).start()

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={this.createToggleSwitchStyle()}
          activeOpacity={0.8}
          onPress={() => {
            this.props.onToggle(!this.props.isOn)
          }}
        >
          <Animated.View style={this.createInsideCircleStyle()} >{this.props.icon}</Animated.View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 2,
    borderRadius: 20
  }
})
