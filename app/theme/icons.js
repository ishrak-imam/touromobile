import React from 'react'
import { Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { get, first, last } from 'lodash'

const getIconName = (name) => {
  const isIOS = Platform.OS === 'ios'
  const icons = {
    hamburger: ['ios-menu', 'md-menu'],
    home: ['ios-home', 'md-home'],
    people: ['ios-people', 'md-people'],
    excursion: ['ios-pin', 'md-pin'],
    phone: ['ios-call', 'md-call'],
    sms: ['ios-text', 'md-text'],
    information: ['ios-information-circle', 'md-information-circle'],
    up: ['ios-arrow-up', 'ios-arrow-up'],
    down: ['ios-arrow-down', 'ios-arrow-down'],
    close: ['ios-close', 'md-close'],
    edit: ['ios-create', 'md-create'],
    check: ['ios-checkmark', 'md-checkmark'],
    report: ['ios-cloud-upload', 'md-cloud-upload'],
    logout: ['ios-log-out', 'md-log-out'],
    settings: ['ios-settings', 'md-settings'],
    forward: ['ios-arrow-forward', 'md-arrow-forward'],
    booking: ['ios-pricetag', 'md-pricetag'],
    lunch: ['ios-restaurant', 'md-restaurant'],
    search: ['ios-search', 'md-search'],
    map: ['ios-map', 'md-map'],
    web: ['ios-globe', 'md-globe'],
    x: ['ios-close', 'md-close']
  }
  const result = get(icons, name, [])
  return isIOS ? first(result) : last(result)
}

const IonIcon = (props) => {
  const { name, size = 22, ...rest } = props
  return <Ionicons name={getIconName(name)} size={size} {...rest} />
}

export default IonIcon
