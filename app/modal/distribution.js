import React, { Component } from 'react'
import {
  View, Text, StyleSheet,
  TouchableOpacity, Modal, Dimensions
} from 'react-native'
import { Colors, IonIcon } from '../theme'
import { connect } from 'react-redux'
import { closeModal } from './action'
import { actionDispatcher } from '../utils/actionDispatcher'
import { getDistributionModal } from '../selectors'
import isIphoneX from '../utils/isIphoneX'

const { height, width } = Dimensions.get('window')
const heightOffset = isIphoneX ? 350 : 150
const widthOffset = 50

const modalHeight = height - heightOffset
const modalWidth = width - widthOffset

const topHeight = 60
const footerHeight = 40
const closeIconWidth = 40

class DistributionModal extends Component {
  _onCancel = () => {
    actionDispatcher(closeModal({ type: 'distribution' }))
  }

  render () {
    const { distribution } = this.props
    const config = distribution.get('config') || null
    return (
      <Modal
        animationType='slide'
        transparent
        visible={!!distribution.size}
        onRequestClose={() => {}}
      >
        <View style={ss.modal}>
          <View style={ss.container}>
            <View style={ss.top}>
              <View style={ss.label}>
                {!!config && <Text style={ss.labelText}>{config.get('label')}</Text>}
              </View>
              <TouchableOpacity style={ss.close} onPress={this._onCancel}>
                <IonIcon name='x' size={30} color={Colors.silver} />
              </TouchableOpacity>
            </View>
            <View style={ss.body} />
            <View style={ss.footer} />
          </View>
        </View>
      </Modal>
    )
  }
}

const stateToProps = state => ({
  distribution: getDistributionModal(state)
})

export default connect(stateToProps, null)(DistributionModal)

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
    height: topHeight,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: Colors.blue,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  label: {
    height: topHeight,
    width: modalWidth - closeIconWidth,
    justifyContent: 'center',
    paddingHorizontal: 5
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: Colors.silver
  },
  close: {
    height: topHeight,
    width: closeIconWidth,
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    height: modalHeight - (topHeight + footerHeight),
    width: '100%'
  },
  footer: {
    height: footerHeight,
    width: '100%',
    backgroundColor: 'red'
  }
})
