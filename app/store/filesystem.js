
import { FileSystem } from 'expo'

const BASE_DIR = FileSystem.documentDirectory
const STORAGE_DIR = `${BASE_DIR}reduxStorage/`
const STORAGE_FILE = `${STORAGE_DIR}store.json`

const checkIfExistsDir = () => {
  return FileSystem.getInfoAsync(STORAGE_DIR)
}

const createDir = () => {
  return FileSystem.makeDirectoryAsync(STORAGE_DIR, { intermediates: true })
}

const FileSystemStorage = {
  getItem: () => FileSystem.readAsStringAsync(STORAGE_FILE),
  setItem: async (key, value) => {
    const { exists } = await checkIfExistsDir()
    if (!exists) {
      await createDir()
    }
    return FileSystem.writeAsStringAsync(STORAGE_FILE, value)
  },
  clearData: () => FileSystem.writeAsStringAsync(STORAGE_FILE, '')
}

export default FileSystemStorage
