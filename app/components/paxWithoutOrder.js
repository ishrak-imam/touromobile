
import React, { Component } from 'react'
import {
  ListItem, Left, Text,
  Right
} from 'native-base'
import { StyleSheet } from 'react-native'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'

class PaxItem extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.pax.equals(this.props.pax)
  }
  render () {
    const { pax } = this.props
    const paxId = pax.get('id')
    const paxName = `${pax.get('firstName')} ${pax.get('lastName')}`
    const bookingId = pax.get('booking').get('id')
    return (
      <ListItem style={ss.item} key={paxId}>
        <Left style={ss.bottomLeft}>
          <Text>{paxName}</Text>
        </Left>
        <Right style={ss.bottomRight}>
          <Text>{bookingId}</Text>
        </Right>
      </ListItem>
    )
  }
}

export default class PaxWithoutOrder extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.paxList.equals(this.props.paxList)
  }

  _renderItem = ({ item }) => <PaxItem pax={item} />

  render () {
    const { paxList } = this.props
    return (
      <ImmutableVirtualizedList
        keyboardShouldPersistTaps='always'
        immutableData={paxList}
        renderItem={this._renderItem}
        keyExtractor={item => String(item.get('id'))}
      />
    )
  }
}

const ss = StyleSheet.create({
  item: {
    marginRight: 15,
    borderBottomWidth: 0,
    paddingRight: 0,
    marginLeft: 15
  },
  bottomLeft: {
    flex: 2
  },
  bottomRight: {
    flex: 1,
    paddingRight: 10
  }
})
