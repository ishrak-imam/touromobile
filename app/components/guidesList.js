
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
import OverlaySpinner from './overlaySpinner'
import { networkActionDispatcher, actionDispatcher } from '../utils/actionDispatcher'
import { guidesListReq, setGuideId } from '../modules/guides/action'
import { navigate } from '../navigation/service'

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
    const { guides } = this.props
    const data = guides.get('data')
    if (!data.size) {
      this._requestGuidesList(false)
    }
  }

  _onRefresh = () => {
    this._requestGuidesList(true)
  }

  _requestGuidesList = (isRefreshing) => {
    networkActionDispatcher(guidesListReq({ isNeedJwt: true, isRefreshing }))
  }

  _onPressGuide = guide => {
    return () => {
      const guideId = guide.get('id')
      actionDispatcher(setGuideId(guideId))

      navigate('TripsLoading')
    }
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
      <ListItem style={{ height: 45 }} onPress={this._onPressGuide(item)}>
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
        onRefresh={this._onRefresh}
        refreshing={false}
      />
    )
  }

  _renderSpinner = () => {
    return (
      <View style={ss.spinner}>
        <OverlaySpinner />
      </View>
    )
  }

  render () {
    const { guides } = this.props
    const isLoading = guides.get('isLoading')
    const isRefreshing = guides.get('isRefreshing')
    return (
      <View styles={ss.container}>
        <SearchBar
          onSearch={this._onSearch}
          icon='people'
          placeholder={_T('search')}
        />
        { isLoading
          ? this._renderSpinner()
          : this._renderGuidesList()
        }
        {isRefreshing && <OverlaySpinner />}
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
  },
  spinner: {
    marginTop: 40
  }
})
