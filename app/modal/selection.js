import React, { Component } from 'react'
import {
  View, Text, StyleSheet,
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

class WarningModal extends Component {
  _onCancel = () => {
    actionDispatcher(closeModal({ type: 'selection' }))
  }

  _onSelect = option => {
    return () => {
      const { selection } = this.props
      const onSelect = selection.get('onSelect')
      onSelect(option)
      this._onCancel()
    }
  }

  _renderOptions = options => {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 5 }}>
        {
          options.map((option, i) => {
            return (
              <ListItem style={ss.listItem} key={i} onPress={this._onSelect(option)}>
                <Text>{option}</Text>
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
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Accomodation</Text>
              <IonIcon name='x' size={30} onPress={this._onCancel} />
            </View>
            <View style={ss.body}>
              {!!selection.size && this._renderOptions(options)}
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

export default connect(stateToProps, null)(WarningModal)

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
    marginHorizontal: 20
  },
  body: {
    flex: 5
  },
  close: {
    marginRight: 10,
    marginTop: 5
  },
  listItem: {
    paddingLeft: 5
  }
})
