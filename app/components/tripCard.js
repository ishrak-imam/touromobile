import React, { Component } from 'react'
import {
  StyleSheet, TouchableOpacity,
  ActivityIndicator as Spinner, View
} from 'react-native'
// import Switch from '../components/switch'
import { Text, CheckBox } from 'native-base'
import { IonIcon, Colors } from '../theme'
import ImageCache from './imageCache'
import { LinearGradient } from 'expo'
import { format } from 'date-fns'
import FooterButtons from './footerButtons'
// import { ViewPager } from 'rn-viewpager'
import { getPax, getStatsData, getTotalPercentage } from '../selectors'
import { networkActionDispatcher, actionDispatcher } from '../utils/actionDispatcher'
import { uploadStatsReq } from '../modules/reports/action'
import { getMap } from '../utils/immutable'

import { showModal } from '../modal/action'

const DATE_FORMAT = 'DD/MM'

const HOME = 'HOME'
const OUT = 'OUT'

const SELECTIONS = {
  accomodation: [
    'Single room',
    'Part in double room',
    'No accomodation'
  ]
}

export default class TripCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: HOME
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const modifiedDataChanged = nextProps.modifiedTripData
      ? !nextProps.modifiedTripData.equals(this.props.modifiedTripData)
      : false
    const tripChanged = !nextProps.trip.equals(this.props.trip)
    const stateChanged = this.state !== nextState
    return tripChanged || modifiedDataChanged || stateChanged
  }

  _renderGradient = () => {
    return (
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={ss.gradient}
      />
    )
  }

  get tripData () {
    const { trip, modifiedTripData } = this.props
    const departureId = String(trip.get('departureId'))
    const excursions = trip.get('excursions')
    const participants = modifiedTripData
      ? modifiedTripData.get('participants') ? modifiedTripData.get('participants') : getMap({})
      : getMap({})
    const statsUploadedAt = modifiedTripData ? modifiedTripData.get('statsUploadedAt') : null

    return {
      trip,
      departureId,
      excursions,
      participants,
      statsUploadedAt
    }
  }

  _uploadStats = () => {
    const { trip, departureId, excursions, participants } = this.tripData
    const statsData = getStatsData(excursions, participants, trip)

    networkActionDispatcher(uploadStatsReq({
      isNeedJwt: true,
      departureId,
      statsData,
      showToast: true,
      sucsMsg: 'Reports uploaded successfully',
      failMsg: 'Reports upload failed'
    }))
  }

  _renderUploadButton = () => {
    const { modifiedTripData } = this.props
    const isLoading = modifiedTripData ? modifiedTripData.get('isLoading') : false
    return (
      <View style={{ paddingTop: 10 }}>
        {
          isLoading
            ? <Spinner color={Colors.blue} size='small' style={{ paddingVertical: 10 }} />
            : <TouchableOpacity style={ss.uploadButton} onPress={this._uploadStats}>
              <Text style={ss.uploadButtonText}>Upload report</Text>
            </TouchableOpacity>
        }
      </View>
    )
  }

  _forPastTrips = () => {
    const { trip, excursions, participants, statsUploadedAt } = this.tripData
    const share = getTotalPercentage(excursions, participants, trip)

    return (
      <View style={ss.pastTripCardTop}>
        <Text style={{ fontWeight: 'bold' }}>Participant share: {share}%</Text>
        {
          statsUploadedAt &&
          <Text style={{ fontWeight: 'bold', paddingVertical: 15 }}>Report uploaded: {format(statsUploadedAt, DATE_FORMAT)}</Text>
        }
        {!statsUploadedAt && this._renderUploadButton()}
      </View>
    )
  }

  // _onToggle = v => {
  //   this.refs.pager.setPage(+v)
  // }

  // _onPageSelected = ({ position }) => {
  //   this.setState({ isHome: !!position })
  // }

  _onTabSwitch = tab => {
    return () => {
      this.setState({ tab })
    }
  }

  _onSelect = value => {
    console.log(value)
  }

  _showSelections = of => {
    return () => {
      actionDispatcher(showModal({
        type: 'selection',
        options: SELECTIONS[of],
        onSelect: this._onSelect
      }))
    }
  }

  _renderTabs = () => {
    const { tab } = this.state
    return (
      <View style={ss.tabContainer}>
        <TouchableOpacity
          style={[ss.tab, { backgroundColor: tab === HOME ? Colors.blue : Colors.steel }]}
          onPress={this._onTabSwitch(HOME)}
        >
          <Text style={{ color: tab === HOME ? Colors.silver : Colors.black }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ss.tab, { backgroundColor: tab === OUT ? Colors.blue : Colors.steel }]}
          onPress={this._onTabSwitch(OUT)}
        >
          <Text style={{ color: tab === OUT ? Colors.silver : Colors.black }}>Out</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderSelector = of => {
    return (
      <View style={ss.selector}>
        <View style={ss.selectorText}>
          <Text numberOfLines={1} style={{ fontSize: 14 }}>Overnight hotel Malmö ghjgj jgj </Text>
        </View>
        <View style={ss.dropDown}>
          <IonIcon name='down' color={Colors.charcoal} size={20} onPress={this._showSelections(of)} />
        </View>
      </View>
    )
  }

  _renderHomeCombos = () => {
    return (
      <View style={ss.comboCon}>
        <View style={ss.combo}>
          <Text style={ss.comboLabel}>Accomodation:</Text>
          {this._renderSelector('accomodation')}
        </View>

        <View style={ss.combo}>
          <Text style={ss.comboLabel}>Bag pickup:</Text>
          {this._renderSelector('accomodation')}
        </View>

        <View style={ss.combo}>
          <Text style={ss.comboLabel}>Transfer:</Text>
          {this._renderSelector('accomodation')}
        </View>

        <View style={ss.combo}>
          <Text style={ss.comboLabel}>Transfer city:</Text>
          {this._renderSelector('accomodation')}
        </View>
      </View>
    )
  }

  _renderOutCombos = () => {
    return (
      <View style={ss.comboCon}>
        <View style={ss.combo}>
          <Text style={ss.comboLabel}>Accomodation:</Text>
          {this._renderSelector('accomodation')}
        </View>

        <View style={ss.combo}>
          <Text style={ss.comboLabel}>Bag drop:</Text>
          {this._renderSelector('accomodation')}
        </View>

        <View style={ss.combo}>
          <Text style={ss.comboLabel}>Transfer:</Text>
          {this._renderSelector('accomodation')}
        </View>

        <View style={ss.combo}>
          <Text style={ss.comboLabel}>Transfer city:</Text>
          {this._renderSelector('accomodation')}
        </View>
      </View>
    )
  }

  _forFutureTrips = () => {
    const { tab } = this.state
    return (
      <View style={{ flex: 1 }}>

        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <CheckBox
            checked
            onPress={() => console.log('accept check')}
          />
          <Text style={{ marginLeft: 25 }}>Accept assignment</Text>
        </View>

        <View style={{ flex: 5 }}>

          {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontSize: 14, marginRight: 5 }}>Out</Text>
            <Switch
              isOn={this.state.isHome}
              onColor={Colors.steel}
              offColor={Colors.steel}
              onToggle={this._onToggle}
            />
            <Text style={{ fontSize: 14, marginLeft: 5 }}>Home</Text>
          </View> */}
          {/* <ViewPager style={{ flex: 1 }} ref='pager' onPageSelected={this._onPageSelected} /> */}

          {this._renderTabs()}
          {tab === HOME && this._renderHomeCombos()}
          {tab === OUT && this._renderOutCombos()}

        </View>

      </View>
    )
  }

  _renderCardTop = type => {
    switch (type) {
      case 'future':
        return this._forFutureTrips()
      case 'past':
        return this._forPastTrips()
    }
  }

  render () {
    const { trip, type } = this.props

    const brand = trip.get('brand')
    const name = trip.get('name')
    const outDate = format(trip.get('outDate'), DATE_FORMAT)
    const homeDate = format(trip.get('homeDate'), DATE_FORMAT)
    const transport = trip.get('transport')
    const image = trip.get('image')
    const pax = getPax(trip)

    const cardHeight = type === 'future' ? 350 : 250
    const imageHeight = type === 'future' ? 300 : 200

    return (
      <View style={[ss.card, { height: cardHeight }]}>

        <View style={[ss.cardHeader, { backgroundColor: Colors[`${brand}Brand`] }]}>
          <Text style={ss.brandText}>{brand}</Text>
          <Text>{`${name}    ${outDate} - ${homeDate}`}</Text>
          <IonIcon name={transport.get('type')} />
        </View>

        <View style={[ss.imageContainer, { height: imageHeight }]}>
          <ImageCache uri={image} style={ss.cardImage} />
          {/* {this._renderGradient()} */}
          <View style={ss.cardBody}>
            <View style={ss.cardTop}>
              {this._renderCardTop(type)}
            </View>
            <View style={ss.cardBottom}>
              <View style={ss.bottomLeft}>
                <IonIcon name='people' color={Colors.black} size={30} />
                <Text style={[ss.brandText, { color: Colors.black, marginLeft: 10 }]}>{pax.size}</Text>
              </View>
              <View style={ss.bottomRight}>
                {
                  type === 'future' &&
                  <FooterButtons
                    style={ss.footerButtons}
                    disabled
                    onCancel={() => console.log('cancel')}
                    onSave={() => console.log('save')}
                  />
                }
              </View>
            </View>
          </View>
        </View>

      </View>
    )
  }
}

const ss = StyleSheet.create({
  card: {
    // height: 250,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  cardHeader: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 0,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardContent: {
    flex: 1
  },
  imageContainer: {
    borderWidth: 0,
    // height: 200,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden'// needed for iOS
  },
  cardImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.2,
    borderBottomLeftRadius: 10, // needed for Android
    borderBottomRightRadius: 10, // needed for Android
    width: null,
    height: null
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  cardBody: {
    flex: 1
  },
  cardTop: {
    flex: 5
    // backgroundColor: 'red'
  },
  cardBottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  bottomLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
  },
  bottomRight: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  uploadButton: {
    width: 150,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: Colors.blue
  },
  uploadButtonText: {
    color: Colors.silver,
    fontWeight: 'bold'
  },
  pastTripCardTop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerButtons: {
    marginBottom: 5
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5
  },
  tab: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 5
  },
  selectorText: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1,
    borderRightWidth: 0,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderColor: Colors.charcoal
  },
  dropDown: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.blue,
    alignItems: 'center',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3
  },
  selector: {
    height: 30,
    width: 200,
    flexDirection: 'row'
  },
  comboCon: {
    paddingHorizontal: 20
  },
  combo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  comboLabel: {
    fontSize: 14,
    lineHeight: 40
  }
})
