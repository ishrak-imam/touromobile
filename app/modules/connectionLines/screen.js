
import React, { Component } from 'react'
import { Container } from 'native-base'
import Header from '../../components/header'
import { StyleSheet, TouchableOpacity } from 'react-native'
import _T from '../../utils/translator'
import { connect } from 'react-redux'
import {
  getConnectionLines,
  formatConnectionLines,
  getBrand
} from '../../selectors'
import Line from './line'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { IonIcon, Colors } from '../../theme'

class ConnectionLines extends Component {
  static navigationOptions = () => {
    return {
      tabBarIcon: ({ focused, tintColor }) => {
        return <IonIcon name='bus' color={tintColor} />
      },
      tabBarLabel: _T('connections')
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      expand: false
    }
  }

  _onPageChange = pageNumber => {
    this.scrollableTab._onTabSelect(pageNumber)()
  }

  _onTabSwitch = pageNumber => {
    this.pager._slideTo(pageNumber)
  }

  _renderLine = ({ item }) => {
    const { expand } = this.state
    return <Line line={item} expand={expand} />
  }

  _onHeaderRightPress = () => {
    this.setState({ expand: !this.state.expand })
  }

  _renderHeaderRight = () => {
    const { expand } = this.state
    const icon = expand ? 'up' : 'down'
    return (
      <TouchableOpacity style={ss.expand} onPress={this._onHeaderRightPress}>
        <IonIcon name={icon} color={Colors.white} size={30} />
      </TouchableOpacity>
    )
  }

  render () {
    const { navigation, lines, brand } = this.props
    return (
      <Container>
        <Header
          brand={brand}
          left='menu'
          title={_T('connections')}
          navigation={navigation}
          right={this._renderHeaderRight()}
        />

        <ImmutableVirtualizedList
          contentContainerStyle={ss.list}
          keyboardShouldPersistTaps='always'
          immutableData={lines.valueSeq()}
          renderItem={this._renderLine}
          keyExtractor={item => String(item.get('name'))}
        />

      </Container>
    )
  }
}

const stateToProps = state => ({
  lines: formatConnectionLines(getConnectionLines(state)),
  brand: getBrand(state)
})

export default connect(stateToProps, null)(ConnectionLines)

const ss = StyleSheet.create({
  scrollTab: {
    marginTop: 5
  },
  list: {
    alignItems: 'center',
    paddingBottom: 20
  },
  expand: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 10
  }
})
