
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
        {!!right && right()}
      </Right>
    )
  }

  _renderHeader = () => {
    return (
      <Header style={ss.header}>
        {this._renderLeft()}
        {this._renderBody()}
        {this._renderRight()}
      </Header>
    )
  }

  render () {
    return (
      <View>
        {this._renderHeader()}
      </View>
    )
  }
}

const ss = StyleSheet.create({
  header: {
    height: isIOS ? 70 : 80,
    paddingTop: isIOS ? 20 : 25,
    paddingLeft: isIOS ? 15 : 10,
    backgroundColor: Colors.headerBg
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
