
import React, { Component } from 'react'
import {
  StyleSheet, TextInput,
  TouchableOpacity, Keyboard
} from 'react-native'
import { ListItem, View, Text } from 'native-base'
import { Colors, IonIcon } from '../theme'
import FooterButtons from './footerButtons'
import { getExtraOrders } from '../selectors'
import { connect } from 'react-redux'
import uuid from 'react-native-uuid'
import { getMap } from '../utils/immutable'
import { actionDispatcher } from '../utils/actionDispatcher'
import { takeExtraOrder } from '../modules/modifiedData/action'

class ExtraOrderSummaryMode extends Component {
  constructor (props) {
    super(props)
    let { extraOrders } = props
    if (extraOrders.size === 0) {
      const id = uuid.v1()
      extraOrders = getMap({
        [id]: getMap({ id })
      })
    }
    this.state = {
      dirty: false,
      extraOrders
    }
  }

  _filterOutEmptyOrders = extraOrders => {
    return extraOrders.filter(order => {
      return order.get('text') && order.get('amount')
    })
  }

  _onAddItem = () => {
    const { extraOrders } = this.state
    const id = uuid.v1()
    this.setState({
      extraOrders: extraOrders.set(id, getMap({ id })),
      dirty: true
    })
  }

  _onChangeText = (key, property) => value => {
    const { extraOrders } = this.state
    this.setState({
      dirty: true,
      extraOrders: extraOrders.setIn([key, property], value)
    })
  }

  _onCancel = () => {
    let { extraOrders } = this.props
    if (extraOrders.size === 0) {
      const id = uuid.v1()
      extraOrders = getMap({
        [id]: getMap({ id })
      })
    }
    this.setState({ dirty: false, extraOrders })
  }

  _onSave = () => {
    Keyboard.dismiss()
    const { departureId, bookingId } = this.props
    let { extraOrders } = this.state
    if (extraOrders.size) {
      actionDispatcher(takeExtraOrder({
        departureId,
        bookingId,
        extraOrders: this._filterOutEmptyOrders(extraOrders)
      }))
      this.setState({ dirty: false, extraOrders })
    }
  }

  _onDelete = key => {
    const { extraOrders } = this.state
    if (extraOrders.size === 1) return null
    return () => {
      this.setState({
        extraOrders: extraOrders.delete(key),
        dirty: true
      }, this._onSave)
    }
  }

  render () {
    const { dirty, extraOrders } = this.state

    return (
      <View style={ss.container}>

        {extraOrders.valueSeq().map(order => {
          const key = order.get('id')
          return (
            <ListItem style={ss.item} key={key}>
              <TextInput
                underlineColorAndroid='transparent'
                placeholder='Text'
                value={order.get('text')}
                style={[ss.input, { width: '65%' }]}
                onChangeText={this._onChangeText(key, 'text')}
              />
              <TextInput
                underlineColorAndroid='transparent'
                placeholder='Amount'
                value={order.get('amount')}
                keyboardType='numeric'
                style={[ss.input, { width: '25%' }]}
                onChangeText={this._onChangeText(key, 'amount')}
              />
              <TouchableOpacity style={ss.delete} onPress={this._onDelete(key)}>
                <IonIcon name='delete' size={27} color={Colors.cancel} />
              </TouchableOpacity>
            </ListItem>
          )
        })}

        <View style={ss.footer}>
          <TouchableOpacity style={ss.plus} onPress={this._onAddItem}>
            <Text style={ss.sign}>+</Text>
          </TouchableOpacity>
          <FooterButtons disabled={!dirty} onSave={this._onSave} onCancel={this._onCancel} />
        </View>
      </View>
    )
  }
}

const stateToProps = (state, props) => {
  const { departureId, bookingId } = props
  return {
    extraOrders: getExtraOrders(state, departureId, bookingId)
  }
}

export default connect(stateToProps, null)(ExtraOrderSummaryMode)

const ss = StyleSheet.create({
  container: {
    marginLeft: 5,
    marginVertical: 10
  },
  item: {
    justifyContent: 'space-between',
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingBottom: 5,
    paddingRight: 0
  },
  delete: {
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    width: '5%'
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
  },
  footer: {
    height: 35,
    width: '92.5%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  plus: {
    height: 30,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.green,
    borderRadius: 3
  },
  sign: {
    fontWeight: 'bold',
    color: Colors.white
  }
})
