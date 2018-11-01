
import React, { Component } from 'react'
import {
  View, Text, ListItem, Body, Right
} from 'native-base'
import {
  getSortedPax, preparePaxData,
  filterPaxBySearchText, getModifiedPax
} from '../selectors'
import IconButton from '../components/iconButton'
import { call, sms } from '../utils/comms'
import { StyleSheet } from 'react-native'
import SearchBar from '../components/searchBar'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { Colors } from '../theme'
import Translator from '../utils/translator'
import NoData from '../components/noData'
import { connect } from 'react-redux'
import { mergeMapShallow } from '../utils/immutable'

const _T = Translator('PassengersScreen')

class PaxItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comment: false
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !nextProps.pax.equals(this.props.pax) ||
            nextState.comment !== this.state.comment
  }

  _renderPhone = number => <IconButton name='phone' color='green' onPress={() => call(number)} />

  _renderSMS = number => <IconButton name='sms' color='blue' onPress={() => sms(number)} />

  _commentToggle = () => {
    const { comment } = this.state
    const name = comment ? 'up' : 'info'
    return (
      <IconButton
        name={name} color='black'
        onPress={() => this.setState({ comment: !this.state.comment })}
      />
    )
  }

  render () {
    const { pax, onItemPress } = this.props
    const { comment } = this.state
    if (pax.get('first')) {
      return (
        <ListItem itemDivider style={{ backgroundColor: Colors.blue }}>
          <Text style={ss.sectionText}>{pax.get('initial')}</Text>
        </ListItem>
      )
    }
    const paxComment = pax.get('comment')
    const phone = pax.get('phone')
    const name = `${pax.get('firstName')} ${pax.get('lastName')}`
    return (
      <ListItem onPress={onItemPress(pax)}>
        <Body style={ss.itemBody}>
          <Text numberOfLines={1}>{name}</Text>
          {/* <Text note>{pax.get('booking').get('id')}</Text> */}
          {comment && <Text note>{paxComment}</Text>}
        </Body>
        <Right style={ss.itemRight}>
          {!!paxComment && this._commentToggle()}
          {!!phone && this._renderPhone(phone)}
          {!!phone && this._renderSMS(phone)}
        </Right>
      </ListItem>
    )
  }
}

class PaxList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchText: ''
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !nextProps.trip.equals(this.props.trip) ||
            nextState.searchText !== this.state.searchText ||
            !nextProps.modifiedPax.equals(this.props.modifiedPax)
  }

  _toPaxDetails = pax => {
    const { navigation, trip } = this.props
    const departureId = String(trip.get('departureId'))
    const brand = trip.get('brand')
    return () => {
      navigation.navigate('PaxDetails', { brand, pax, departureId })
    }
  }

  _renderPerson = ({ item }) => {
    const { modifiedPax } = this.props
    const paxId = String(item.get('id'))
    const pax = mergeMapShallow(item, modifiedPax.get(paxId))
    return (
      <PaxItem
        pax={pax}
        onItemPress={this._toPaxDetails}
      />
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
          keyboardShouldPersistTaps='always'
          immutableData={paxList}
          renderItem={this._renderPerson}
          keyExtractor={(item, index) => String(index)}
        />
        : <NoData text='noMatch' textStyle={{ marginTop: 30 }} />
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

const stateToProps = (state, props) => {
  const { trip } = props
  const departureId = String(trip.get('departureId'))
  return {
    modifiedPax: getModifiedPax(state, departureId)
  }
}

export default connect(stateToProps, null)(PaxList)

const ss = StyleSheet.create({
  container: {
    flex: 1
  },
  itemBody: {
    flex: 4
  },
  itemRight: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  sectionText: {
    fontWeight: 'bold',
    color: Colors.silver
  }
})
