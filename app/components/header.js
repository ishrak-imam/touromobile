
import React, { Component } from 'react'
import { IonIcon, Colors } from '../theme'
import {
  Header, Left, Body, Title, Right
} from 'native-base'
import Button from '../components/button'
import { StyleSheet } from 'react-native'
import isIphoneX from '../utils/isIphoneX'

export default class TMHeader extends Component {
  _navigate = type => {
    const { navigation } = this.props
    return () => {
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
        <Button transparent onPress={this._navigate(left)}>
          <IonIcon name={left} size={25} color={Colors.silver} />
        </Button>
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

  render () {
    return (
      <Header style={ss.header}>
        {this._renderLeft()}
        {this._renderBody()}
        {this._renderRight()}
      </Header>
    )
  }
}

const ss = StyleSheet.create({
  header: {
    height: 90,
    paddingTop: isIphoneX ? 20 : 30,
    paddingLeft: isIphoneX ? 15 : 10,
    backgroundColor: Colors.headerBg
  },
  left: {
    flex: 1
  },
  body: {
    flex: 3
  },
  title: {
    color: Colors.silver
  },
  right: {
    flex: 2
  }
})
