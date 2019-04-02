
import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Container, Text, CheckBox } from 'native-base'
import Header from '../../components/header'
import { connect } from 'react-redux'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { getPax, getAcceptedAssignments } from '../../selectors'
import { Colors, IonIcon } from '../../theme'
import ImageCache from '../../components/imageCache'
import { tripNameFormatter } from '../../utils/stringHelpers'
import { format } from 'date-fns'
import OutHomeTab, { TABS } from '../../components/outHomeTab'
import _T from '../../utils/translator'

const DATE_FORMAT = 'DD/MM'

class MyOrderCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 'out'
    }
  }

  _onTabSwitch = tab => {
    return () => {
      this.setState({ tab })
    }
  }

  _renderComboLabel = label => {
    return (
      <View style={ss.comboText}>
        <Text style={ss.comboLabel}>{_T(label)}:</Text>
      </View>
    )
  }

  _renderComboText = text => {
    return (
      <View style={ss.selector}>
        <View style={ss.selectorBox}>
          <Text numberOfLines={1} style={ss.selectorText}>{text}</Text>
        </View>
      </View>
    )
  }

  _renderOutCombos = out => {
    return (
      <View style={ss.comboCon}>
        <View style={ss.combo}>
          {this._renderComboLabel('boardingLoc')}
          {this._renderComboText(out.getIn(['location', 'value']))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('transfer')}
          {this._renderComboText(out.getIn(['transfer', 'value']))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('transferCity')}
          {this._renderComboText(out.getIn(['transferCity', 'value']))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('accommodation')}
          {this._renderComboText(out.getIn(['accommodation', 'value']))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('bagPick')}
          {this._renderComboText(out.getIn(['bag', 'value']))}
        </View>
      </View>
    )
  }

  _renderHomeCombos = home => {
    return (
      <View style={ss.comboCon}>
        <View style={ss.combo}>
          {this._renderComboLabel('alightingLoc')}
          {this._renderComboText(home.getIn(['location', 'value']))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('transfer')}
          {this._renderComboText(home.getIn(['transfer', 'value']))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('transferCity')}
          {this._renderComboText(home.getIn(['transferCity', 'value']))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('accommodation')}
          {this._renderComboText(home.getIn(['accommodation', 'value']))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('bagDrop')}
          {this._renderComboText(home.getIn(['bag', 'value']))}
        </View>
      </View>
    )
  }

  _renderCardTop = (out, home, acceptedAt) => {
    const { tab } = this.state
    return (
      <View style={ss.futureTtip}>
        <View style={ss.futureTripCheck}>
          <CheckBox disabled checked />
          <Text style={ss.checkText}>{_T('acceptedAt')} {format(acceptedAt, DATE_FORMAT)}</Text>
        </View>
        <View style={ss.comboTabs}>
          <View style={ss.outHomeTabs}>
            <OutHomeTab selected={tab} onPress={this._onTabSwitch} />
          </View>
          {tab === TABS.OUT && this._renderOutCombos(out)}
          {tab === TABS.HOME && this._renderHomeCombos(home)}
        </View>
      </View>
    )
  }

  render () {
    const { order } = this.props
    const trip = order.get('trip')
    const out = order.get('out')
    const home = order.get('home')
    const acceptedAt = order.get('acceptedAt')
    let brand = trip.get('brand')
    if (brand === 'OL') brand = 'OH'
    const name = trip.get('name')
    const { title, subtitle } = tripNameFormatter(name, 15)
    const outDate = format(trip.get('outDate'), DATE_FORMAT)
    const homeDate = format(trip.get('homeDate'), DATE_FORMAT)
    const transport = trip.get('transport')
    const image = trip.get('image')
    const pax = getPax(trip)
    const transportType = transport ? transport.get('type') : ''

    return (
      <View style={ss.card}>
        <View style={[ss.cardHeader, { backgroundColor: Colors[`${brand}Brand`] }]}>
          <View style={ss.headerTop}>
            <Text style={ss.brandText}>{`${brand}  ${title}`}</Text>
            <Text>{`${outDate} - ${homeDate}`}</Text>
            {transportType && <IonIcon name={transportType} />}
          </View>
          {
            !!subtitle &&
            <View>
              <Text numberOfLines={1}>{subtitle}</Text>
            </View>
          }
        </View>

        <View style={ss.imageContainer}>
          <ImageCache uri={image} style={ss.cardImage} transportType={transportType} />
          <View style={ss.cardBody}>
            <View style={ss.cardTop}>
              {this._renderCardTop(out, home, acceptedAt)}
            </View>
            <View style={ss.cardBottom}>
              <View style={ss.bottomLeft}>
                <IonIcon name='people' color={Colors.black} size={30} />
                <Text style={[ss.brandText, { marginLeft: 10 }]}>{pax.size}</Text>
              </View>
              <View style={ss.bottomRight} />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

class MyOrders extends Component {
  _renderCard = ({ item }) => {
    return (
      <MyOrderCard order={item} />
    )
  }

  render () {
    const { acceptedAssignments, navigation } = this.props
    return (
      <Container>
        <Header left='back' title={_T('myOrders')} navigation={navigation} />
        <ImmutableVirtualizedList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10, paddingBottom: 15 }}
          immutableData={acceptedAssignments}
          renderItem={this._renderCard}
          keyExtractor={item => item.get('acceptedAt')}
          renderEmptyInList={_T('noAssignments')}
        />

      </Container>
    )
  }
}

const stateToProps = state => ({
  acceptedAssignments: getAcceptedAssignments(state)
})

export default connect(stateToProps, null)(MyOrders)

const ss = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginBottom: 15,
    height: 400
  },
  cardHeader: {
    height: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black
  },
  imageContainer: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 340,
    overflow: 'hidden' // needed for iOS
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
  cardBody: {
    flex: 1
  },
  cardTop: {
    flex: 5
  },
  cardBottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  futureTtip: {
    flex: 1
  },
  futureTripCheck: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  checkText: {
    marginLeft: 25
  },
  comboTabs: {
    flex: 5
  },
  outHomeTabs: {
    marginBottom: 10
  },
  comboCon: {
    paddingHorizontal: 10
  },
  combo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5
  },
  comboLabel: {
    fontSize: 14
  },
  comboText: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectorBox: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Colors.charcoal
  },
  selectorText: {
    fontSize: 14
  },
  selector: {
    flex: 1.5,
    height: 30,
    flexDirection: 'row',
    backgroundColor: Colors.silver,
    borderRadius: 3
  }
})
