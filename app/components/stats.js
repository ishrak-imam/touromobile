
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import {
  View, CardItem, Left, Body, Right, Text,
  ListItem
} from 'native-base'
import { connect } from 'react-redux'
import {
  getParticipants, getPax, getSortedExcursions,
  getParticipatingPax
} from '../selectors'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { getMap } from '../utils/immutable'
import { percentage } from '../utils/mathHelpers'
import Button from '../components/button'
import { IonIcon } from '../theme'
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
    const participatingPax = getParticipatingPax(getMap({ pax, participants }))
    const total = pax.size
    const participating = participatingPax.size
    const share = percentage(participating, total)
    return (
      <ListItem style={[ss.item, { backgroundColor }]}>
        <Left style={ss.left}>
          <Text>{name}</Text>
        </Left>
        <Body style={ss.body}>
          <Text>{participating}/{total}</Text>
        </Body>
        <Right style={ss.right}>
          <Text>{share}%</Text>
        </Right>
      </ListItem>
    )
  }
}

class Stats extends Component {
  _renderTop = paxCount => {
    return (
      <CardItem>
        <Body><Text style={ss.boldText}>{_T('totalPax')}: {paxCount}</Text></Body>
      </CardItem>
    )
  }

  _renderListHeader = () => {
    return (
      <ListItem style={ss.item}>
        <Left style={ss.left}>
          <Text style={ss.boldText}>{_T('excursion')}</Text>
        </Left>
        <Body style={ss.body}>
          <Text style={ss.boldText}>{_T('participants')}</Text>
        </Body>
        <Right style={ss.right}>
          <Text style={ss.boldText}>{_T('share')}</Text>
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

  _renderList = (pax) => {
    const { trip } = this.props
    const sortedExcursions = getSortedExcursions(trip)

    return (
      <ImmutableVirtualizedList
        immutableData={sortedExcursions}
        renderItem={this._renderExcursItem(pax)}
        keyExtractor={item => String(item.get('id'))}
      />
    )
  }

  _renderUploadButton = () => {
    return (
      <CardItem>
        <Button iconLeft style={ss.footerButton} onPress={() => {}}>
          <IonIcon name='upload' color='white' />
          <Text>{_T('upload')}</Text>
        </Button>
      </CardItem>
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
        {this._renderUploadButton()}
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

const stateToProps = state => ({
  participants: getParticipants(state)
})

export default connect(stateToProps, null)(Stats)

const ss = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    marginLeft: 0,
    paddingLeft: 20,
    paddingVertical: 5,
    justifyContent: 'center'
  },
  left: {
    flex: 2
  },
  body: {
    flex: 2,
    alignItems: 'center'
  },
  right: {
    flex: 2,
    alignItems: 'center'
  },
  boldText: {
    fontWeight: 'bold'
  },
  footerButton: {
    flex: 1,
    justifyContent: 'center'
  }
})
