
import React, { Component } from 'react'
import { ListItem, Left, Text } from 'native-base'
import { View, StyleSheet } from 'react-native'
import { Colors, IonIcon } from '../theme'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import Translator from '../utils/translator'

const _T = Translator('WithoutOrder')

class BookingItem extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.booking.equals(this.props.booking)
  }
  render () {
    const { booking } = this.props
    const bookingId = booking.get('id')
    const paxNames = booking.get('pax').reduce((str, p) => {
      str = `${p.get('firstName')} ${p.get('lastName')}, ${str}`
      return str
    }, '')
    return (
      <View style={ss.item}>
        <Text>{bookingId}</Text>
        <Text note>{paxNames.replace(/,\s*$/, '.')}</Text>
      </View>
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

  _renderItem = ({ item }) => <BookingItem booking={item} />

  render () {
    const { bookingsList, label } = this.props
    const { isExpanded } = this.state
    const icon = isExpanded ? 'up' : 'down'

    return (
      <View style={ss.container}>
        <ListItem style={ss.header} onPress={this._onHeaderPress}>
          <Left style={ss.bottomLeft}>
            <IonIcon name={icon} style={ss.expandIcon} />
            <Text style={ss.label}>{_T(label)}</Text>
          </Left>
        </ListItem>

        {
          isExpanded

            ? <ImmutableVirtualizedList
              contentContainerStyle={{ marginBottom: 90 }}
              scrollEnabled={false}
              keyboardShouldPersistTaps='always'
              immutableData={bookingsList}
              renderItem={this._renderItem}
              keyExtractor={item => String(item.get('id'))}
            />

            : <ListItem style={ss.expandItem}>
              <Text style={ss.expandText}>{_T('clickToExpand')}</Text>
            </ListItem>
        }

      </View>
    )
  }
}

const ss = StyleSheet.create({
  expandItem: {
    borderBottomWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 90,
    marginLeft: 15
  },
  expandText: {
    fontSize: 14
  },
  header: {
    marginRight: 15,
    paddingBottom: 5,
    borderBottomColor: Colors.steel,
    borderBottomWidth: 1,
    paddingRight: 0,
    marginLeft: 15,
    marginBottom: 10
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 15,
    marginLeft: 20,
    marginVertical: 10
  },
  container: {
    marginBottom: 20
  },
  expandIcon: {
    marginRight: 10,
    fontWeight: 'bold'
  },
  label: {
    fontWeight: 'bold',
    fontSize: 13
  },
  boldText: {
    fontWeight: 'bold'
  }
})
