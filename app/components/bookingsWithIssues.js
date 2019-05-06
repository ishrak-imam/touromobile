
import React, { Component } from 'react'
import {
  ListItem, Text, Body
} from 'native-base'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors, IonIcon } from '../theme'
import _T from '../utils/translator'

export default class BookingsWithIssues extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isExpanded: false
    }
  }

  _onHeaderPress = () => {
    this.setState({ isExpanded: !this.state.isExpanded })
  }

  _renderIssues = (issues, orderIssues) => {
    return issues.map(issue => {
      const orderIssue = orderIssues[issue]
      let { desc, bookings } = orderIssue
      bookings = bookings.map(b => <Text key={b} note>{b}</Text>)
      return (
        <ListItem key={issue}>
          <Body>
            <Text style={ss.issueLabel}>{_T(desc)}</Text>
            {bookings}
          </Body>
        </ListItem>
      )
    })
  }

  render () {
    const { issues, orderIssues, label } = this.props
    const { isExpanded } = this.state
    const icon = isExpanded ? 'minus' : 'plus'

    return (
      <View style={ss.container}>
        <TouchableOpacity style={ss.topHeader} onPress={this._onHeaderPress}>
          <View style={ss.sectionIcon}>
            <IonIcon name={icon} size={22} />
          </View>
          <Text style={ss.headerText}>{label}</Text>
        </TouchableOpacity>

        {
          isExpanded

            ? this._renderIssues(issues, orderIssues)

            : <View style={ss.expandItem}>
              <Text style={ss.expandText}>{_T('clickToExpand')}</Text>
            </View>
        }

      </View>
    )
  }
}

const ss = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginHorizontal: 10
  },
  expandItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topHeader: {
    height: 45,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: Colors.cloud,
    marginVertical: 5,
    paddingLeft: 10
  },
  headerText: {
    fontWeight: 'bold',
    marginBottom: 3
  },
  sectionIcon: {
    marginRight: 10
  },
  expandText: {
    fontSize: 14
  },
  bottomRight: {
    flex: 1,
    paddingRight: 10
  },
  issueLabel: {
    marginBottom: 5
    // fontWeight: 'bold'
  }
})
