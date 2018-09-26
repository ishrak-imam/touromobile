
import React, { Component } from 'react'
import {
  View, Text, ListItem, Body, Right
} from 'native-base'
import { getSortedPax, preparePaxData, filterPaxBySearchText } from '../selectors'
import IconButton from '../components/iconButton'
import { Call, Text as Sms } from 'react-native-openanything'
import { StyleSheet } from 'react-native'
import SearchBar from '../components/searchBar'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { Colors } from '../theme'
import Translator from '../utils/translator'
import NoData from '../components/noData'

const _T = Translator('PassengersScreen')

export default class PaxList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comment: null,
      searchText: ''
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !nextProps.trip.equals(this.props.trip) ||
            nextState.searchText !== this.state.searchText
  }

  _toPaxDetails = pax => {
    const { navigation } = this.props
    return () => {
      navigation.navigate('PaxDetails', { pax })
    }
  }

  _renderPhone = number => <IconButton name='phone' color='green' onPress={() => Call(number)} />

  _renderSMS = number => <IconButton name='sms' color='blue' onPress={() => Sms(number)} />

  _renderComment = id => {
    const { comment } = this.state
    const name = comment === id ? 'up' : 'information'
    return (
      <IconButton
        name={name} color='black'
        onPress={() => this.setState({ comment: comment === id ? null : id })}
      />
    )
  }

  _renderPerson = ({ item, index }) => {
    if (item.get('first')) {
      return (
        <ListItem itemDivider style={{ backgroundColor: Colors.headerBg }}>
          <Text style={ss.sectionText}>{item.get('initial')}</Text>
        </ListItem>
      )
    }
    const paxComment = item.get('comment')
    const phone = item.get('phone')
    const id = item.get('id')
    const name = `${item.get('firstName')} ${item.get('lastName')}`
    const { comment } = this.state
    return (
      <ListItem onPress={this._toPaxDetails(item)}>
        <Body>
          <Text>{name}</Text>
          <Text note>{item.get('booking').get('id')}</Text>
          {comment === id && <Text note>{paxComment}</Text>}
        </Body>
        <Right style={ss.itemRight}>
          {!!paxComment && this._renderComment(id)}
          {!!phone && this._renderPhone(phone)}
          {!!phone && this._renderSMS(phone)}
        </Right>
      </ListItem>
    )
  }

  _onSearch = searchText => {
    this.setState({ searchText })
  }

  _renderList = trip => {
    const { searchText } = this.state
    let sortedPax = getSortedPax(trip)
    if (searchText) {
      sortedPax = filterPaxBySearchText(sortedPax, searchText)
    }
    const paxList = preparePaxData(sortedPax)
    return (
      paxList.size
        ? <ImmutableVirtualizedList
          immutableData={paxList}
          renderItem={this._renderPerson}
          keyExtractor={(item, index) => String(index)}
        />
        : <NoData text='No match found' textStyle={{ marginTop: 30 }} />
    )
  }

  render () {
    const { trip } = this.props
    const bookings = trip.get('bookings')
    return (
      <View style={ss.container}>
        <SearchBar onSearch={this._onSearch} icon='people' placeholder={_T('paxSearch')} />
        {!!bookings && this._renderList(trip)}
      </View>
    )
  }
}

const ss = StyleSheet.create({
  container: {
    flex: 1
  },
  itemRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  sectionText: {
    fontWeight: 'bold',
    color: Colors.silver
  }
})
