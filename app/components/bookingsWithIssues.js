
import React, { Component } from 'react'
import { Text } from 'native-base'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors, IonIcon } from '../theme'
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

export default class BookingsWithIssues extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isExpanded: false
    }
  }

  _onHeaderPress = () => {
    this.setState({ isExpanded: !this.state.isExpanded })
  }

  _renderIssues = (issues, orderIssues) => {
    return issues.map(issue => {
      const orderIssue = orderIssues[issue]
      let { desc, bookings } = orderIssue
      bookings = bookings.map(b => {
        return (<BookingItem item={b} key={b.booking.get('id')} />)
      })
      return (
        <View style={ss.section} key={issue}>
          <View style={ss.sectionLabel}>
            <Text style={ss.issueLabel}>{_T(desc)}</Text>
          </View>
          {bookings}
        </View>
      )
    })
  }

  render () {
    const { issues, orderIssues, label } = this.props
    const { isExpanded } = this.state
    const icon = isExpanded ? 'minus' : 'plus'

    return (
      <View style={ss.container}>
        <TouchableOpacity style={ss.topHeader} onPress={this._onHeaderPress}>
          <View style={ss.sectionIcon}>
            <IonIcon name={icon} size={22} />
          </View>
          <Text style={ss.headerText}>{label}</Text>
        </TouchableOpacity>
        {isExpanded
          ? this._renderIssues(issues, orderIssues)
          : <View style={ss.expandItem}>
            <Text style={ss.expandText}>{_T('clickToExpand')}</Text>
          </View>}
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
  expandText: {
    fontSize: 14
  },
  bottomRight: {
    flex: 1,
    paddingRight: 10
  },
  issueLabel: {
    marginBottom: 5,
    fontWeight: 'bold'
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
  bookingId: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  paxName: {
    fontSize: 14,
    color: Colors.charcoal
  },
  section: {
    width: '100%',
    marginVertical: 10
  },
  sectionLabel: {
    marginLeft: 10
  }
})
