
import React, { Component } from 'react'
import {
  View, StyleSheet, Text,
  TouchableOpacity, Dimensions
} from 'react-native'
import { Colors, IonIcon } from '../../theme'

const { width } = Dimensions.get('window')

const ITEM_HEIGHT = 45
const PAX_ITEM_HEIGHT = ITEM_HEIGHT - 15

export default class Hotel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showPax: false
    }
  }

  componentWillReceiveProps (nextProps) {
    const { expand } = nextProps
    this.setState({ showPax: expand })
  }

  _toggleShowPax = () => {
    this.setState({ showPax: !this.state.showPax })
  }

  _renderHeader = hotel => {
    const { onIconPress } = this.props
    return (
      <TouchableOpacity style={ss.header} onPress={this._toggleShowPax}>
        <View style={ss.left}>
          <View style={ss.name}>
            <IonIcon name='sleep' />
          </View>
        </View>
        <View style={ss.middle}>
          <Text style={ss.hotelNameText}>{hotel.get('name')}</Text>
        </View>
        <TouchableOpacity style={ss.right} onPress={onIconPress(hotel, 'hotels')}>
          <Text style={ss.paxCountText}>{hotel.get('totalPax')}</Text>
          <IonIcon name='people' color={Colors.blue} />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  _renderPax = lines => {
    const { onPaxItemPress } = this.props
    return lines.valueSeq().map((line) => {
      const name = line.get('name')
      const passengers = line.get('passengers')
      return (
        <View key={name}>
          <View style={ss.paxListHeader} >
            {/* <View style={ss.left} /> */}
            <View style={ss.middle}>
              <Text style={ss.lineName}>{name}:</Text>
            </View>
            <View style={ss.right} />
          </View>
          {
            passengers.toArray().map(pax => {
              const paxId = String(pax.get('id'))
              const paxName = `${pax.get('firstName')} ${pax.get('lastName')}`
              const bookingId = pax.get('bookingId')
              return (
                <TouchableOpacity style={ss.paxItem} key={paxId} onPress={onPaxItemPress(paxId)}>
                  {/* <View style={ss.left} /> */}
                  <View style={ss.middle}>
                    <Text style={ss.paxNameText}>{paxName}</Text>
                  </View>
                  <View style={ss.right}>
                    <Text style={ss.paxIdText}>{bookingId}</Text>
                  </View>
                </TouchableOpacity>
              )
            })
          }
        </View>
      )
    })
  }

  render () {
    const { showPax } = this.state
    const { hotel } = this.props
    const lines = hotel.get('lines')
    return (
      <View style={ss.wrapper}>
        {this._renderHeader(hotel)}
        {showPax && this._renderPax(lines)}
      </View>
    )
  }
}

const ss = StyleSheet.create({
  wrapper: {
    alignItems: 'center'
  },
  header: {
    height: ITEM_HEIGHT,
    width: width - 10,
    backgroundColor: Colors.cloud,
    paddingHorizontal: 10,
    marginTop: 7,
    borderRadius: 4,
    flexDirection: 'row'
  },
  paxListHeader: {
    height: PAX_ITEM_HEIGHT,
    width: width - 20,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  paxItem: {
    height: PAX_ITEM_HEIGHT,
    width: width - 20,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  left: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  name: {
    width: 35,
    height: 25,
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  middle: {
    flex: 4.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 7
  },
  hotelNameText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  right: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 5
  },
  paxCountText: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: 'bold'
  },
  lineName: {
    fontSize: 14,
    fontWeight: '600'
    // marginLeft: 5
  },
  paxNameText: {
    fontSize: 15,
    color: Colors.blue
  },
  paxIdText: {
    fontSize: 15,
    color: Colors.blue,
    marginRight: 5
  }
})
