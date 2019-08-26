
import React, { Component, Fragment } from 'react'
import {
  View, Text, StyleSheet,
  Dimensions, TouchableOpacity
} from 'react-native'
import { Colors, IonIcon } from '../../theme'
import { format } from 'date-fns'
import _T from '../../utils/translator'

const ETA_FORMAT = 'HH:mm'
const { width } = Dimensions.get('window')

const ITEM_HEIGHT = 45
const LOCATION_HEIGHT = ITEM_HEIGHT - 10
const PAX_ITEM_HEIGHT = LOCATION_HEIGHT - 5
const LEFT_ICON_SIZE = 22
const CIRCLE_DIM = 18
const LOCATION_MARGIN_TOP = 5

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

  _renderConnectToPax = (connectTo, showHeader, isLast) => {
    const { onLineSwitchPress } = this.props
    return connectTo.keySeq().toArray().map(name => {
      const line = connectTo.get(name)
      const connectFrom = line.get('connectFrom')
      const locations = line.get('locations')
      return (
        <View key={name}>
          {
            showHeader &&
            <View style={ss.paxListHeader} >
              <View style={[ss.locationLeft]}>
                {!isLast && <View style={ss.paxLine} />}
              </View>
              <TouchableOpacity style={ss.middle} onPress={onLineSwitchPress(connectFrom, name)}>
                <Text style={ss.switchText}>{_T('switchingToLine')} {name}:</Text>
              </TouchableOpacity>
              <View style={ss.right} />
              {/* <Text style={ss.switchText}>Switching to line {name}</Text> */}
            </View>
          }
          {locations.toArray().map(location => {
            const eta = location.get('eta')
            return (
              <View key={eta}>
                {this._renderPaxList(location, false, isLast, true)}
              </View>
            )
          })}

        </View>
      )
    })
  }

  _renderPaxList = (location, showHeader, isLast, indent) => {
    const { onPaxItemPress } = this.props
    const passengers = location.get('passengers')
    const connectTo = location.get('connectTo')
    return (
      <View>
        {passengers.toArray().map(pax => {
          let marginLeft = 5
          if (indent) marginLeft = 15

          const paxId = String(pax.get('id'))
          const bookingId = String(pax.get('bookingId'))
          const paxName = `${pax.get('firstName')} ${pax.get('lastName')}`
          return (
            <TouchableOpacity style={ss.paxItem} key={paxId} onPress={onPaxItemPress(paxId)}>
              <View style={ss.locationLeft}>
                {!isLast && <View style={ss.paxLine} />}
              </View>
              <View style={ss.middle}>
                <Text style={[ss.paxNameText, { marginLeft }]}>{paxName}</Text>
              </View>
              <View style={ss.right}>
                <Text style={ss.paxIdText}>{bookingId}</Text>
              </View>
              {/* <Text style={ss.paxNameText}>{paxName} - {paxId}</Text> */}
            </TouchableOpacity>
          )
        })}
        {!!connectTo.size && this._renderConnectToPax(connectTo, showHeader, isLast)}
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

    let onPress = this._togglePaxList
    if (!paxCount) onPress = () => {}

    let leftItem = <View style={ss.circle}><View style={ss.inner} /></View>
    let leftLineTop = <View style={ss.leftLine} />
    let leftLineBottom = <View style={ss.leftLine} />
    if (isFirst) {
      leftLineTop = <View style={[ss.leftLine, { backgroundColor: 'transparent' }]} />
      leftItem = <IonIcon name={type} size={LEFT_ICON_SIZE} style={{ marginBottom: -4 }} />
    }
    if (isLast) {
      leftItem = <View style={ss.circleLast}><View style={ss.innerLast} /></View>
      leftLineBottom = <View style={[ss.leftLine, { backgroundColor: 'transparent' }]} />
    }
    if (!isOnePlus) {
      leftItem = <IonIcon name={type} size={LEFT_ICON_SIZE} />
    }

    return (
      <View style={ss.wrapper}>
        <TouchableOpacity style={ss.location} onPress={onPress}>
          <View style={ss.locationLeft}>
            {leftLineTop}
            {leftItem}
            {leftLineBottom}
          </View>
          <View style={ss.locationMiddle}>
            <Text style={[ss.locationText, { marginLeft: 5 }]}>{format(eta, ETA_FORMAT)}  {name}</Text>
            {
              isFirst && connectFrom.size > 0 &&
              <Text style={[ss.connectFrom, { marginLeft: 5 }]}>Connected from line {connectFrom.join(', ')}</Text>
            }
          </View>
          <View style={ss.right}>
            {
              !!paxCount &&
              <Fragment>
                <Text style={ss.paxCountText}>{paxCount}</Text>
                <IonIcon name='people' />
              </Fragment>
            }
          </View>
        </TouchableOpacity>
        {showPaxList && this._renderPaxList(location, true, isLast, false)}
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

  componentWillReceiveProps (nextProps) {
    const { expand } = nextProps
    this.setState({ showLocations: expand })
  }

  _toggleShowLocations = () => {
    this.setState({ showLocations: !this.state.showLocations })
  }

  expandLine = () => {
    this.setState({ showLocations: true })
  }

  _renderHeader = line => {
    const { onIconPress } = this.props
    const isOvernight = line.get('overnight')

    let onPress = () => {}
    let showPaxCount = !!line.get('paxCount')
    let paxCount = 0
    if (showPaxCount) {
      onPress = onIconPress(line, 'lines')
      paxCount = line.get('paxCount')
    }

    return (
      <TouchableOpacity style={ss.header} onPress={this._toggleShowLocations}>
        <View style={ss.left}>
          <View style={ss.name}>
            <Text style={ss.nameText}>{line.get('name')}</Text>
          </View>
        </View>
        <View style={ss.middle}>
          <Text style={ss.destinationText}>{line.get('destination')}</Text>
          {isOvernight && <IonIcon style={{ marginLeft: 10 }} name='sleep' />}
        </View>
        <TouchableOpacity style={ss.right} onPress={onPress}>
          {
            showPaxCount &&
            <Fragment>
              <Text style={ss.paxCountText}>{paxCount}</Text>
              <IonIcon name='people' color={Colors.blue} />
            </Fragment>
          }
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  _renderLocations = (locations, type, connectFrom) => {
    const { onPaxItemPress, onLineSwitchPress } = this.props
    const { showLocations } = this.state
    let marginBottom = 0
    if (showLocations) marginBottom = 0 // 15 // might need later
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
                onPaxItemPress={onPaxItemPress}
                onLineSwitchPress={onLineSwitchPress}
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
    borderRadius: 4,
    flexDirection: 'row'
  },
  location: {
    height: LOCATION_HEIGHT,
    width: width - 20,
    paddingHorizontal: 5,
    marginTop: LOCATION_MARGIN_TOP,
    flexDirection: 'row'
  },
  paxItem: {
    height: PAX_ITEM_HEIGHT,
    width: width - 20,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  paxListHeader: {
    height: PAX_ITEM_HEIGHT,
    width: width - 20,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  left: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  locationLeft: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paxLine: {
    height: '100%',
    width: 1.5,
    backgroundColor: Colors.black
  },
  leftLine: {
    height: ((LOCATION_HEIGHT - CIRCLE_DIM) / 2) + (LOCATION_MARGIN_TOP / 2) + 5,
    width: 1.5,
    backgroundColor: Colors.black
  },
  circle: {
    width: CIRCLE_DIM,
    height: CIRCLE_DIM,
    borderRadius: (CIRCLE_DIM) / 2,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleLast: {
    width: CIRCLE_DIM,
    height: CIRCLE_DIM,
    borderRadius: (CIRCLE_DIM) / 2,
    borderWidth: 2,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inner: {
    width: CIRCLE_DIM - 4,
    height: CIRCLE_DIM - 4,
    borderRadius: (CIRCLE_DIM - 4) / 2,
    backgroundColor: Colors.white
  },
  innerLast: {
    width: CIRCLE_DIM - 10,
    height: CIRCLE_DIM - 10,
    borderRadius: (CIRCLE_DIM - 10) / 2,
    backgroundColor: Colors.black
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  locationMiddle: {
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
    // marginLeft: 5
  },
  paxIdText: {
    fontSize: 15,
    color: Colors.blue,
    marginRight: 5
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
  switchText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5
  }
})
