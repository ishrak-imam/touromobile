
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import {
  View, CardItem, Left, Body, Right, Text,
  ListItem
} from 'native-base'
import {
  getPax, getSortedExcursions, getTotalParticipantsCount,
  getParticipatingPax, getActualParticipatingPax,
  getActualTotalParticipantsCount, getPaxWithExcursionPack
} from '../selectors'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { getMap, getSet } from '../utils/immutable'
import { percentage } from '../utils/mathHelpers'
import Translator from '../utils/translator'
const _T = Translator('ReportsScreen')

const bgColors = ['#edeaea', '#ffffff']

class StatItem extends Component {
  shouldComponentUpdate (nexProps) {
    return !!nexProps.participants && !nexProps.participants.equals(this.props.participants)
  }

  render () {
    const { excursion, pax, participants, backgroundColor } = this.props
    const name = excursion.get('name')

    const exParticipants = participants.reduce((set, par) => {
      return set.merge(par)
    }, getSet([]))

    const data = getMap({ pax, participants: exParticipants })
    const participatingPax = getParticipatingPax(data)
    const actualParticipatingPax = getActualParticipatingPax(data)
    const paxWithExcursionPack = participatingPax.size - actualParticipatingPax.size
    const paxWithoutExcursionPack = pax.size - paxWithExcursionPack

    const share = percentage(actualParticipatingPax.size, paxWithoutExcursionPack)
    return (
      <ListItem style={[ss.item, { backgroundColor }]}>
        <Left style={ss.name}>
          <Text>{name}</Text>
        </Left>
        <Body style={ss.participants}>
          <Text>{participatingPax.size}/{pax.size}</Text>
        </Body>
        <Body style={ss.sale}>
          <Text>{actualParticipatingPax.size}/{paxWithoutExcursionPack}</Text>
        </Body>
        <Right style={ss.share}>
          <Text>{share}%</Text>
        </Right>
      </ListItem>
    )
  }
}

export default class Stats extends Component {
  _renderTop = paxCount => {
    return (
      <CardItem style={ss.headerItem}>
        <Body><Text style={ss.totalPax}>{_T('totalPax')}: {paxCount}</Text></Body>
      </CardItem>
    )
  }

  _renderListHeader = () => {
    return (
      <ListItem style={ss.item}>
        <Left style={ss.name}>
          <Text style={ss.headerText}>{_T('excursion')}</Text>
        </Left>
        <Body style={ss.participants}>
          <Text style={ss.headerText}>{_T('participants')}</Text>
        </Body>
        <Body style={ss.sale}>
          <Text style={ss.headerText}>{_T('sale')}</Text>
        </Body>
        <Right style={ss.share}>
          <Text style={ss.headerText}>{_T('share')}</Text>
        </Right>
      </ListItem>
    )
  }

  _renderListFooter = pax => {
    const { excursions, participants, trip } = this.props

    const totalParticipants = getTotalParticipantsCount(excursions, participants, trip)
    const actualTotalParticipants = getActualTotalParticipantsCount(excursions, participants, trip)
    const paxWithExcursionPack = getPaxWithExcursionPack(pax)

    const participant = percentage(totalParticipants, pax.size * excursions.size)
    const sale = percentage(actualTotalParticipants, (pax.size * excursions.size) - (paxWithExcursionPack.size * excursions.size))
    const share = percentage(totalParticipants, pax.size * excursions.size)

    return (
      <ListItem style={ss.item}>
        <Left style={ss.name}>
          <Text style={ss.totalPax}>{_T('totals')}</Text>
        </Left>
        <Body style={ss.participants}>
          <Text style={ss.totalPax}>{participant}%</Text>
        </Body>
        <Body style={ss.sale}>
          <Text style={ss.totalPax}>{sale}%</Text>
        </Body>
        <Right style={ss.share}>
          <Text style={ss.totalPax}>{share}%</Text>
        </Right>
      </ListItem>
    )
  }

  _renderExcursItem = pax => {
    const { participants } = this.props
    return ({ item, index }) => {
      const excursionId = String(item.get('id'))
      const exParticipants = participants.get(excursionId) || getMap({})
      return (
        <StatItem
          excursion={item}
          participants={exParticipants}
          pax={pax}
          backgroundColor={bgColors[index % bgColors.length]}
        />
      )
    }
  }

  _renderList = pax => {
    const { trip } = this.props
    const sortedExcursions = getSortedExcursions(trip)

    return (
      <ImmutableVirtualizedList
        contentContainerStyle={{ paddingBottom: 95 }}
        immutableData={sortedExcursions}
        renderItem={this._renderExcursItem(pax)}
        keyExtractor={item => String(item.get('id'))}
        ListFooterComponent={this._renderListFooter(pax)}
        renderEmpty={_T('noExcursions')}
      />
    )
  }

  _renderStats = () => {
    const { trip } = this.props
    const pax = getPax(trip)
    return (
      <View style={ss.container}>
        {this._renderTop(pax.size)}
        {this._renderListHeader()}
        {this._renderList(pax)}
      </View>
    )
  }

  render () {
    return (
      <View style={ss.container}>
        {this._renderStats()}
      </View>
    )
  }
}

const ss = StyleSheet.create({
  container: {
    flex: 1
  },
  headerItem: {
    paddingTop: 10,
    paddingBottom: 5
  },
  item: {
    marginLeft: 0,
    paddingRight: 0,
    paddingVertical: 5,
    justifyContent: 'center'
  },
  name: {
    flex: 2,
    paddingLeft: 20
  },
  participants: {
    flex: 2.5,
    alignItems: 'center'
  },
  sale: {
    flex: 2.5,
    alignItems: 'center'
  },
  share: {
    flex: 2,
    alignItems: 'center'
  },
  totalPax: {
    fontWeight: 'bold',
    fontSize: 16
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 10
  }
})
