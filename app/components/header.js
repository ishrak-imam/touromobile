
import React, { Component } from 'react'
import { IonIcon, Colors } from '../theme'
import {
  Header, Left, Body,
  Title, Right, View
} from 'native-base'
import { StyleSheet, TouchableOpacity, Keyboard } from 'react-native'
import isIOS from '../utils/isIOS'

export default class TMHeader extends Component {
  _navigate = type => {
    const { navigation } = this.props
    return () => {
      Keyboard.dismiss()
      switch (type) {
        case 'menu':
          navigation.openDrawer()
          break
        case 'back':
          navigation.goBack()
          break
      }
    }
  }

  _renderLeft = () => {
    const { left } = this.props
    return (
      <Left style={ss.left}>
        <TouchableOpacity transparent onPress={this._navigate(left)}>
          <IonIcon name={left} color={Colors.silver} />
        </TouchableOpacity>
      </Left>
    )
  }

  _renderBody = () => {
    const { title } = this.props
    return (
      <Body style={ss.body}>
        <Title style={ss.title}>{title}</Title>
      </Body>
    )
  }

  _renderRight = () => {
    const { right } = this.props
    return (
      <Right style={ss.right}>
        {!!right && right}
      </Right>
    )
  }

  _renderHeader = brand => {
    const backgroundColor = Colors[`${brand}Brand`] || Colors.blue
    return (
      <Header style={[ss.header, { backgroundColor }]}>
        {this._renderLeft()}
        {this._renderBody()}
        {this._renderRight()}
      </Header>
    )
  }

  render () {
    const { brand } = this.props
    return (
      <View>
        {this._renderHeader(brand)}
      </View>
    )
  }
}

const ss = StyleSheet.create({
  header: {
    height: isIOS ? 70 : 90,
    paddingTop: isIOS ? 20 : 25,
    paddingLeft: isIOS ? 15 : 10
  },
  left: {
    flex: 1
  },
  body: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: Colors.silver
    // paddingBottom: 5
  },
  right: {
    flex: 2,
    marginRight: 2
  }
})
