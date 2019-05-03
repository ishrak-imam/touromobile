
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View, ListItem, Text, Right } from 'native-base'
import CheckBox from './checkBox'
import { format } from 'date-fns'
import { getExcursions, getParticipants } from '../selectors'
import { connect } from 'react-redux'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { actionDispatcher } from '../utils/actionDispatcher'
import { setParticipants } from '../modules/modifiedData/action'
import { getSet } from '../utils/immutable'
import _T from '../utils/translator'
import { IonIcon, Colors } from '../theme'

const DATE_FORMAT = 'YYYY-MM-DD HH:mm'

class ExcursionOrderSummaryMode extends Component {
  _onSelect = (excursionId, participants, paxId, method) => {
    const { departureId, bookingId } = this.props
    return () => {
      actionDispatcher(setParticipants({
        departureId,
        bookingId,
        excursionId,
        participants: participants[method](paxId)
      }))
    }
  }

  _operateOnParticipantSet = (pax, participants, operation) => {
    return pax.reduce((map, p) => {
      const paxId = String(p.get('id'))
      map = map[operation](paxId)
      return map
    }, participants)
  }

  _onBatchSelect = (excursionId, exParticipants, pax, isAllSelected, isAnySelected) => {
    const { departureId, bookingId } = this.props
    return () => {
      let participants = exParticipants
      if (isAllSelected) participants = this._operateOnParticipantSet(pax, exParticipants, 'remove')
      else participants = this._operateOnParticipantSet(pax, exParticipants, 'add')
      actionDispatcher(setParticipants({
        departureId,
        bookingId,
        excursionId,
        participants
      }))
    }
  }

  _getExcursionData = (pax, participants) => {
    const isAllSelected = pax.reduce((flag, p) => {
      const paxId = String(p.get('id'))
      return (flag && participants.has(paxId)) || p.get('excursionPack')
    }, true)

    const isAllHasPack = pax.reduce((flag, p) => {
      return flag && p.get('excursionPack')
    }, true)

    const isAnySelected = pax.some(p => {
      const paxId = String(p.get('id'))
      return participants.has(paxId)
    })

    return {
      isAllSelected, isAllHasPack, isAnySelected
    }
  }

  _renderExcursionItem = (paxList, participants) => ({ item }) => {
    const { bookingId } = this.props
    const excursionId = String(item.get('id'))
    const exParticipants = participants.getIn([excursionId, bookingId]) || getSet([])
    const { isAllSelected, isAllHasPack, isAnySelected } = this._getExcursionData(paxList, exParticipants)
    const onPress = isAllHasPack ? null : this._onBatchSelect(excursionId, exParticipants, paxList, isAllSelected, isAnySelected)

    let iconName = 'checkOutline'
    let iconColor = Colors.black
    if (isAllSelected || isAnySelected || isAllHasPack) {
      iconColor = Colors.blue
      if (isAllSelected || isAllHasPack) {
        iconName = 'checkFill'
      }
    }

    return (
      <View style={ss.itemContainer}>

        <ListItem style={ss.item} onPress={onPress}>
          <View style={ss.left}>
            <Text style={ss.itemText}>{item.get('name')}</Text>
            <Text note style={ss.time}>{format(item.get('start'), DATE_FORMAT)}</Text>
          </View>
          <Right style={ss.right}>
            <IonIcon name={iconName} color={iconColor} size={27} />
          </Right>
        </ListItem>

        {
          paxList.map(pax => {
            const paxId = String(pax.get('id'))
            const excursionPack = pax.get('excursionPack')
            if (excursionPack) {
              return (
                <ListItem style={ss.subItem} key={paxId}>
                  <View style={ss.subLeft}>
                    <CheckBox checked={excursionPack} />
                  </View>
                  <View style={ss.subMiddle}>
                    <Text>{pax.get('firstName')} {pax.get('lastName')}</Text>
                  </View>
                  <View style={ss.subRight}>
                    <IonIcon name='star' size={22} color={Colors.blue} />
                  </View>
                </ListItem>
              )
            }

            const selected = exParticipants.has(paxId)
            const method = selected ? 'delete' : 'add'
            return (
              <ListItem
                style={ss.subItem}
                key={String(pax.get('id'))}
                onPress={this._onSelect(excursionId, exParticipants, paxId, method)}
              >
                <View style={ss.subLeft}>
                  <CheckBox checked={selected} />
                </View>
                <View style={ss.subMiddle}>
                  <Text>{pax.get('firstName')} {pax.get('lastName')}</Text>
                </View>
                <View style={ss.subRight} />
              </ListItem>
            )
          })
        }

      </View>
    )
  }

  _renderExcursions = (excursions, pax, participants) => {
    return (
      <ImmutableVirtualizedList
        immutableData={excursions}
        renderItem={this._renderExcursionItem(pax, participants)}
        keyExtractor={item => String(item.get('id'))}
        renderEmpty={_T('noExcursions')}
      />
    )
  }

  render () {
    const { excursions, pax, participants } = this.props
    return (
      <View style={ss.container}>
        {this._renderExcursions(excursions, pax, participants)}
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

export default connect(stateToProps, null)(ExcursionOrderSummaryMode)

const ss = StyleSheet.create({
  container: {
    marginTop: 5
  },
  itemContainer: {
    marginBottom: 10,
    paddingLeft: 5
  },
  item: {
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingTop: 5,
    paddingBottom: 5
  },
  left: {
    flex: 4
  },
  right: {
    flex: 1
  },
  subItem: {
    borderBottomWidth: 0,
    marginLeft: 5,
    paddingTop: 5,
    paddingBottom: 5
  },
  subLeft: {
    flex: 0.5
  },
  subMiddle: {
    flex: 4
  },
  subRight: {
    flex: 0.5,
    alignItems: 'flex-end'
  },
  itemText: {
    fontWeight: 'bold'
  },
  time: {
    marginTop: 5
  }
})
