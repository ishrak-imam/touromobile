
import { getImmutableObject } from './immutable'

const BEVERAGES_LIST = [
  { 'id': 201, 'name': 'Beer' },
  { 'id': 202, 'name': 'Wine' },
  { 'id': 203, 'name': 'Fanta' },
  { 'id': 204, 'name': 'Coca Cola' },
  { 'id': 205, 'name': 'Sprite' },
  { 'id': 206, 'name': 'Water' }
]

const beverages = getImmutableObject(BEVERAGES_LIST)

export default beverages
