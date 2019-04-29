import React, { Component } from 'react'
import {
  View, Text, StyleSheet, Dimensions, Modal
} from 'react-native'
import { Colors } from '../theme'
import { connect } from 'react-redux'
import { closeModal } from './action'
import { actionDispatcher } from '../utils/actionDispatcher'
import { getInfoModal } from '../selectors'
import isIphoneX from '../utils/isIphoneX'
import OutLineButton from '../components/outlineButton'

const { height, width } = Dimensions.get('window')
const heightOffset = isIphoneX ? 550 : 300
const widthOffset = 60

const modalHeight = height - heightOffset
const modalWidth = width - widthOffset

class InfoModal extends Component {
  _onCancel = () => {
    actionDispatcher(closeModal({ type: 'info' }))
  }

  _onOk = () => {
    const { info } = this.props
    const onOk = info.get('onOk')
    onOk()
    this._onCancel()
  }

  render () {
    const { info } = this.props
    return (
      <Modal
        animationType='fade'
        transparent
        visible={!!info.size}
        onRequestClose={() => {}}
      >
        <View style={ss.modal}>
          <View style={ss.container}>
            <View style={ss.header}>
              <Text style={ss.headerText}>{info.get('header')}</Text>
            </View>
            <View style={ss.body}>
              <Text>{info.get('body')}</Text>
            </View>
            <View style={ss.footer}>
              <OutLineButton
                text='Ok'
                color={Colors.green}
                onPress={this._onOk}
              />
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const stateToProps = state => ({
  info: getInfoModal(state)
})

export default connect(stateToProps, null)(InfoModal)

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
    backgroundColor: Colors.white
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blue,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.white
  },
  body: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    marginHorizontal: 15
  },
  footer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15
  }
})
