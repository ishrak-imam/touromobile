
import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Colors, IonIcon } from '../theme'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import _T from '../utils/translator'
import { navigate } from '../navigation/service'

class BookingItem extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.item.booking.equals(this.props.item.booking)
  }

  _toOrdersScreen = (brand, booking, departureId) => {
    return () => {
      navigate('Orders', { brand, booking, departureId })
    }
  }

  render () {
    const { item } = this.props
    const { brand, booking, departureId } = item
    const bookingId = booking.get('id')
    const paxNames = booking.get('pax').reduce((str, p) => {
      str = `${p.get('firstName')} ${p.get('lastName')}, ${str}`
      return str
    }, '')
    return (
      <TouchableOpacity style={ss.item} onPress={this._toOrdersScreen(brand, booking, departureId)}>
        <Text style={ss.bookingId}>{bookingId}</Text>
        <Text style={ss.paxName}>{paxNames.replace(/,\s*$/, '.')}</Text>
      </TouchableOpacity>
    )
  }
}

export default class BookingsWithoutOrder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isExpanded: false
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return !nextProps.bookingsList.equals(this.props.bookingsList) ||
              nextState.isExpanded !== this.state.isExpanded
  }

  _onHeaderPress = () => {
    this.setState({ isExpanded: !this.state.isExpanded })
  }

  _renderItem = ({ item }) => <BookingItem item={item} />

  render () {
    const { bookingsList, label } = this.props
    const { isExpanded } = this.state
    const icon = isExpanded ? 'minus' : 'plus'

    return (
      <View style={ss.container}>
        <TouchableOpacity style={ss.topHeader} onPress={this._onHeaderPress}>
          <View style={ss.sectionIcon}>
            <IonIcon name={icon} size={22} />
          </View>
          <Text style={ss.headerText}>{_T(label)}</Text>
        </TouchableOpacity>

        {
          isExpanded

            ? <ImmutableVirtualizedList
              style={{ marginTop: 10 }}
              scrollEnabled={false}
              keyboardShouldPersistTaps='always'
              immutableData={bookingsList}
              renderItem={this._renderItem}
              keyExtractor={item => String(item.booking.get('id'))}
            />

            : <View style={ss.expandItem}>
              <Text style={ss.expandText}>{_T('clickToExpand')}</Text>
            </View>
        }

      </View>
    )
  }
}

const ss = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginHorizontal: 10
  },
  expandItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  expandText: {
    fontSize: 14
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: Colors.cloud,
    borderRadius: 4
  },
  expandIcon: {
    marginRight: 10,
    fontWeight: 'bold'
  },
  boldText: {
    fontWeight: 'bold'
  },
  topHeader: {
    height: 45,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: Colors.cloud,
    marginVertical: 5,
    paddingLeft: 10
  },
  headerText: {
    fontWeight: 'bold',
    marginBottom: 3
  },
  sectionIcon: {
    marginRight: 10
  },
  bookingId: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  paxName: {
    fontSize: 14,
    color: Colors.charcoal
  }
})
