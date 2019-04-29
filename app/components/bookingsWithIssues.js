
import React, { Component } from 'react'
import {
  ListItem, Left, Text, Body
} from 'native-base'
import { View, StyleSheet } from 'react-native'
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
      bookings = bookings.map(b => <Text key={b}>{b}</Text>)
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
    const icon = isExpanded ? 'up' : 'down'

    return (
      <View>
        <ListItem style={ss.header} onPress={this._onHeaderPress}>
          <Left style={ss.bottomLeft}>
            <IonIcon name={icon} style={ss.expandIcon} />
            <Text style={ss.label}>{label}</Text>
          </Left>
        </ListItem>

        {
          isExpanded

            ? this._renderIssues(issues, orderIssues)

            : <ListItem style={ss.expandItem}>
              <Text style={ss.expandText}>{_T('clickToExpand')}</Text>
            </ListItem>
        }

      </View>
    )
  }
}

const ss = StyleSheet.create({
  expandItem: {
    borderBottomWidth: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  expandText: {
    fontSize: 14
  },
  header: {
    marginRight: 15,
    paddingBottom: 5,
    borderBottomColor: Colors.steel,
    borderBottomWidth: 1,
    paddingRight: 0,
    marginLeft: 15,
    marginBottom: 10
  },
  bottomLeft: {
    flex: 2
  },
  bottomRight: {
    flex: 1,
    paddingRight: 10
  },
  expandIcon: {
    marginRight: 10,
    fontWeight: 'bold'
  },
  label: {
    fontWeight: 'bold',
    fontSize: 13
  },
  issueLabel: {
    marginBottom: 10,
    fontWeight: 'bold'
  }
})
