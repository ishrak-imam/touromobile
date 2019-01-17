
/* eslint-disable */

import { FileSystem } from 'expo'

const BASE_DIR = FileSystem.cacheDirectory

export const IMAGE_CACHE_DIR = `${BASE_DIR}imageCache/`

export const checkIfExistsDir = () => {
  return FileSystem.getInfoAsync(IMAGE_CACHE_DIR)
}

export const checkIfExistsImage = imageName => {
  return FileSystem.getInfoAsync(`${IMAGE_CACHE_DIR}${imageName}`)
}

export const createDirectory = () => {
  return FileSystem.makeDirectoryAsync(IMAGE_CACHE_DIR, { intermediates: true })
}

export const downloadFile = async (uri, name) => {
  const { status } = await FileSystem.downloadAsync(uri, `${IMAGE_CACHE_DIR}${name}`)
  if (status !== 200) {
    await FileSystem.deleteAsync(`${IMAGE_CACHE_DIR}${name}`)
    return Promise.reject('fail')
  }
  return Promise.resolve('success')
}

export const clearCache = async () => {
  const files = await FileSystem.readDirectoryAsync(IMAGE_CACHE_DIR)
  return Promise.all(files.map(fileName => FileSystem.deleteAsync(`${IMAGE_CACHE_DIR}${fileName}`)))
}
