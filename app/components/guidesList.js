
import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { ListItem } from 'native-base'
import { connect } from 'react-redux'
import SearchBar from './searchBar'
import _T from '../utils/translator'
import {
  getGuidesData,
  getSortedGuides,
  getGuideDataGroup,
  filterGuidesBySearchText
} from '../selectors'
import { Colors } from '../theme'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'

import { networkActionDispatcher } from '../utils/actionDispatcher'
import { guidesListReq } from '../modules/guides/action'

class GuidesList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      searchText: ''
    }
  }

  _onSearch = searchText => {
    this.setState({ searchText })
  }

  componentDidMount () {
    this._requestGuidesList()
  }

  _requestGuidesList = () => {
    networkActionDispatcher(guidesListReq({ isNeedJwt: true }))
  }

  _renderGuide = ({ item }) => {
    if (item.get('first')) {
      const initial = item.get('header')
      return (
        <ListItem itemDivider style={ss.itemDivider}>
          <Text style={ss.sectionText}>{initial}</Text>
        </ListItem>
      )
    }

    const name = `${item.get('firstName')} ${item.get('lastName')}`

    return (
      <ListItem>
        <Text style={ss.name}>{name}</Text>
      </ListItem>
    )
  }

  _renderGuidesList = guidesList => {
    const { guides } = this.props
    const { searchText } = this.state
    let sortedGuides = guides.get('data')

    sortedGuides = getSortedGuides(sortedGuides)
    sortedGuides = filterGuidesBySearchText(sortedGuides, searchText)
    sortedGuides = getGuideDataGroup(sortedGuides)

    return (
      <ImmutableVirtualizedList
        contentContainerStyle={{ paddingBottom: 180 }}
        keyboardShouldPersistTaps='always'
        immutableData={sortedGuides}
        renderItem={this._renderGuide}
        keyExtractor={item => String(item.get('id'))}
        renderEmpty={_T('noMatch')}
      />
    )
  }

  render () {
    return (
      <View styles={ss.container}>
        <SearchBar
          onSearch={this._onSearch}
          icon='people'
          placeholder={_T('search')}
        />
        {this._renderGuidesList()}
      </View>
    )
  }
}

const stateToProps = state => ({
  guides: getGuidesData(state)
})

export default connect(stateToProps, null)(GuidesList)

const ss = StyleSheet.create({
  container: {
    flex: 1
  },
  itemDivider: {
    backgroundColor: Colors.blue
  },
  sectionText: {
    fontWeight: 'bold',
    color: Colors.silver
  }
})
