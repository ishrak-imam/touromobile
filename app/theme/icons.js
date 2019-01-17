import React from 'react'
import isIOS from '../utils/isIOS'
import { Ionicons } from '@expo/vector-icons'

const getIconName = name => {
  const icons = {
    upload: ['md-cloud-upload', 'md-cloud-upload'],
    menu: ['ios-menu', 'md-menu'],
    home: ['ios-home', 'md-home'],
    people: ['ios-people', 'md-people'],
    person: ['ios-person', 'md-person'],
    excursion: ['ios-pin', 'md-pin'],
    phone: ['ios-call', 'md-call'],
    sms: ['ios-text', 'md-text'],
    info: ['ios-information-circle', 'md-information-circle'],
    up: ['ios-arrow-up', 'ios-arrow-up'],
    down: ['ios-arrow-down', 'ios-arrow-down'],
    x: ['ios-close', 'md-close'],
    circleX: ['ios-close-circle', 'md-close-circle'],
    edit: ['ios-create', 'md-create'],
    check: ['ios-checkmark', 'md-checkmark'],
    stats: ['ios-stats', 'md-stats'],
    logout: ['ios-log-out', 'md-log-out'],
    settings: ['ios-settings', 'md-settings'],
    forward: ['ios-arrow-forward', 'md-arrow-forward'],
    booking: ['ios-pricetag', 'md-pricetag'],
    lunch: ['ios-restaurant', 'md-restaurant'],
    search: ['ios-search', 'md-search'],
    map: ['ios-map', 'md-map'],
    web: ['ios-globe', 'md-globe'],
    back: ['ios-arrow-back', 'md-arrow-back'],
    futureTrips: ['ios-paper-plane', 'md-paper-plane'],
    pastTrips: ['ios-time', 'md-time'],
    star: ['ios-star', 'md-star'],
    bus: ['ios-bus', 'md-bus'],
    flight: ['ios-airplane', 'md-airplane'],
    warning: ['ios-warning', 'md-warning'],
    refresh: ['md-refresh', 'md-refresh'],
    delete: ['ios-trash', 'md-trash'],
    sort: ['ios-list', 'md-list'],
    checkFill: ['ios-checkmark-circle', 'md-checkmark-circle'],
    checkOutline: ['ios-checkmark-circle-outline', 'md-checkmark-circle-outline'],
    plus: ['ios-add', 'md-add'],
    minus: ['ios-remove', 'md-remove'],
    undo: ['ios-undo', 'md-undo'],
    radioOff: ['ios-radio-button-off', 'md-radio-button-off']
  }
  const result = icons[name]
  return isIOS ? result[0] : result[1]
}

const IonIcon = (props) => {
  const { name, size = 25, ...rest } = props
  return <Ionicons name={getIconName(name)} size={size} {...rest} />
}

export default IonIcon
