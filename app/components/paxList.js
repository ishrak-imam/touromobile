
import React, { Component } from 'react'
import {
  View, Text, ListItem, Body, Right
} from 'native-base'
import {
  getSortedPax, preparePaxData,
  filterPaxBySearchText, getPaxFromStore
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

const _T = Translator('PassengersScreen')

// class PaxItem extends Component {
//   _renderPhone = number => <IconButton name='phone' color='green' onPress={() => call(number)} />

//   _renderSMS = number => <IconButton name='sms' color='blue' onPress={() => sms(number)} />

//   _renderComment = id => {
//     const { comment, onInfoIconPress } = this.props
//     const name = comment === id ? 'up' : 'information'
//     return (
//       <IconButton
//         name={name} color='black'
//         // onPress={() => this.setState({ comment: comment === id ? null : id })}
//         onPress={onInfoIconPress({ comment: comment === id ? null : id })}
//       />
//     )
//   }

//   render () {
//     const { item, modifiedData, comment } = this.props
//     if (item.get('first')) {
//       return (
//         <ListItem itemDivider style={{ backgroundColor: Colors.headerBg }}>
//           <Text style={ss.sectionText}>{item.get('initial')}</Text>
//         </ListItem>
//       )
//     }

//     const id = String(item.get('id'))
//     const modifiedpax = modifiedData.get(id) || item
//     const paxComment = modifiedpax.get('comment')
//     const phone = modifiedpax.get('phone')
//     const name = `${modifiedpax.get('firstName')} ${modifiedpax.get('lastName')}`
//     return (
//       <ListItem onPress={this._toPaxDetails(modifiedpax)}>
//         <Body>
//           <Text>{name}</Text>
//           <Text note>{modifiedpax.get('booking').get('id')}</Text>
//           {comment === id && <Text note>{paxComment}</Text>}
//         </Body>
//         <Right style={ss.itemRight}>
//           {!!paxComment && this._renderComment(id)}
//           {!!phone && this._renderPhone(phone)}
//           {!!phone && this._renderSMS(phone)}
//         </Right>
//       </ListItem>
//     )
//   }
// }

class PaxList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comment: null,
      searchText: ''
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !nextProps.trip.equals(this.props.trip) ||
            nextState.searchText !== this.state.searchText ||
            nextState.comment !== this.state.comment ||
            !nextProps.pax.equals(this.props.pax)
  }

  _toPaxDetails = pax => {
    const { navigation } = this.props
    return () => {
      navigation.navigate('PaxDetails', { pax })
    }
  }

  _renderPhone = number => <IconButton name='phone' color='green' onPress={() => call(number)} />

  _renderSMS = number => <IconButton name='sms' color='blue' onPress={() => sms(number)} />

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

  _onInfoPress = value => {
    this.setState(value)
  }

  _renderPerson = ({ item, index }) => {
    if (item.get('first')) {
      return (
        <ListItem itemDivider style={{ backgroundColor: Colors.headerBg }}>
          <Text style={ss.sectionText}>{item.get('initial')}</Text>
        </ListItem>
      )
    }

    const id = String(item.get('id'))
    const { pax } = this.props
    const modifiedData = pax.get('modifiedData').get(id) || item
    const paxComment = modifiedData.get('comment')
    const phone = modifiedData.get('phone')
    const name = `${modifiedData.get('firstName')} ${modifiedData.get('lastName')}`
    const { comment } = this.state
    return (
      <ListItem onPress={this._toPaxDetails(modifiedData)}>
        <Body>
          <Text>{name}</Text>
          <Text note>{modifiedData.get('booking').get('id')}</Text>
          {comment === id && <Text note>{paxComment}</Text>}
        </Body>
        <Right style={ss.itemRight}>
          {!!paxComment && this._renderComment(id)}
          {!!phone && this._renderPhone(phone)}
          {!!phone && this._renderSMS(phone)}
        </Right>
      </ListItem>
    )

    // const { pax } = this.props
    // const { comment } = this.state
    // return (
    //   <PaxItem
    //     item={item}
    //     modifiedData={pax.get('modifiedData')}
    //     comment={comment}
    //     onInfoIconPress={this._onInfoPress}
    //   />
    // )
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

const stateToProps = state => ({
  pax: getPaxFromStore(state)
})

export default connect(stateToProps, null)(PaxList)

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
