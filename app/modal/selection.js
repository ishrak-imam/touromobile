import React, { Component } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Modal, Dimensions
} from 'react-native'
import { ListItem } from 'native-base'
import { Colors, IonIcon } from '../theme'
import { connect } from 'react-redux'
import { closeModal } from './action'
import { actionDispatcher } from '../utils/actionDispatcher'
import { getSelectionModal } from '../selectors'
import isIphoneX from '../utils/isIphoneX'

const { height, width } = Dimensions.get('window')
const heightOffset = isIphoneX ? 500 : 400
const widthOffset = 100

const modalHeight = height - heightOffset
const modalWidth = width - widthOffset

class SelectionModal extends Component {
  _onCancel = () => {
    actionDispatcher(closeModal({ type: 'selection' }))
  }

  _onSelect = (item, config) => {
    const { selection } = this.props
    const onSelect = selection.get('onSelect')
    const key = config.get('key')
    const direction = config.get('direction')
    return () => {
      onSelect({ key, value: item, direction })
      this._onCancel()
    }
  }

  _renderItems = (items, config, selected) => {
    return (
      <ScrollView style={ss.itemCon} contentContainerStyle={{ paddingVertical: 10 }}>
        {
          items.map(item => {
            const key = String(item.get('key'))
            const value = item.get('value')
            const isSelected = selected ? selected.get('key') === key : false
            const backgroundColor = isSelected ? Colors.blue : 'transparent'
            const color = isSelected ? Colors.silver : Colors.black
            return (
              <ListItem
                style={[ss.listItem, { backgroundColor }]} key={key}
                onPress={this._onSelect({ key: String(key), value }, config)}
              >
                <Text style={{ color }}>{value}</Text>
              </ListItem>
            )
          })
        }
      </ScrollView>
    )
  }

  render () {
    const { selection } = this.props
    const options = selection.get('options')
    const config = options ? options.get('config') : null
    const items = options ? options.get('items') : null
    const selected = options ? options.get('selected') : null
    return (
      <Modal
        animationType='fade'
        transparent
        visible={!!selection.size}
        onRequestClose={() => {}}
        useNativeDriver
      >
        <View style={ss.modal}>
          <View style={ss.container}>
            <View style={ss.top}>
              {!!config && <Text style={ss.label}>{config.get('label')}</Text>}
              <TouchableOpacity onPress={this._onCancel}>
                <IonIcon name='x' size={30} color={Colors.silver} />
              </TouchableOpacity>
            </View>
            <View style={ss.body}>
              {!!items && this._renderItems(items, config, selected)}
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const stateToProps = state => ({
  selection: getSelectionModal(state)
})

export default connect(stateToProps, null)(SelectionModal)

const ss = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.overlay
  },
  container: {
    height: modalHeight,
    width: modalWidth,
    borderRadius: 7,
    backgroundColor: Colors.silver
  },
  top: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.blue,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7
  },
  body: {
    flex: 5
  },
  close: {
    marginRight: 10,
    marginTop: 5
  },
  listItem: {
    paddingLeft: 20,
    marginLeft: 0
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.silver
  },
  itemCon: {
    flex: 1
  }
})