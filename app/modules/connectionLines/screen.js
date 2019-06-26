
import React, { Component } from 'react'
import { Container } from 'native-base'
import Header from '../../components/header'
import { StyleSheet } from 'react-native'
import _T from '../../utils/translator'
import { connect } from 'react-redux'
import { getConnectionLines, formatConnectionLines } from '../../selectors'
import Line from './line'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'

class ConnectionLines extends Component {
  _onPageChange = pageNumber => {
    this.scrollableTab._onTabSelect(pageNumber)()
  }

  _onTabSwitch = pageNumber => {
    this.pager._slideTo(pageNumber)
  }

  _renderLine = ({ item }) => {
    return <Line line={item} />
  }

  render () {
    const { navigation, lines } = this.props
    return (
      <Container>
        <Header left='back' title={_T('connections')} navigation={navigation} />

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
  lines: formatConnectionLines(getConnectionLines(state))
})

export default connect(stateToProps, null)(ConnectionLines)

const ss = StyleSheet.create({
  scrollTab: {
    marginTop: 5
  },
  list: {
    alignItems: 'center',
    paddingBottom: 20
  }
})
