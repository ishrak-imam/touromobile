
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View, ListItem, Left, Text, Right, Body } from 'native-base'
import { Colors } from '../theme'
import CheckBox from './checkBox'
import { format } from 'date-fns'
import { getExcursions, getParticipants } from '../selectors'
import { connect } from 'react-redux'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { actionDispatcher } from '../utils/actionDispatcher'
import { setParticipants } from '../modules/modifiedData/action'
import { getSet } from '../utils/immutable'
import _T from '../utils/translator'

const DATE_FORMAT = 'YYYY-MM-DD HH:mm'

class ExcursionOrderIndividualMode extends Component {
  _onSelect = (excursionId, participants, paxId, method) => {
    const { departureId } = this.props
    return () => {
      actionDispatcher(setParticipants({
        departureId,
        excursionId,
        participants: participants[method](paxId)
      }))
    }
  }

  _renderItem = (participants, pax) => {
    const paxId = String(pax.get('id'))
    return ({ item }) => {
      const excursionId = String(item.get('id'))
      const exParticipants = participants.get(excursionId) || getSet([])
      const selected = exParticipants.has(paxId)
      const method = selected ? 'delete' : 'add'
      return (
        <ListItem style={ss.item} onPress={this._onSelect(excursionId, exParticipants, paxId, method)}>
          <CheckBox checked={selected} />
          <Body style={ss.right}>
            <Text>{item.get('name')}</Text>
            <Text note>{format(item.get('start'), DATE_FORMAT)}</Text>
          </Body>
        </ListItem>
      )
    }
  }

  _renderExcursions = (excursions, pax) => {
    const { participants, listKey } = this.props
    return (
      <ImmutableVirtualizedList
        listKey={listKey}
        immutableData={excursions}
        renderItem={this._renderItem(participants, pax)}
        keyExtractor={item => String(item.get('id'))}
      />
    )
  }

  render () {
    const { excursions, pax } = this.props
    return (
      <View style={ss.container}>
        <ListItem style={ss.header}>
          <Left style={ss.headerLeft}>
            <Text style={ss.headerText}>{_T('excursionOrders')}</Text>
          </Left>
          <Right style={ss.headerRight} />
        </ListItem>

        {this._renderExcursions(excursions, pax)}
      </View>
    )
  }
}

const stateToProps = (state, props) => {
  const { departureId } = props
  return {
    excursions: getExcursions(state),
    participants: getParticipants(state, departureId)
  }
}

export default connect(stateToProps, null)(ExcursionOrderIndividualMode)

const ss = StyleSheet.create({
  container: {
    marginHorizontal: 15
  },
  header: {
    marginLeft: 0,
    marginRight: 0,
    paddingBottom: 5,
    borderBottomColor: Colors.steel,
    borderBottomWidth: 1,
    paddingRight: 0,
    marginBottom: 5
  },
  headerLeft: {
    flex: 3
  },
  headerRight: {
    flex: 2
  },
  headerText: {
    fontWeight: 'bold'
  },
  item: {
    marginLeft: 0,
    marginRight: 0,
    borderBottomWidth: 0,
    paddingTop: 5,
    paddingBottom: 10
  },
  right: {
    flex: 4
  }
})
