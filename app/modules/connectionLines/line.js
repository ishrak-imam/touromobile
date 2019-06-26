
import React, { Component } from 'react'
import {
  View, Text, StyleSheet,
  Dimensions, TouchableOpacity
} from 'react-native'
import { Colors, IonIcon } from '../../theme'
import { format } from 'date-fns'

const ETA_FORMAT = 'HH:mm'
const { width } = Dimensions.get('window')
const ITEM_HEIGHT = 45

class LocationItem extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showPaxList: false
    }
  }

  _togglePaxList = () => {
    this.setState({ showPaxList: !this.state.showPaxList })
  }

  _renderConnectToPax = connectTo => {
    return connectTo.keySeq().toArray().map(name => {
      const line = connectTo.get(name)
      const locations = line.get('locations')
      return (
        <View key={name}>
          <View style={[ss.paxItem, { marginTop: 10 }]} >
            <Text>Switching to line {name}</Text>
          </View>

          {locations.toArray().map(location => {
            const passengers = location.get('passengers')
            const eta = location.get('eta')
            return (
              <View key={eta}>
                {passengers.toArray().map(pax => {
                  const paxId = String(pax.get('id'))
                  const paxName = `${pax.get('firstName')} ${pax.get('lastName')}`
                  return (
                    <View style={ss.paxItem} key={paxId}>
                      <Text style={ss.paxNameText}>{paxName} - {paxId}</Text>
                    </View>
                  )
                })}
              </View>
            )
          })}

        </View>
      )
    })
  }

  _renderPaxList = location => {
    const passengers = location.get('passengers')
    const connectTo = location.get('connectTo')
    return (
      <View>
        {passengers.toArray().map(pax => {
          const paxId = String(pax.get('id'))
          const paxName = `${pax.get('firstName')} ${pax.get('lastName')}`
          return (
            <View style={ss.paxItem} key={paxId}>
              <Text style={ss.paxNameText}>{paxName} - {paxId}</Text>
            </View>
          )
        })}
        {!!connectTo.size && this._renderConnectToPax(connectTo)}
      </View>
    )
  }

  render () {
    const { showPaxList } = this.state
    const { type, location, connectFrom, isFirst, isLast, isOnePlus } = this.props

    const name = location.get('name')
    const eta = location.get('eta')
    let paxCount = location.get('passengers').size

    const connectTo = location.get('connectTo')
    if (connectTo.size > 0) {
      connectTo.every(conn => {
        paxCount += conn.get('paxCount')
        return true
      })
    }

    let leftItem = <View style={ss.circle}><View style={ss.inner} /></View>
    if (isFirst) leftItem = <IonIcon name={type} />
    if (isLast && isOnePlus) {
      leftItem = <View style={ss.circle} />
    }

    return (
      <View style={ss.wrapper}>
        <TouchableOpacity style={ss.location} onPress={this._togglePaxList}>
          <View style={ss.locationLeft}>
            {leftItem}
          </View>
          <View style={ss.middle}>
            <Text style={[ss.locationText, { marginLeft: 5 }]}>{format(eta, ETA_FORMAT)}  {name}</Text>
            {
              isFirst && connectFrom.size > 0 &&
              <Text style={[ss.connectFrom, { marginLeft: 5 }]}>Connected from line {connectFrom.join(', ')}</Text>
            }
          </View>
          <View style={ss.right}>
            <Text style={ss.paxCountText}>{paxCount}</Text>
            <IonIcon name='people' />
          </View>
        </TouchableOpacity>
        {showPaxList && this._renderPaxList(location)}
      </View>
    )
  }
}

export default class Line extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showLocations: false
    }
  }

  _toggleShowLocations = () => {
    this.setState({ showLocations: !this.state.showLocations })
  }

  _renderHeader = line => {
    return (
      <TouchableOpacity style={ss.header} onPress={this._toggleShowLocations}>
        <View style={ss.left}>
          <View style={ss.name}>
            <Text style={ss.nameText}>{line.get('name')}</Text>
          </View>
        </View>
        <View style={ss.middle}>
          <Text style={ss.destinationText}>{line.get('destination')}</Text>
        </View>
        <View style={ss.right}>
          <Text style={ss.paxCountText}>{line.get('paxCount')}</Text>
          <IonIcon name='people' color={Colors.blue} />
        </View>
      </TouchableOpacity>
    )
  }

  _renderLocations = (locations, type, connectFrom) => {
    const { showLocations } = this.state
    let marginBottom = 0
    if (showLocations) marginBottom = 15
    return (
      <View style={[ss.wrapper, { marginBottom }]}>
        {
          locations.toArray().map((loc, index) => {
            const isFirst = index === 0
            const isLast = index === (locations.size - 1)
            const isOnePlus = locations.size > 1
            return (
              <LocationItem
                key={loc.get('eta')}
                type={type}
                location={loc}
                isFirst={isFirst}
                isLast={isLast}
                isOnePlus={isOnePlus}
                connectFrom={connectFrom}
              />
            )
          })
        }
      </View>
    )
  }

  render () {
    const { showLocations } = this.state
    const { line } = this.props
    const locations = line.get('locations')
    const type = line.get('type')
    const connectFrom = line.get('connectFrom')
    return (
      <View style={ss.wrapper}>
        {this._renderHeader(line)}
        {showLocations && this._renderLocations(locations, type, connectFrom)}
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
    borderRadius: 5,
    flexDirection: 'row'
  },
  location: {
    height: ITEM_HEIGHT - 10,
    width: width - 20,
    paddingHorizontal: 10,
    marginTop: 7,
    flexDirection: 'row'
    // borderRadius: 5,
    // backgroundColor: Colors.cloud
  },
  paxItem: {
    height: 30,
    width: width - 10,
    paddingRight: 10,
    paddingLeft: 45,
    flexDirection: 'row',
    alignItems: 'center'
  },
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  locationLeft: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.white
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
  nameText: {
    fontWeight: '800'
  },
  middle: {
    flex: 4.5,
    justifyContent: 'center'
  },
  destinationText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600'
  },
  connectFrom: {
    fontSize: 12,
    fontStyle: 'italic'
  },
  paxNameText: {
    fontSize: 15,
    color: Colors.blue
    // fontWeight: '600'
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
  }
})
