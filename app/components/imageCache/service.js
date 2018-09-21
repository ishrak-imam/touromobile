
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

export const downloadFile = (uri, name) => {
  return FileSystem.downloadAsync(uri, `${IMAGE_CACHE_DIR}${name}`)
}

export const clearCache = async () => {
  const files = await FileSystem.readDirectoryAsync(IMAGE_CACHE_DIR)
  return Promise.all(files.map(fileName => FileSystem.deleteAsync(`${IMAGE_CACHE_DIR}${fileName}`)))
}
