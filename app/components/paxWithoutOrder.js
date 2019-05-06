
import React, { Component } from 'react'
import {
  ListItem, Left, Text,
  Right
} from 'native-base'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors, IonIcon } from '../theme'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import _T from '../utils/translator'

const ITEM_HEIGHT = 45

class PaxItem extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.pax.equals(this.props.pax)
  }
  render () {
    const { pax } = this.props
    const paxId = pax.get('id')
    const paxName = `${pax.get('firstName')} ${pax.get('lastName')}`
    const bookingId = pax.get('booking').get('id')
    return (
      <ListItem style={ss.item} key={paxId}>
        <Left style={ss.bottomLeft}>
          <Text>{paxName}</Text>
        </Left>
        <Right style={ss.bottomRight}>
          <Text>{bookingId}</Text>
        </Right>
      </ListItem>
    )
  }
}

export default class PaxWithoutOrder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isExpanded: false
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return !nextProps.paxList.equals(this.props.paxList) ||
              nextState.isExpanded !== this.state.isExpanded
  }

  _onHeaderPress = () => {
    this.setState({ isExpanded: !this.state.isExpanded })
  }

  _renderItem = ({ item }) => <PaxItem pax={item} />

  render () {
    const { paxList, label } = this.props
    const { isExpanded } = this.state
    const icon = isExpanded ? 'minus' : 'plus'

    return (
      <View style={ss.container}>
        <TouchableOpacity style={ss.topHeader} onPress={this._onHeaderPress}>
          <View style={ss.sectionIcon}>
            <IonIcon name={icon} size={22} />
          </View>
          <Text style={ss.headerText}>{_T(label)}</Text>
        </TouchableOpacity>

        {
          isExpanded

            ? <ImmutableVirtualizedList
              scrollEnabled={false}
              keyboardShouldPersistTaps='always'
              immutableData={paxList}
              renderItem={this._renderItem}
              keyExtractor={item => String(item.get('id'))}
              getItemLayout={(data, index) => (
                { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
              )}
            />

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
    marginHorizontal: 10
  },
  expandItem: {
    height: 40,
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
  item: {
    height: ITEM_HEIGHT,
    marginRight: 15,
    borderBottomWidth: 0,
    paddingRight: 0,
    marginLeft: 15
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
  }
})
