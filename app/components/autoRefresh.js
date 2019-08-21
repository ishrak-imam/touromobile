
import React, { Component } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, Dimensions
} from 'react-native'
import { isIphoneX } from '../utils/isIphoneX'
import { Colors, IonIcon } from '../theme'
import { connect } from 'react-redux'
import { getRefreshState } from '../selectors'
import { actionDispatcher } from '../utils/actionDispatcher'
import { hideAutoRefresh } from '../modules/app/action'
import _T from '../utils/translator'
const { width } = Dimensions.get('window')

const SECONDS = 5

class AutoRefresh extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seconds: SECONDS
    }
  }

  _onCancel = () => {
    const { refresh } = this.props
    const config = refresh.get('config')
    const onCancel = config.get('onCancel')
    onCancel()
    this._cancelTimer()
    actionDispatcher(hideAutoRefresh())
  }

  _onOk = () => {
    const { refresh } = this.props
    const config = refresh.get('config')
    const onOk = config.get('onOk')
    onOk()
    this._cancelTimer()
    actionDispatcher(hideAutoRefresh())
  }

  componentWillReceiveProps () {
    setTimeout(this._startTimer, 0)
  }

  _startTimer = () => {
    const { refresh } = this.props
    const config = refresh.get('config')

    if (config.size === 0) return null

    let counter = 5
    this.timer = setInterval(() => {
      counter -= 1
      if (counter === 0) {
        this._onOk()
        this._cancelTimer()
        return
      }
      this.setState({ seconds: this.state.seconds - 1 })
    }, 1000)
  }

  _cancelTimer = () => {
    if (this.timer) clearInterval(this.timer)
    this.setState({ seconds: SECONDS })
  }

  render () {
    const { seconds } = this.state
    const { refresh } = this.props
    const config = refresh.get('config')

    if (!config || config.size === 0) return null

    const text = config.get('text')

    return (
      <View style={ss.container}>
        <View style={ss.view}>
          <View style={ss.body}>
            <Text style={ss.text}>{text.supplant({ seconds })}{seconds > 1 ? _T('s') : ''}</Text>
          </View>
          <TouchableOpacity style={ss.close} onPress={this._onCancel}>
            <IonIcon name='x' size={30} color={Colors.silver} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const stateToProps = state => ({
  refresh: getRefreshState(state)
})

export default connect(stateToProps, null)(AutoRefresh)

const ss = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    position: 'absolute',
    bottom: isIphoneX ? 40 : 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  view: {
    width: width - 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.blue,
    borderRadius: 7,
    paddingHorizontal: 5
  },
  body: {
    flex: 3
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    marginLeft: 10
  },
  close: {
    flex: 0.6,
    alignItems: 'center'
  }
})
