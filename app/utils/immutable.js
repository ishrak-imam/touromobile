
import { Map, List, Set, fromJS } from 'immutable'

export const getImmutableObject = plainObject => {
  return fromJS(plainObject)
}

/**
 * Map methods
 */

export const getMap = plainObject => {
  return Map(plainObject)
}

export const mergeMapShallow = (map1, map2) => {
  return map1.merge(map2)
}

// export const mergeMapDeep = (map1, map2) => {
//   return map1.mergeDeep(map2)
// }

export const updateMap = (map, key, updater) => {
  return map.update(key, updater)
}

export const setIntoMap = (map, key, val) => {
  return map.set(key, val)
}

export const setIntoMapNested = (map, nest, val) => {
  return map.setIn(nest, val)
}

export const isMap = map => {
  return Map.isMap(map)
}

export const deleteFromMap = (map, key) => {
  return map.delete(key)
}

export const deleteAllFromMap = (map, keys) => {
  return map.deleteAll(keys)
}

/**
 * Set methods
 */

export const getSet = plainArray => {
  return Set(plainArray)
}

export const addToSet = (set, item) => {
  return set.add(item)
}

export const deleteFromSet = (set, item) => {
  return set.delete(item)
}

export const setHas = (set, item) => {
  return set.has(item)
}

export const clearSet = set => {
  return set.clear()
}

/**
 * List methods
 */

export const getList = plainArray => {
  return List(plainArray)
}

export const concatList = (list1, list2) => {
  return list1.concat(list2)
}

export const pushIntoList = (list, item) => {
  return list.push(item)
}

export const shiftFromList = list => {
  return list.shift()
}

/**
 * Data access methods
 */

export const readValue = (of, from) => {
  return from.get(of)
}

export const listToMap = (list, key) => {
  return list.reduce((map, item) => map.set(String(item.get(key)), item), getMap({}))
}

export const chunkList = (list, size) => {
  let chunkedList = getList([])
  const noOfChunks = Math.ceil(list.size / size)
  for (let i = 0; i < noOfChunks; i++) {
    chunkedList = chunkedList.push(list.slice(i * size, (i + 1) * size))
  }
  return chunkedList
}
