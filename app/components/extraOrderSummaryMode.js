
import React, { Component } from 'react'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { ListItem, View, Text } from 'native-base'
import { Colors } from '../theme'

export default class ExtraOrderSummaryMode extends Component {
  constructor (props) {
    super(props)
    this.state = {
      extraOrders: 1
    }
  }

  _onAddItem = () => {
    this.setState({ extraOrders: this.state.extraOrders + 1 })
  }

  render () {
    const items = Array.apply(null, { length: this.state.extraOrders }).map(Number.call, Number)

    return (
      <View style={ss.container}>
        {
          items.map((_, i) => {
            return (
              <ListItem style={ss.item} key={i}>
                <TextInput
                  underlineColorAndroid='transparent'
                  placeholder='Order'
                  value='Taxi service'
                  style={[ss.input, { width: '72%' }]}
                  onChangeText={() => {}}
                />
                <TextInput
                  underlineColorAndroid='transparent'
                  placeholder='Order'
                  value='49'
                  keyboardType='numeric'
                  style={[ss.input, { width: '27%' }]}
                  onChangeText={() => {}}
                />
              </ListItem>
            )
          })
        }
        <TouchableOpacity style={ss.button} onPress={this._onAddItem}>
          <Text style={ss.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const ss = StyleSheet.create({
  container: {
    marginLeft: 5
  },
  item: {
    justifyContent: 'space-between',
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingBottom: 5,
    paddingRight: 0
  },
  input: {
    height: 35,
    borderWidth: 1,
    borderColor: Colors.charcoal,
    borderRadius: 2,
    padding: 5
  },
  button: {
    backgroundColor: Colors.green,
    marginTop: 5,
    width: 80,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  buttonText: {
    color: Colors.white
  }
})
