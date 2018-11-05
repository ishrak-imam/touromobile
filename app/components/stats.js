
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
import { getMap } from '../utils/immutable'
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
    const data = getMap({ pax, participants })
    const participatingPax = getParticipatingPax(data)
    const actualParticipatingPax = getActualParticipatingPax(data)
    const total = pax.size
    const participating = participatingPax.size

    const share = percentage(participating, total)
    return (
      <ListItem style={[ss.item, { backgroundColor }]}>
        <Left style={ss.name}>
          <Text>{name}</Text>
        </Left>
        <Body style={ss.participants}>
          <Text>{participating}/{total}</Text>
        </Body>
        <Body style={ss.sale}>
          <Text>{actualParticipatingPax.size}/{total}</Text>
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
      <CardItem>
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

  _renderListFooter = () => {
    const { excursions, participants, trip } = this.props
    const pax = getPax(trip)
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
      return (
        <StatItem
          excursion={item}
          participants={participants.get(String(item.get('id')))}
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
        immutableData={sortedExcursions}
        renderItem={this._renderExcursItem(pax)}
        keyExtractor={item => String(item.get('id'))}
        ListFooterComponent={this._renderListFooter(pax)}
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
    const { trip } = this.props
    const excursions = trip.get('excursions')

    return (
      <View style={ss.container}>
        {!!excursions && excursions.size && this._renderStats()}
      </View>
    )
  }
}

const ss = StyleSheet.create({
  container: {
    flex: 1
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
    fontSize: 12
  }
})
