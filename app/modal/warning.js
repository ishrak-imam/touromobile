import React, { Component } from 'react'
import {
  View, Text, StyleSheet, Dimensions,
  TouchableOpacity, Modal
} from 'react-native'
import { IonIcon, Colors } from '../theme'
import { connect } from 'react-redux'
import { closeModal } from './action'
import { actionDispatcher } from '../utils/actionDispatcher'
import { getWarningModal } from '../selectors'

const { height, width } = Dimensions.get('window')
const heightOffset = 400
const widthOffset = 100

const modalHeight = height - heightOffset
const modalWidth = width - widthOffset

class WarningModal extends Component {
  _onCancel = () => {
    actionDispatcher(closeModal({ type: 'warning' }))
  }

  _onOk = () => {
    const { warning } = this.props
    const onOk = warning.get('onOk')
    onOk()
  }

  render () {
    const { warning } = this.props
    return (
      <Modal
        animationType='fade'
        transparent
        visible={warning.get('visible')}
        onRequestClose={() => {}}
        useNativeDriver
      >
        <View style={ss.modal}>
          <View style={ss.container}>
            <View style={ss.body}>
              <IonIcon name='warning' color={Colors.fire} size={60} />
              <Text style={ss.warningText}>{warning.get('text')}</Text>
            </View>
            <View style={ss.footer}>
              <TouchableOpacity style={ss.cancel} onPress={this._onCancel}>
                <Text style={ss.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={ss.ok} onPress={this._onOk}>
                <Text style={ss.buttonText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const stateToProps = state => ({
  warning: getWarningModal(state)
})

export default connect(stateToProps, null)(WarningModal)

const ss = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  container: {
    height: modalHeight,
    width: modalWidth,
    borderRadius: 7,
    backgroundColor: Colors.silver
  },
  body: {
    flex: 2,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancel: {
    width: 100,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 20,
    alignItems: 'center',
    backgroundColor: Colors.cancel
  },
  ok: {
    width: 100,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 20,
    alignItems: 'center',
    backgroundColor: Colors.green
  },
  warningText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 18
  },
  buttonText: {
    color: Colors.silver,
    fontWeight: 'bold'
  }
})
