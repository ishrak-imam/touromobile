
import React, { Component } from 'react'
import { View, Text, ListItem } from 'native-base'
import {
  StyleSheet, TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { Colors } from '../theme'

export default class AppDataSync extends Component {
  _onSync = () => {
    this.props.onSync()
  }

  render () {
    const { isLoading, header, text, button } = this.props

    return (
      <View style={ss.container}>
        <ListItem style={ss.header}>
          <View>
            <Text style={ss.boldText}>{header}</Text>
          </View>
        </ListItem>
        <View style={ss.options}>
          <ListItem style={ss.item}>
            <Text>{text}</Text>
            <TouchableOpacity style={ss.button} onPress={this._onSync} disabled={isLoading}>
              {
                isLoading
                  ? <ActivityIndicator size='small' color={Colors.white} />
                  : <Text style={ss.buttonText}>{button}</Text>
              }
            </TouchableOpacity>
          </ListItem>
        </View>
      </View>

    )
  }
}

const ss = StyleSheet.create({
  container: {
    marginVertical: 5
  },
  boldText: {
    fontWeight: 'bold'
  },
  header: {
    paddingBottom: 10,
    borderBottomWidth: 0
  },
  item: {
    borderBottomWidth: 0,
    paddingTop: 5,
    paddingBottom: 10,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  options: {

  },
  left: {
    flex: 0.5
  },
  right: {
    flex: 4
  },
  button: {
    width: 170,
    height: 40,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold'
  }
})
