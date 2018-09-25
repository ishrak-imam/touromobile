
import React, { Component } from 'react'
import { IonIcon, Colors } from '../theme'
import {
  Header, Left, Body, Title, Right,
  View, Item, Input, Text
} from 'native-base'
import Button from '../components/button'
import { StyleSheet, TouchableOpacity } from 'react-native'
import isIOS from '../utils/isIOS'
import debounce from '../utils/debounce'

export default class TMHeader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      text: ''
    }
    this._onSearchDebounce = debounce(this._onSearchDebounce, 500)
  }
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
    const { title, searchConfig } = this.props
    return (
      <Body style={ss.body}>
        <Title style={ss.title}>{title}</Title>
        {
          searchConfig &&
          <IonIcon
            style={ss.searchIcon}
            name='search' size={25}
            color={Colors.silver}
            onPress={() => searchConfig.toggle(true)}
          />
        }
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

  _onSearchDebounce = () => {
    const { searchConfig } = this.props
    searchConfig.onSearch(this.state.text)
  }

  _handleChange = text => {
    this.setState({ text }, this._onSearchDebounce)
  }

  _onCancelSearch = () => {
    const { searchConfig } = this.props
    this.setState({ text: '' }, searchConfig.toggle(false))
  }

  _renderSearch = () => {
    const { searchConfig } = this.props
    return (
      <Header style={ss.header} searchBar rounded>
        <Item style={ss.searchBox}>
          <IonIcon name='search' style={{ marginLeft: 10 }} />
          <Input
            placeholder={searchConfig.placeHolder}
            onChangeText={this._handleChange}
            value={this.state.text}
          />
          <IonIcon name={searchConfig.icon} style={{ marginRight: 10 }} />
        </Item>
        <Right style={ss.cancelButton}>
          <TouchableOpacity onPress={this._onCancelSearch}>
            <Text style={ss.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Right>
      </Header>
    )
  }

  _renderHeader = searchConfig => {
    return (
      <Header style={ss.header}>
        {this._renderLeft()}
        {this._renderBody(searchConfig)}
        {this._renderRight()}
      </Header>
    )
  }

  render () {
    const { search } = this.props
    return (
      <View>
        {!search && this._renderHeader()}
        {search && this._renderSearch()}
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
    flex: 3,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center'
  },
  searchIcon: {
    marginLeft: 10
  },
  title: {
    color: Colors.silver,
    paddingBottom: 5
  },
  right: {
    flex: 2
  },
  cancelText: {
    color: Colors.silver
  },
  searchBox: {
    flex: 3
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
